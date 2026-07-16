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
 * 현재 언어 기준 표시 이름. 상품/이벤트 매칭 키로 쓴다.
 * 해당 언어 필드가 비어있으면 base name으로 폴백(useLanguageValue와 동일 규칙).
 */
export const localizedItemName = (
  item: { name?: string } & Record<string, any>,
  lang: string,
): string => {
  const suffix = NAME_SUFFIX[lang] ?? ""
  return (item[`name${suffix}`] as string) || item.name || ""
}

/** 최신 상품 목록을 "현재 언어 이름 → 상품" Map으로 (임포트로 id가 바뀌어도 이름으로 추적) */
export const buildProductByName = (products: Product[], lang: string): Map<string, Product> => {
  const map = new Map<string, Product>()
  products.forEach((p) => {
    const key = localizedItemName(p, lang)
    if (key && !map.has(key)) map.set(key, p) // 동명 중복 시 첫 항목 유지
  })
  return map
}

/**
 * 최신 목록 기준으로 체크된 항목 중 예약 불가(제거 대상) id 추출.
 * - 이벤트: 목록에서 사라졌거나(삭제) 게시기간이 끝난(만료) 경우 — id 기준
 * - 상품: 현재 언어 이름이 최신 목록에 없는 경우(이름 변경 또는 삭제) — 이름 기준.
 *         상품 목록을 확보(freshProductByName != null)했을 때만 판정.
 */
export const getInvalidCartItemIds = (
  cart: CartItem[],
  checkedList: string[],
  freshEventById: Map<string, Event>,
  freshProductByName: Map<string, Product> | null,
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
    } else if (item.product && freshProductByName) {
      const key = localizedItemName(item.product, lang)
      if (!freshProductByName.has(key)) ids.push(id) // 이름 변경 또는 삭제
    }
  })
  return ids
}

/**
 * 담을 때 값과 최신 값이 다른(가격·설명 등 변경된) 체크 항목 id 추출.
 * - 이벤트: 같은 id로 정보가 바뀐 경우 — [price, discountPrice, name, description]
 * - 상품: 현재 언어 이름으로 매칭한 최신 상품과 가격·설명이 다른 경우 — [price, discountPrice, description]
 *         (이름은 매칭 키이므로 diff 대상에서 제외)
 */
export const getChangedCartItemIds = (
  cart: CartItem[],
  checkedList: string[],
  freshEventById: Map<string, Event>,
  freshProductByName: Map<string, Product> | null,
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
    } else if (item.product && freshProductByName) {
      const key = localizedItemName(item.product, lang)
      const fresh = freshProductByName.get(key)
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
