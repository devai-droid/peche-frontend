/* eslint-disable @typescript-eslint/no-unused-vars */
import { Event, Product } from "@/lib/orval/model"
import React, { useRef } from "react"
import { useLocalStorage } from "usehooks-ts"

export interface CartItem {
  event?: Event
  product?: Product
  isInquiry?: boolean
  count: number
}

/* ---------- Cookie helpers (Safari ITP / 모바일 대응) ---------- */
const BACKUP_COOKIE = "__cart_backup"
const BACKUP_MAX_AGE = 300 // 5분
const COOKIE_DOMAIN = window.location.hostname.replace(/^www\./, "")

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax;domain=.${COOKIE_DOMAIN}`
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;path=/;max-age=0;domain=.${COOKIE_DOMAIN}`
}

/** Cart item → 쿠키용 최소 데이터 (4KB 제한 대응) */
function slimCartItem(item: CartItem) {
  const e = item.event
  const p = item.product
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const slim: any = { c: item.count }
  if (e) {
    slim.e = {
      id: e.id,
      name: e.name,
      nameEN: e.nameEN,
      nameJA: e.nameJA,
      nameTH: e.nameTH,
      nameZH: e.nameZH,
      nameZHTW: e.nameZHTW,
      price: e.price,
      discountPrice: e.discountPrice,
      category: e.category
        ? {
            name: e.category.name,
            nameEN: e.category.nameEN,
            nameZH: e.category.nameZH,
            nameZHTW: e.category.nameZHTW,
            nameJA: e.category.nameJA,
            nameTH: e.category.nameTH,
            startDate: e.category.startDate,
            endDate: e.category.endDate,
          }
        : undefined,
      bundle: e.bundle
        ? {
            name: e.bundle.name,
            startDate: e.bundle.startDate,
            endDate: e.bundle.endDate,
          }
        : undefined,
    }
  }
  if (p) {
    slim.p = {
      id: p.id,
      name: p.name,
      nameEN: p.nameEN,
      nameJA: p.nameJA,
      nameTH: p.nameTH,
      nameZH: p.nameZH,
      nameZHTW: p.nameZHTW,
      price: p.price,
      discountPrice: p.discountPrice,
    }
  }
  return slim
}

