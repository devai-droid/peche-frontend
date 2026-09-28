/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event, Product } from "@/lib/orval/model"
import type { CartItem } from "@/features/product/hooks/use-cart"

// 언어별 name 필드 접미사 (useLanguageValue와 동일) — ko는 base name, 나머지는 해당 언어 필드
const NAME_SUFFIX: Record<string, string> = {
  ko: "",
  en: "EN",
  ja: "JA",
  th: "TH",
  zh: "ZH",
  "zh-TW": "ZHTW",
}

/**
 * 현재 언어 기준 표시 이름. 상품 매칭 폴백 키로 쓴다.
 * 해당 언어 필드가 비어있으면 base name으로 폴백(useLanguageValue와 동일 규칙).
 */
export const localizedItemName = (
  item: { name?: string } & Record<string, any>,
  lang: string,
): string => {
  const suffix = NAME_SUFFIX[lang] ?? ""
  return (item[`name${suffix}`] as string) || item.name || ""
}

/**
 * 최신 상품 색인.
 * - byId: 상품 고유 id로 정확히 찾기 (동일 이름 상품도 구분됨)
 * - byUniqueName: 현재 언어 이름이 목록에서 유일한 상품만 (임포트로 id가 바뀐 경우의 폴백용).
 *   같은 이름이 2개 이상이면 어느 쪽인지 특정할 수 없으므로 이 색인에서 제외한다.
 */
export interface FreshProductIndex {
  byId: Map<string, Product>
  byUniqueName: Map<string, Product>
}

export const buildFreshProductIndex = (products: Product[], lang: string): FreshProductIndex => {
  const byId = new Map<string, Product>()
  const nameCount = new Map<string, number>()
  products.forEach((p) => {
    byId.set(p.id, p)
    const key = localizedItemName(p, lang)
    if (key) nameCount.set(key, (nameCount.get(key) ?? 0) + 1)
  })
  const byUniqueName = new Map<string, Product>()
  products.forEach((p) => {
    const key = localizedItemName(p, lang)
    if (key && nameCount.get(key) === 1) byUniqueName.set(key, p) // 동일 이름은 제외(모호)
  })
  return { byId, byUniqueName }
}

/**
 * 카트 상품을 최신 상품으로 해석한다.
 * 1) id가 그대로 있으면 그 상품 — 재임포트가 안 된 정상 상황. 이름이 같아도 정확히 구분된다.
 * 2) 없으면 유일한 이름으로 — 임포트로 id가 바뀐 경우의 폴백.
 * 3) 이름이 중복이라 특정 못 하면 null(예약 불가로 처리).
 * index가 null이면 목록 미확보 → undefined(건드리지 않음).
 */
export const resolveFreshProduct = (
  cartProduct: Product,
  index: FreshProductIndex | null,
  lang: string,
): Product | null | undefined => {
  if (!index) return undefined
  const byId = index.byId.get(cartProduct.id)
  if (byId) return byId
  return index.byUniqueName.get(localizedItemName(cartProduct, lang)) ?? null
}

/**
 * 최신 목록 기준으로 체크된 항목 중 예약 불가(제거 대상) id 추출.
 * - 이벤트: 목록에서 사라졌거나(삭제) 게시기간이 끝난(만료) 경우 — id 기준
 * - 상품: 최신 상품으로 해석 불가(id 없음 + 이름 변경·삭제·동일 이름 모호) — resolveFreshProduct === null.
 *         상품 목록을 확보(freshProductIndex != null)했을 때만 판정.
 */
export const getInvalidCartItemIds = (
  cart: CartItem[],
  checkedList: string[],
  freshEventById: Map<string, Event>,
  freshProductIndex: FreshProductIndex | null,
  lang: string,
): string[] => {
  const ids: string[] = []
  cart.forEach((item) => {
    const id = item.event?.id || item.product?.id || ""
    if (!checkedList.includes(id)) return
    if (item.event) {
      const fresh = freshEventById.get(id)
      if (!fresh) {
        ids.push(id)
      } // 삭제된 이벤트
      else if (isEventExpired(fresh)) ids.push(id) // 만료된 이벤트
    } else if (item.product && freshProductIndex) {
      if (resolveFreshProduct(item.product, freshProductIndex, lang) === null) ids.push(id)
    }
  })
  return ids
}

/**
 * 담을 때 값과 최신 값이 다른(가격·설명 등 변경된) 체크 항목 id 추출.
 * - 이벤트: 같은 id로 정보가 바뀐 경우 — [price, discountPrice, name, description]
 * - 상품: id/유일이름으로 해석한 최신 상품과 가격·설명이 다른 경우 — [price, discountPrice, description]
 */
export const getChangedCartItemIds = (
  cart: CartItem[],
  checkedList: string[],
  freshEventById: Map<string, Event>,
  freshProductIndex: FreshProductIndex | null,
  lang: string,
): string[] => {
  const isDiff = (a: any, b: any, fields: string[]) =>
    fields.some((k) => (a?.[k] ?? null) !== (b?.[k] ?? null))
  const ids: string[] = []
  cart.forEach((item) => {
    const id = item.event?.id || item.product?.id || ""
    if (!checkedList.includes(id)) return
    if (item.event) {
      const fresh = freshEventById.get(id)
      if (fresh && isDiff(item.event, fresh, ["price", "discountPrice", "name", "description"])) {
        ids.push(id)
      }
    } else if (item.product && freshProductIndex) {
      const fresh = resolveFreshProduct(item.product, freshProductIndex, lang)
      if (fresh && isDiff(item.product, fresh, ["price", "discountPrice", "description"])) {
        ids.push(id)
      }
    }
  })
  return ids
}

/**
 * 이벤트가 예약 불가(만료) 상태인지 판정.
 * 방문일이 아니라 "지금 이 이벤트가 노출(게시)기간 중인지"로 판단한다.
 * 게시기간은 날짜 단위(KST) 의미이므로 저장된 시각은 무시하고 날짜로만 비교한다.
 */
export const isEventExpired = (event: Event): boolean => {
  const bundle = (event as any)?.bundle
  const postStart = bundle?.postStartDate ? new Date(bundle.postStartDate).getTime() : null
  const postEnd = bundle?.postEndDate ? new Date(bundle.postEndDate).getTime() : null
  const KST = 9 * 60 * 60 * 1000
  const DAY = 24 * 60 * 60 * 1000
  const todayStart = Math.floor((Date.now() + KST) / DAY) * DAY - KST
  const tomorrowStart = todayStart + DAY
  if (postStart !== null && postStart >= tomorrowStart) return true // 아직 시작 전
  if (postEnd !== null && postEnd < todayStart) return true // 이미 종료
  return false
}
