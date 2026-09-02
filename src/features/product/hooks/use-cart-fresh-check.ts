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
  limited: {
    titleKey: "reservePage.firstVisitLimitTitle",
    descKey: "reservePage.firstVisitLimitDesc",
  },
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
   * 예약하기 시 서버 최신값과 대조해 고지할 안내(removed/changed/limited)를 감지해 반환한다.
   * - 안내가 있으면: 장바구니는 아직 건드리지 않음 → 모달로 먼저 알리고, 확인 시 applyReconcile로 실제 정리.
   * - 안내가 없으면: 표시상 이상 없음 → 조용히 reconcile(재임포트로 바뀐 상품 id 재연결)하고 그대로 진행 가능.
   */
  const detectNotices = async (): Promise<CartNotice[]> => {
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
    // 첫방문 이벤트가 담겨 있으면(수량 무관) 항상 고지 — "초진 고객만, 항목별 1개" 안내. 2개+면 확인 시 1로 정리.
    const firstVisitPresent = cart.some(
      (i) => checkedList.includes(i.event?.id || "") && isFirstVisitEvent(i),
    )
    const notices: CartNotice[] = []
    if (invalid.length > 0) notices.push("removed")
    if (changed.length > 0) notices.push("changed")
    if (firstVisitPresent) notices.push("limited")
    // 알릴 게 없으면 여기서 조용히 재연결(안내 없이 진행)
    if (notices.length === 0) {
      reconcileCartEvents(freshEventById, isEventExpired, freshProductByName, lang)
    }
    return notices
  }

  /** 모달 '확인' 시 실제로 장바구니를 최신값으로 정리(제거·갱신·재연결·첫방문 1개 클램프). */
  const applyReconcile = async (): Promise<void> => {
    const { freshEventById, freshProductByName } = await fetchFresh()
    reconcileCartEvents(freshEventById, isEventExpired, freshProductByName, lang)
  }

  return { detectNotices, applyReconcile }
}

export default useCartFreshCheck