/** 쿠키 최소 데이터 → CartItem 복원 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fattenCartItem(slim: any): CartItem {
  return {
    event: slim.e ? (slim.e as Event) : undefined,
    product: slim.p ? (slim.p as Product) : undefined,
    count: slim.c,
  }
}

const useCart = () => {
  const [inquiry, setInquiry] = useLocalStorage<boolean>("inquiry", false)
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", [])
  const [justAddedId, setJustAddedId] = useLocalStorage<string>("justAddedId", "")
  const [checkedList, setCheckedList] = useLocalStorage<string[]>("checkedList", [])
  const [openBottomSheet, setOpenBottomSheet] = useLocalStorage<boolean>("openBottomSheet", false)
  const [inquiryMemo, setInquiryMemo] = useLocalStorage<string>("inquiryMemo", "")
  const [consultCategories, setConsultCategories] = useLocalStorage<string[]>(
    "consultCategories",
    [],
  )
  const [usePackageChecked, setUsePackageChecked] = useLocalStorage<boolean>(
    "usePackageChecked",
    false,
  )
  const [packageCategories, setPackageCategories] = useLocalStorage<string[]>(
    "packageCategories",
    [],
  )
  const [packageMemo, setPackageMemo] = useLocalStorage<string>("packageMemo", "")

  // hydrate 완료 여부
  const hasHydratedRef = useRef(false)

  React.useEffect(() => {
    // 첫 렌더 이후 한 번만 true
    hasHydratedRef.current = true
  }, [])

  const resetCart = () => {
    setCart([])
    // setInquiry(true)
    setJustAddedId("")
    setCheckedList([])
    setInquiryMemo("")
    localStorage.removeItem("eventEndDates")
  }
  const getCheckedProductIds = () => {
    return cart
      .filter((i) => i.product)
      .map((i) => i.product?.id || "")
      .filter((i) => checkedList.includes(i))
  }
  const getCheckedEventIds = () => {
    return cart
      .filter((i) => i.event)
      .map((i) => i.event?.id || "")
      .filter((i) => checkedList.includes(i))
  }
  // 체크된 시술의 수량 맵 { [상품/이벤트 id]: 개수 } — 닥팔 예약메모 단가·소계 계산용
  const getCheckedQuantities = (): Record<string, number> => {
    const map: Record<string, number> = {}
    cart.forEach((i) => {
      const id = i.event?.id || i.product?.id || ""
      if (id && checkedList.includes(id)) map[id] = i.count
    })
    return map
  }

  const addToCart = ({ event, product }: { event?: Event; product?: Product }) => {
    if (inquiry) {
      return {
        blockedByInquiry: true,
        pendingItem: { event, product },
      }
    }
    if (usePackageChecked) {
      return {
        blockedByPackage: true,
        pendingItem: { event, product },
      }
    }

    // if (cart.length === 0) {
    //   setInquiry(true)
    // }
    const item = cart.findIndex(
      (i) => (i.event && i.event?.id === event?.id) || (i.product && i.product?.id === product?.id),
    )
    if (item >= 0) {
      const newCart = cart.map((i) => {
        if (
          (i.event && i.event?.id === event?.id) ||
          (i.product && i.product?.id === product?.id)
        ) {
          return { ...i, count: i.count + 1 }
        }
        return i
      })
      setCart(newCart)
    } else {
      setCart([...cart, { event, product, count: 1 }])
    }
    setJustAddedId(event?.id || product?.id || "")
    setOpenBottomSheet(true)

    return { blockedByInquiry: false, blockedByPackage: false }
  }
  const removeFromCart = (targetIds = [] as string[]) => {
    // justAddedId 에 해당하는 아이템이 삭제되는 경우, justAddedId를 초기화
    if (targetIds.includes(justAddedId)) {
      setJustAddedId("")
    }
    // cart 에서 targetIds에 해당하는 아이템을 제외한 새로운 cart를 만들어서 저장
    const newCart = cart.filter((i) => !targetIds.includes(i.event?.id || i.product?.id || ""))
    setCart(newCart)
  }
  const updateCartItem = (item: CartItem) => {
    const newCart = cart.map((i) => {
      if (
        (i.event && i.event?.id === item.event?.id) ||
        (i.product && i.product?.id === item.product?.id)
      ) {
        return item
      }
      return i
    })
    setCart(newCart)
  }
  // 최신 이벤트 목록 기준으로 카트 정리: 유효 항목은 최신 데이터로 갱신, 만료/삭제 항목은 제거 (단일 setCart)
  const reconcileCartEvents = (
    freshById: Map<string, Event>,
    isExpired: (event: Event) => boolean,
    validProductIds?: Set<string>,
  ) => {
    const newCart = cart
      .filter((i) => {
        if (i.event) {
          const fresh = freshById.get(i.event.id)
          return !!fresh && !isExpired(fresh) // 목록에 없거나 만료면 제거
        }
        if (i.product && validProductIds) {
          return validProductIds.has(i.product.id) // 삭제된 상품 제거 (목록 확보 시에만)
        }
        return true
      })
      .map((i) => {
        if (!i.event) return i
        const fresh = freshById.get(i.event.id)
        return fresh ? { ...i, event: fresh } : i // 최신값으로 갱신
      })
    setCart(newCart)
    const remaining = new Set(newCart.map((i) => i.event?.id || i.product?.id || ""))
    setCheckedList(checkedList.filter((id) => remaining.has(id)))
    if (justAddedId && !remaining.has(justAddedId)) setJustAddedId("")
  }

  const backupToCookie = () => {
    try {
      const backup = {
        items: cart.map(slimCartItem),
        cl: checkedList,
        inq: inquiry,
        im: inquiryMemo,
        dt: localStorage.getItem("reservation:selectedDatetime") || "",
        td: localStorage.getItem("reservation:today") || "",
      }
      setCookie(BACKUP_COOKIE, JSON.stringify(backup), BACKUP_MAX_AGE)
    } catch {
      // ignore cookie backup failure
    }
  }

  const restoreFromCookie = () => {
    try {
      const raw = getCookie(BACKUP_COOKIE)
      if (!raw) {
        return null
      }
      const backup = JSON.parse(raw)
      const restoredCart = (backup.items || []).map(fattenCartItem)
      // localStorage가 비었을 때만 복원
      if (cart.length === 0 && restoredCart.length > 0) {
        setCart(restoredCart)
        setCheckedList(backup.cl || [])
        setInquiry(backup.inq ?? false)
        setInquiryMemo(backup.im || "")
      }
      if (backup.dt) {
        localStorage.setItem("reservation:selectedDatetime", backup.dt)
      }
      if (backup.td) {
        localStorage.setItem("reservation:today", backup.td)
      }
      deleteCookie(BACKUP_COOKIE)
      return { selectedDatetime: backup.dt, today: backup.td }
    } catch {
      return null
    }
  }

  return {
    inquiry,
    setInquiry,
    cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    reconcileCartEvents,
    justAddedId,
    checkedList,
    setCheckedList,
    resetCart,
    getCheckedProductIds,
    getCheckedEventIds,
    getCheckedQuantities,
    openBottomSheet,
    setOpenBottomSheet,
    inquiryMemo,
    setInquiryMemo,
    consultCategories,
    setConsultCategories,
    usePackageChecked,
    setUsePackageChecked,
    packageCategories,
    setPackageCategories,
    packageMemo,
    setPackageMemo,
    hasHydrated: hasHydratedRef,
    backupToCookie,
    restoreFromCookie,
  }
}

export default useCart
