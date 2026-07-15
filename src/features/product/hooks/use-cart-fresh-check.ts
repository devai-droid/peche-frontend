import { useEventControllerFindMany } from "@/lib/orval/events/events"
import { useProductControllerFindMany } from "@/lib/orval/products/products"
import useLanguageQuery from "@/lib/hooks/use-language-query"
import { Event, Product } from "@/lib/orval/model"
import useCart from "@/features/product/hooks/use-cart"
import {
  getChangedCartItemIds,
  getInvalidCartItemIds,
  isEventExpired,
} from "@/features/product/utils/cart-validation.util"

/** 검증 결과: ok(이상 없음) / removed(만료·삭제) / changed(가격·정보 변경) */
export type CartCheckResult = "ok" | "removed" | "changed"

/**
 * 사이드 장바구니·모바일 탭바의 "예약하기"에서 예약 페이지로 넘어가기 전,
 * 담긴 상품/이벤트를 서버 최신값과 대조해 만료·삭제·가격변경을 잡는 훅.
 * 예약 페이지의 예약하기가 하던 검증과 동일한 로직(cart-validation.util)을 공유한다.
 */
const useCartFreshCheck = () => {
  const langQuery = useLanguageQuery()
  const { data: liveEvents, refetch: refetchEvents } = useEventControllerFindMany({
    limit: 1000,
    ...langQuery,
  })
  const { data: liveProducts, refetch: refetchProducts } = useProductControllerFindMany({
    limit: 1000,
  })
  const { cart, checkedList, reconcileCartEvents } = useCart()

  // 최신 이벤트/상품 목록 조회 (예약 페이지 fetchFresh와 동일)
  const fetchFresh = async () => {
    const [evRes, prRes] = await Promise.all([refetchEvents(), refetchProducts()])
    const freshEventById = new Map(
      (evRes.data?.items ?? liveEvents?.items ?? []).map((e) => [e.id, e] as [string, Event]),
    )
    const prItems = prRes.data?.items ?? liveProducts?.items ?? []
    // 상품 목록을 못 받았으면(빈 배열) 상품은 건드리지 않음 — 정상 상품 오삭제 방지
    const freshProductById =
      prItems.length > 0 ? new Map(prItems.map((p) => [p.id, p] as [string, Product])) : null
    return { freshEventById, freshProductById }
  }

  /**
   * 검증 후 이상이 있으면 최신값으로 장바구니를 즉시 정리/갱신하고 결과를 반환한다.
   * - removed: 만료·삭제 항목이 있어 장바구니에서 제거됨
   * - changed: 가격·정보가 바뀌어 최신값으로 갱신됨
   * - ok: 이상 없음 (그대로 예약 진행 가능)
   * 만료·삭제가 우선(둘 다면 removed) — reconcile 한 번으로 제거·갱신을 함께 처리한다.
   */
  const checkAndReconcile = async (): Promise<CartCheckResult> => {
    const { freshEventById, freshProductById } = await fetchFresh()
    const invalid = getInvalidCartItemIds(cart, checkedList, freshEventById, freshProductById)
    const changed = getChangedCartItemIds(cart, checkedList, freshEventById, freshProductById)
    if (invalid.length === 0 && changed.length === 0) return "ok"
    reconcileCartEvents(freshEventById, isEventExpired, freshProductById ?? undefined)
    return invalid.length > 0 ? "removed" : "changed"
  }

  return { checkAndReconcile }
}

export default useCartFreshCheck
