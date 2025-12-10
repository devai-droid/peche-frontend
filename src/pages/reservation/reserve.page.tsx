// reserve.page.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"
import { CalendarSimpleIcon, CloseIcon, PlusPrimaryIcon } from "@/assets/icon"
import { Button, Calendar, Checkbox, Icon, LinkButton } from "@/design-system/components"
import Auth from "@/features/auth/components/auth.component"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"
import CustomLink from "@/lib/components/custom-link.component"

import tw from "twin.macro"
import useCustomNavigate from "@/lib/hooks/use-custom-navigate"
import useCart, { CartItem } from "@/features/product/hooks/use-cart"
import useLanguageValue from "@/lib/hooks/use-language-key"
import { AvailableReservationResultDto, Event } from "@/lib/orval/model"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import {
  reservationControllerGetAvailableReservationByDay,
  useReservationControllerCreate,
} from "@/lib/orval/reservations/reservations"
import { DEFAULT_CONSULTATION_PRODUCT_ID } from "@/lib/constants/reservation.constants"
import { env } from "@/lib/env"
import { useSearchParams } from "react-router-dom"
import { Language } from "@/lib/locales/i18n.config"
import { useTranslation } from "react-i18next"
import { userControllerUpdateMine } from "@/lib/orval/users/users"
import { useMe } from "@/features/user/hooks/use-user"
import Modal from "@/lib/components/modal/modal.component"

/* ---------------- Small UI ---------------- */
const H1 = tw.h1`text-xl font-bold`
const H2 = tw.h2`text-lg font-extrabold`
const Textarea = tw.textarea`h-10 py-1.5 px-2 border border-[#d0d0d0] rounded-lg flex-1 min-w-0 w-full`

const TimeButton = ({ selected, children, ...props }: { selected?: boolean } & any) => {
  return (
    <Button
      tw="shrink-0 sm:h-[58px] h-[40px] text-[15px] md:text-[17px]"
      {...props}
      style={{
        size: "sm",
        color: selected ? "point" : "gray",
        variant: selected ? "filled" : "outlined",
        bold: !!selected,
      }}>
      {children}
    </Button>
  )
}

interface SurgeryItemProps {
  item: CartItem
  updateCartItem: (item: CartItem) => void
  checked: boolean
  onCheck: (checked: boolean) => void
}

const SurgeryItem = ({ item, updateCartItem, checked, onCheck }: SurgeryItemProps) => {
  const tv = useLanguageValue()
  const { t, i18n } = useTranslation()
  const language = i18n.language as Language

  const name = tv(item.product ?? item.event!, "name")
  const description = tv(item.product ?? item.event!, "description")
  const discount = item.event?.discountPrice
  const price = item.event?.price || item.product?.price

  const formatDate = (value: string) => {
    const d = new Date(value)
    const m = `${d.getMonth() + 1}`.padStart(2, "0")
    const day = `${d.getDate()}`.padStart(2, "0")
    if (language === "ko") return `${m}월 ${day}일`
    return `${m}/${day}`
  }

  return (
    <div tw="py-2 font-pretendard tracking-tight leading-[150%] last-of-type:([&>hr]:hidden)">
      <div tw="flex gap-3 -ml-3">
        {/* 체크박스 */}
        <Checkbox checked={checked} onChange={(e) => onCheck(e.target.checked)} />

        <div tw="flex-1 flex flex-col gap-2">
          {/* 이름 */}
          <div tw="font-semibold text-[14px] md:text-[16px] leading-snug">{name}</div>

          {/* 기간 (이벤트에만 존재) */}
          {item.event?.category?.startDate && (
            <div tw="flex text-[#999] text-sm items-center gap-1 ml-1">
              <Icon icon={CalendarSimpleIcon} size={16} />
              <p>
                {formatDate(item.event.category.startDate)} ~{" "}
                {formatDate(item.event.category.endDate)}
              </p>
            </div>
          )}

          {/* 설명 */}
          {description && (
            <div tw="text-neutral70 text-[13px] leading-snug whitespace-pre-wrap">
              {description}
            </div>
          )}

          {/* 가격 + 수량 */}
          <div tw="flex justify-between items-start mt-1 flex-col gap-2 sm:flex-row sm:items-center">
            {/* 가격 */}
            <div tw="flex items-center gap-2">
              {discount && (
                <span tw="text-neutral50 line-through text-[13px]">
                  {price?.toLocaleString()}원
                </span>
              )}
              <span tw="text-[16px] font-bold text-neutralBlack">
                {(discount || price || 0).toLocaleString()}원
              </span>
            </div>

            {/* 수량 버튼 → 카트와 동일한 UI */}
            <div tw="flex items-center gap-2 shrink-0">
              <button
                tw="w-6 h-6 flex justify-center items-center text-neutral50 bg-neutral"
                disabled={item.count === 1}
                onClick={() => updateCartItem({ ...item, count: item.count - 1 })}>
                -
              </button>

              <span tw="w-4 text-center">{item.count}</span>

              <button
                tw="w-6 h-6 flex justify-center items-center text-neutral50 bg-neutral"
                onClick={() => updateCartItem({ ...item, count: item.count + 1 })}>
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr tw="my-5" />
    </div>
  )
}

