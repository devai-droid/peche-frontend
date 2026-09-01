import { useTranslation } from "react-i18next"
import { useEventControllerFindMany } from "@/lib/orval/events/events"
import { useProductControllerFindMany } from "@/lib/orval/products/products"
import useLanguageQuery from "@/lib/hooks/use-language-query"
import { Event } from "@/lib/orval/model"
import useCart, { isFirstVisitEvent } from "@/features/product/hooks/use-cart"
import {
  buildProductByName,
  getChangedCartItemIds,
  getInvalidCartItemIds,
  isEventExpired,
} from "@/features/product/utils/cart-validation.util"

/** 장바구니 안내 종류: removed(예약 불가·삭제) / changed(가격·정보 변경) / limited(첫방문 이벤트 1개로 정리) */
export type CartNotice = "removed" | "changed" | "limited"

/** 안내별 제목·설명 i18n 키 (설명 없으면 제목만) — 모달에서 목록으로 렌더 */
export const CART_NOTICE_TEXT: Record<CartNotice, { titleKey: string; descKey?: string }> = {
  removed: { titleKey: "reservePage.eventExpiredTitle", descKey: "reservePage.eventExpiredDesc" },
  changed: {
    titleKey: "reservePage.productChangedTitle",
    descKey: "reservePage.productChangedDesc",
  },
  limited: { titleKey: "reservePage.firstVisitLimitNotice" },
}

/**
 * 사이드 장바구니·모바일 탭바의 "예약하기"에서 예약 페이지로 넘어가기 전,
 * 담긴 상품/이벤트를 서버 최신값과 대조해 예약 불가·삭제·가격변경을 잡는 훅.
 * 예약 페이지의 예약하기가 하던 검증과 동일한 로직(cart-validation.util)을 공유한다.
 * 상품은 임포트로 id가 바뀌므로 "현재 언어 이름" 기준으로 매칭한다.
 */
const useCartFreshCheck = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const langQuery = useLanguageQuery()
  const { data: liveEvents, refetch: refetchEvents } = useEventControllerFindMany({
    limit: 1000,
    ...langQuery,
  })
  const { data: liveProducts, refetch: refetchProducts } = useProductControllerFindMany({
    limit: 1000,
  })
  const { cart, checkedList, reconcileCartEvents } = useCart()

  // 최신 이벤트/상품 목록 조회 (예약 페이지 fetchFresh와 동일). 상품은 이름 Map으로.
  const fetchFresh = async () => {
    const [evRes, prRes] = await Promise.all([refetchEvents(), refetchProducts()])
    const freshEventById = new Map(
      (evRes.data?.items ?? liveEvents?.items ?? []).map((e) => [e.id, e] as [string, Event]),
    )
    const prItems = prRes.data?.items ?? liveProducts?.items ?? []
    // 상품 목록을 못 받았으면(빈 배열) 상품은 건드리지 않음 — 정상 상품 오삭제 방지
    const freshProductByName = prItems.length > 0 ? buildProductByName(prItems, lang) : null
    return { freshEventById, freshProductByName }
  }

  /**
   * 검증 후 최신값으로 장바구니를 항상 정리/갱신하고 결과를 반환한다.
   * (가격 그대로여도 임포트로 바뀐 상품 id를 이름매칭으로 재연결해야 예약이 유효 id로 나감)
   * - removed: 이름이 사라진(변경·삭제)·만료 항목이 있어 장바구니에서 제거됨
   * - changed: 이름은 그대로인데 가격·설명이 바뀌어 최신값으로 갱신됨
   * - ok: 표시상 이상 없음 (그대로 예약 진행 가능)
   * reconcile 한 번으로 제거·갱신·재연결·클램프를 함께 처리하고, 해당되는 안내를 모두 반환한다.
   * 반환 배열이 비면 이상 없음(그대로 예약 진행 가능), 아니면 그 안내들을 한 모달에 나열한다.
   */
  const checkAndReconcile = async (): Promise<CartNotice[]> => {
    const { freshEventById, freshProductByName } = await fetchFresh()
    const invalid = getInvalidCartItemIds(
      cart,
      checkedList,
      freshEventById,
      freshProductByName,
      lang,
    )
    const changed = getChangedCartItemIds(
      cart,
      checkedList,
      freshEventById,
      freshProductByName,
      lang,
    )
    // 기존에 2개+ 담긴 첫방문 이벤트(체크된 것) — reconcile에서 1로 정리되므로 고지 대상
    const overLimit = cart.some(
      (i) => checkedList.includes(i.event?.id || "") && isFirstVisitEvent(i) && i.count > 1,
    )
    reconcileCartEvents(freshEventById, isEventExpired, freshProductByName, lang)
    const notices: CartNotice[] = []
    if (invalid.length > 0) notices.push("removed")
    if (changed.length > 0) notices.push("changed")
    if (overLimit) notices.push("limited")
    return notices
  }

  return { checkAndReconcile }
}

export default useCartFreshCheck
