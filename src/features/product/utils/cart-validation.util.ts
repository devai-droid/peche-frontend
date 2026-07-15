/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event, Product } from "@/lib/orval/model"
import { CartItem } from "@/features/product/hooks/use-cart"

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

/**
 * 최신 목록 기준으로 체크된 항목 중 만료/삭제된 이벤트·상품 id 추출.
 * - 이벤트: 목록에서 사라졌거나(삭제) 게시기간이 끝난(만료) 경우
 * - 상품: 목록에서 사라진(삭제) 경우 — 상품 목록을 확보(freshProductById != null)했을 때만 판정
 */
export const getInvalidCartItemIds = (
  cart: CartItem[],
  checkedList: string[],
  freshEventById: Map<string, Event>,
  freshProductById: Map<string, Product> | null,
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
    } else if (item.product && freshProductById && !freshProductById.has(id)) {
      ids.push(id) // 삭제된 상품 (목록 확보 시에만 판정)
    }
  })
  return ids
}

/**
 * 담을 때 값과 최신 값이 다른(가격·이름·설명 등 변경된) 체크 항목 id 추출.
 * 같은 id로 정보만 바뀐 경우를 잡는다.
 */
export const getChangedCartItemIds = (
  cart: CartItem[],
  checkedList: string[],
  freshEventById: Map<string, Event>,
  freshProductById: Map<string, Product> | null,
): string[] => {
  const FIELDS = ["price", "discountPrice", "name", "description"] as const
  const isDiff = (a: any, b: any) => FIELDS.some((k) => (a?.[k] ?? null) !== (b?.[k] ?? null))
  const ids: string[] = []
  cart.forEach((item) => {
    const id = item.event?.id || item.product?.id || ""
    if (!checkedList.includes(id)) return
    if (item.event) {
      const fresh = freshEventById.get(id)
      if (fresh && isDiff(item.event, fresh)) ids.push(id)
    } else if (item.product && freshProductById) {
      const fresh = freshProductById.get(id)
      if (fresh && isDiff(item.product, fresh)) ids.push(id)
    }
  })
  return ids
}
