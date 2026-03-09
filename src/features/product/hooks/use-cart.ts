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

const useCart = () => {
  const [inquiry, setInquiry] = useLocalStorage<boolean>("inquiry", false)
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", [])
  const [justAddedId, setJustAddedId] = useLocalStorage<string>("justAddedId", "")
  const [checkedList, setCheckedList] = useLocalStorage<string[]>("checkedList", [])
  const [openBottomSheet, setOpenBottomSheet] = useLocalStorage<boolean>("openBottomSheet", false)
  const [inquiryMemo, setInquiryMemo] = useLocalStorage<string>("inquiryMemo", "")

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

  const addToCart = ({ event, product }: { event?: Event; product?: Product }) => {
    if (inquiry) {
      return {
        blockedByInquiry: true,
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

    return { blockedByInquiry: false }
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

  return {
    inquiry,
    setInquiry,
    cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    justAddedId,
    checkedList,
    setCheckedList,
    resetCart,
    getCheckedProductIds,
    getCheckedEventIds,
    openBottomSheet,
    setOpenBottomSheet,
    inquiryMemo,
    setInquiryMemo,
    hasHydrated: hasHydratedRef,
  }
}

export default useCart