interface SurgeryListProps {
  cart: CartItem[]
  updateCartItem: (item: CartItem) => void
  inquiry: boolean
  setInquiry: (value: boolean) => void
  removeFromCart: (ids: string[]) => void
}

const SurgeryList = ({
  cart,
  updateCartItem,
  inquiry,
  setInquiry,
  removeFromCart,
}: SurgeryListProps) => {
  const { checkedList, setCheckedList, resetCart } = useCart()
  const { t } = useTranslation()

  // cart와 동일한 모달 상태 추가
  const [inquiryChecked, setInquiryChecked] = React.useState(inquiry)
  const [showInquiryModal, setShowInquiryModal] = React.useState(false)

  React.useEffect(() => {
    setInquiryChecked(inquiry)
  }, [inquiry])

  // cart 페이지와 동일한 체크 로직
  const handleInquiryCheckbox = (checked: boolean) => {
    if (checked && cart.length > 0) {
      // 장바구니에 시술이 있는데 방문 상담을 켜려는 경우 → 모달 띄움
      setShowInquiryModal(true)
      return
    }

    setInquiryChecked(checked)
    setInquiry(checked)
  }

  return (
    <>
      <div tw="flex items-center justify-between mb-3 -ml-3 font-pretendard tracking-tight leading-[150%]">
        <Checkbox
          checked={checkedList.length === cart.length}
          onChange={(e) => {
            if (e.target.checked) {
              setCheckedList(cart.map((item) => item.event?.id || item.product?.id || ""))
            } else {
              setCheckedList([])
            }
          }}
          label={
            <div tw="flex items-center gap-2">
              <H2>{t("button.selectAll")}</H2>
              <span tw="text-primary font-semibold text-[18px] lg:text-[22px]">
                ({checkedList.length}/{cart.length})
              </span>
            </div>
          }
        />
        <Button
          style={{ size: "sm", variant: "outlined" }}
          onClick={() => {
            removeFromCart(checkedList)
            setCheckedList([])
          }}>
          {t("button.deleteSelection")}
        </Button>
      </div>

      <hr tw="mt-3 mb-5" />

      <div tw="pl-4 pr-4">
        <div>
          {cart.map((item) => (
            <SurgeryItem
              key={item.event?.id || item.product?.id}
              item={item}
              updateCartItem={updateCartItem}
              checked={checkedList.includes(item.event?.id || item.product?.id || "")}
              onCheck={(checked) => {
                const id = item.event?.id || item.product?.id || ""
                if (checked) {
                  setCheckedList([...checkedList, id])
                } else {
                  setCheckedList(checkedList.filter((x) => x !== id))
                }
              }}
            />
          ))}
        </div>
        <hr tw="border-t border-neutral20 my-4" />
        <div tw="flex gap-2 my-6 justify-center">
          <LinkButton
            to="/products"
            tw="flex justify-center items-center gap-2"
            style={{ flexible: true, variant: "outlined" }}>
            {t("reservePage.addTreatments")}
            <Icon icon={PlusPrimaryIcon} size={12} />
          </LinkButton>
        </div>

        <div tw="-ml-3 my-3 text-[14px] md:text-[16px] font-semibold">
          {/* cart와 동일한 체크박스 로직 */}
          <Checkbox
            checked={inquiryChecked}
            onChange={(e) => handleInquiryCheckbox(e.target.checked)}
            label={t("reservePage.bookConsultation")}
          />
        </div>
      </div>

      {/* 모달 (cart와 완전 동일) */}
      <Modal
        open={showInquiryModal}
        width="max-w-[400px]"
        onClose={() => setShowInquiryModal(false)}>
        <div tw="flex flex-col items-start justify-center h-full font-pretendard">
          <div tw="text-left text-[16px] font-semibold leading-snug">
            시술이 담겨있는 상태에서는 방문 상담 선택이 어렵습니다.
          </div>

          <div tw="text-neutral70 text-left mt-3">
            선택한 시술을 모두 비운 후 상담을 예약해주세요.
          </div>

          <div tw="flex justify-end gap-2 mt-8">
            <Button
              tw="w-[150px]"
              style={{ variant: "outlined", color: "point", size: "lg" }}
              onClick={() => {
                setInquiryChecked(false) // UI 상태 끄기
                setInquiry(false) // 전역 상태 끄기
                setShowInquiryModal(false) // 모달 닫기
              }}>
              취소하기
            </Button>

            <Button
              tw="w-[150px]"
              style={{ variant: "filled", color: "point", size: "lg" }}
              onClick={() => {
                resetCart() // 🔥 모든 시술 비우기
                setInquiry(true) // 방문 상담 활성화
                setInquiryChecked(true)
                setShowInquiryModal(false)
              }}>
              모두 비우기
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

/* ---------------- Reserve Main ---------------- */
const Reserve = () => {
  const { t, i18n } = useTranslation()
  const navigate = useCustomNavigate()
  const language = i18n.language as Language
  const { user: me } = useMe()

  const {
    inquiry,
    setInquiry,
    cart,
    updateCartItem,
    removeFromCart,
    checkedList,
    resetCart,
    getCheckedEventIds,
    getCheckedProductIds,
  } = useCart()

  const [today, setToday] = React.useState(dayjs())
  const [todaySlots, setTodaySlots] = React.useState<AvailableReservationResultDto[]>([])
  const [selectedDatetime, setSelectedDatetime] = React.useState("")

  /* -------- Auth 상태 -------- */
  interface AuthInfo {
    name: string
    phone?: string
    email?: string
  }

  const [authInfo, setAuthInfo] = React.useState<AuthInfo | null>(null)

  const [agree, setAgree] = React.useState({
    terms: false,
    privacy: false,
    marketing: false,
  })

  /* -------- 예약 가능 시간 조회 -------- */
  const getAvailableReservations = async (y: number, m: number, d: number) => {
    return reservationControllerGetAvailableReservationByDay({
      year: y,
      month: m,
      day: d,
      productIds: getProductIdsWithInquiry(),
      eventIds: getCheckedEventIds(),
    })
  }

  const getProductIdsWithInquiry = () => {
    const ids = [...(getCheckedProductIds() ?? [])]
    const inquiryId = DEFAULT_CONSULTATION_PRODUCT_ID[env.STAGE]
    if (inquiry && !ids.includes(inquiryId)) ids.push(inquiryId)
    return ids
  }

  /* -------- 캘린더 변경 시 조회 -------- */
  // React.useEffect(() => {
  //   if (getCheckedEventIds().length > 0 || getCheckedProductIds().length > 0 || inquiry) {
  //     getAvailableReservations(today.year(), today.month() + 1, today.date()).then((res) =>
  //       setTodaySlots(res),
  //     )
  //   }
  // }, [today, inquiry, checkedList])
  // 배포할때는 원상복구 해야함
  React.useEffect(() => {
    if (getCheckedEventIds().length > 0 || getCheckedProductIds().length > 0 || inquiry) {
      getAvailableReservations(today.year(), today.month() + 1, today.date()).then((res) => {
        // 🔥 UTC → KST (+9h) 변환 패치
        const patched = res.map((slot) => ({
          ...slot,
          datetime: dayjs(slot.datetime).add(9, "hour").toISOString(),
        }))

        console.log("patched res", patched)
        setTodaySlots(patched)
      })
    }
  }, [today, inquiry, checkedList])
  //

  dayjs.extend(utc)

  const renderTimeSlots = () => {
    const availableTimes = new Set(
      todaySlots.map((slot) => dayjs(slot.datetime.replace("Z", "")).format("HH:mm")),
    )

    return (
      <div tw="w-full p-4 font-pretendard">
        <div
          css={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
            gap: "5px",
            width: "100%",
          }}>
          {[
            "10:00",
            "10:30",
            "11:00",
            "11:30",
            "12:00",
            "12:30",
            "13:00",
            "13:30",
            "14:00",
            "14:30",
            "15:00",
            "15:30",
            "16:00",
            "16:30",
            "17:00",
            "17:30",
            "18:00",
            "18:30",
            "19:00",
            "19:30",
            "20:00",
            "20:30",
          ].map((slot) => {
            const available = availableTimes.has(slot)
            const selected = selectedDatetime.includes(slot)

            return (
              <TimeButton
                key={slot}
                disabled={!available}
                selected={selected}
                onClick={() => {
                  const base = todaySlots[0]?.datetime
                  if (!base) return
                  const [datePart] = base.split("T")
                  setSelectedDatetime(`${datePart}T${slot}:00.000Z`)
                }}>
                {slot}
              </TimeButton>
            )
          })}
        </div>
      </div>
    )
  }

  /* -------- 예약하기 -------- */
  const { mutate } = useReservationControllerCreate()

  const reserve = () => {
    if (!authInfo) {
      alert("본인인증이 필요합니다.")
      return
    }

    if (!agree.terms || !agree.privacy) {
      alert("필수 약관을 동의해주세요.")
      return
    }

    if (!selectedDatetime) {
      alert("예약 시간을 선택해주세요.")
      return
    }

    userControllerUpdateMine({ languageLocale: language })

    mutate(
      {
        data: {
          datetime: selectedDatetime.replace("Z", ""),
          productIds: getProductIdsWithInquiry(),
          eventIds: getCheckedEventIds(),
        },
      },
      {
        onSuccess: () => {
          resetCart()
          navigate("/reservation/complete")
        },
      },
    )
  }

  /* -------- 예약 버튼 disabled -------- */
  const reservationDisabled = !authInfo || !agree.terms || !agree.privacy || !selectedDatetime

  /* ---------------- Render ---------------- */
  return (
    <Page>
      <div tw="bg-neutral w-screen min-h-screen">
        <AppMaxWidth tw="py-8 lg:py-12 overflow-x-hidden">
          {/* ---------------- 회원가입 안내 배너 (임시) ---------------- */}
          {/* <div tw="bg-white rounded-lg p-5 mt-20 mb-6 text-center shadow-sm">
            <div tw="text-[15px] md:text-[17px] font-semibold mb-3">
              예약 전에 회원가입을 진행해주세요
            </div>

            <Button
              tw="w-[200px] h-[44px] font-bold mx-auto"
              style={{ variant: "filled", color: "point" }}
              onClick={() => navigate("/signup")}>
              회원가입
            </Button>
          </div> */}

          <H1 tw="pt-16 md:pt-10 pb-10 text-[24px] lg:text-[30px] text-center">
            {t("reservePage.shoppingCart")}
          </H1>

          <div tw="flex flex-col lg:flex-row gap-12 w-full">
            {/* ---------------- LEFT ---------------- */}
            <div tw="flex-1 min-w-0 flex flex-col gap-10">
              {/* --- 시술 리스트 섹션 --- */}
              <div tw="bg-white p-6">
                {/* <H2 tw="mb-6">
                  {t("reservePage.addedTreatments")} <span tw="text-point">{cart.length}</span>
                </H2> */}

                <SurgeryList
                  cart={cart}
                  updateCartItem={updateCartItem}
                  inquiry={inquiry}
                  setInquiry={setInquiry}
                  removeFromCart={removeFromCart}
                />
              </div>

              {/* --- 캘린더 섹션 --- */}
              <div tw="bg-white p-6">
                <Calendar
                  key={language}
                  value={today}
                  onChange={(value) => {
                    if (value) {
                      setToday(value)
                      setSelectedDatetime("")
                    }
                  }}
                  footer={<div>{renderTimeSlots()}</div>}
                />

                {/* 캘린더 바깥 여백에서 시간 선택 컴포넌트가 필요 없다면 제거 가능 */}
                {/* <div tw="mt-6">{renderTimeSlots()}</div> */}
              </div>
            </div>

            {/* ---------------- RIGHT: Auth + 예약 버튼 ---------------- */}
            <div tw="hidden lg:block w-[390px] shrink-0">
              <Auth onAuth={(info) => setAuthInfo(info)} onAgreementChange={(a) => setAgree(a)} />

              {/* 예약 버튼 */}
              <Button
                tw="w-full h-[52px] mt-6 font-bold"
                style={{ variant: "filled", color: "point" }}
                disabled={reservationDisabled}
                onClick={reserve}>
                {t("button.reserve")}
              </Button>
            </div>
          </div>

          {/* ---------------- MOBILE ---------------- */}
          <div tw="block lg:hidden mt-10">
            <Auth onAuth={(info) => setAuthInfo(info)} onAgreementChange={(a) => setAgree(a)} />

            <Button
              tw="w-full h-[52px] mt-6 font-bold"
              style={{ variant: "filled", color: "point" }}
              disabled={reservationDisabled}
              onClick={reserve}>
              {t("button.reserve")}
            </Button>
          </div>
        </AppMaxWidth>
      </div>
    </Page>
  )
}

export default Reserve
