import { useTranslation } from "react-i18next"
import { useEventControllerFindMany } from "@/lib/orval/events/events"
import { useProductControllerFindMany } from "@/lib/orval/products/products"
import useLanguageQuery from "@/lib/hooks/use-language-query"
import { Event } from "@/lib/orval/model"
import useCart from "@/features/product/hooks/use-cart"
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
   * 사이드 장바구니·탭바 "예약하기" 시 예약 불가·가격 변경만 감지해 반환한다(첫방문 안내는 최종 예약 페이지에서만).
   * 장바구니는 아직 건드리지 않고, 안내가 있으면 모달로 먼저 알린 뒤 확인 시 applyReconcile로 정리한다.
   * 예약 불가/변경이 없으면 그대로 예약 페이지로 이동 — 재임포트 id 재연결·첫방문 정리는 예약 페이지가 처리.
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
    const notices: CartNotice[] = []
    if (invalid.length > 0) notices.push("removed")
    if (changed.length > 0) notices.push("changed")
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
