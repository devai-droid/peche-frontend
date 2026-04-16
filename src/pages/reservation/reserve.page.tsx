/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-alert */
// reserve.page.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"
import { CalendarSimpleIcon, PlusPrimaryIcon } from "@/assets/icon"
import { Button, Calendar, Checkbox, Icon, LinkButton } from "@/design-system/components"
import Auth from "@/features/auth/components/auth.component"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"

import tw from "twin.macro"
import useCustomNavigate from "@/lib/hooks/use-custom-navigate"
import useCart, { CartItem } from "@/features/product/hooks/use-cart"
import useLanguageValue from "@/lib/hooks/use-language-key"
import { AvailableReservationResultDto } from "@/lib/orval/model"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import {
  reservationControllerGetAvailableReservationByDayPublic,
  useReservationControllerCreate,
} from "@/lib/orval/reservations/reservations"
import { DEFAULT_CONSULTATION_PRODUCT_ID } from "@/lib/constants/reservation.constants"
import { env } from "@/lib/env"
import { Language } from "@/lib/locales/i18n.config"
import { useTranslation } from "react-i18next"
import { userControllerUpdateMine } from "@/lib/orval/users/users"
import { useMe } from "@/features/user/hooks/use-user"
import Modal from "@/lib/components/modal/modal.component"

/* ---------------- Small UI ---------------- */
const H1 = tw.h1`text-xl font-bold`
const H2 = tw.h2`text-lg font-extrabold`

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
  const { i18n } = useTranslation()
  const language = i18n.language as Language

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const name = tv(item.product ?? item.event!, "name")
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

              <span tw="w-4 text-center text-[13px] md:text-[15px]">{item.count}</span>

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
  inquiryMemo: string
  setInquiryMemo: (value: string) => void
  removeFromCart: (ids: string[]) => void
}

const SurgeryList = ({
  cart,
  updateCartItem,
  inquiry,
  setInquiry,
  inquiryMemo,
  setInquiryMemo,
  removeFromCart,
}: SurgeryListProps) => {
  const { checkedList, setCheckedList, resetCart, hasHydrated } = useCart()
  const { t } = useTranslation()

  // cart와 동일한 모달 상태 추가
  const [inquiryChecked, setInquiryChecked] = React.useState(inquiry)
  const [showInquiryModal, setShowInquiryModal] = React.useState(false)

  // React.useEffect(() => {
  //   if (cart.length > 0 && inquiryChecked) {
  //     setInquiryChecked(false)
  //   }
  // }, [cart])
  React.useEffect(() => {
    // hydrate 중에는 실행하지 않음
    if (!hasHydrated.current) return

    if (cart.length > 0 && inquiryChecked) {
      setInquiryChecked(false)
    }
  }, [cart, inquiryChecked])

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

      {inquiryChecked && cart.length === 0 && (
        <div tw="mt-4 px-1 flex-none">
          {/* 체크박스 + 이름 */}
          <div tw="flex items-center text-[14px] font-semibold mb-2">
            <Checkbox
              checked={inquiryChecked}
              onChange={(e) => handleInquiryCheckbox(e.target.checked)}
              label={t("cart.visitThenSelect")}
            />
          </div>

          {/* 가격 (0원) */}
          <div tw="flex items-center gap-2 mb-4 ml-10">
            <span tw="text-neutral50 line-through text-[13px]">{t("cart.freePrice")}</span>
            <span tw="text-[16px] font-bold text-neutralBlack">{t("cart.freePrice")}</span>
          </div>

          {/* 상담 요청사항 */}
          <div tw="text-primary text-[10px] md:text-[12px] font-semibold mb-2 pl-10">
            {t("cart.request")}
          </div>

          <div tw="flex items-end gap-2 mx-10 w-[85%] md:w-[92%]">
            <textarea
              tw="flex-1 p-3 border border-neutral20 rounded-[1px] text-[14px] h-32"
              placeholder={t("cart.writeRequest")}
              value={inquiryMemo}
              maxLength={200}
              onChange={(e) => setInquiryMemo(e.target.value)}
            />

            <div tw="text-neutral50 text-[12px] mb-1">{inquiryMemo.length}/200</div>
          </div>
        </div>
      )}

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
        {!inquiryChecked && <hr tw="border-t border-neutral20 my-4" />}
        <div tw="flex gap-2 my-6 justify-center">
          <LinkButton
            to="/events"
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
          <div tw="text-left text-[16px] lg:text-[18px] font-semibold leading-snug">
            {t("cart.emptyCartTitle")}
          </div>

          <div tw="text-neutral70 text-left text-[14px] lg:text-[16px] mt-3">
            {t("cart.emptyCartText")}
          </div>

          <div tw="flex justify-end gap-2 mt-8">
            <Button
              tw="w-[150px] text-[13px] md:text-[15px]"
              style={{ variant: "outlined", color: "point", size: "sm" }}
              onClick={() => {
                setInquiryChecked(false) // UI 상태 끄기
                setInquiry(false) // 전역 상태 끄기
                setShowInquiryModal(false) // 모달 닫기
              }}>
              {t("cart.cancel")}
            </Button>

            <Button
              tw="w-[150px] text-[13px] md:text-[15px] px-[10px]"
              style={{ variant: "filled", color: "point", size: "sm" }}
              onClick={() => {
                resetCart() // 🔥 모든 시술 비우기
                setInquiry(true) // 방문 상담 활성화
                setInquiryChecked(true)
                setShowInquiryModal(false)
              }}>
              {t("cart.emptyCart")}
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
    inquiryMemo,
    setInquiryMemo,
    cart,
    updateCartItem,
    removeFromCart,
    checkedList,
    resetCart,
    getCheckedEventIds,
    getCheckedProductIds,
    hasHydrated,
    backupToCookie,
    restoreFromCookie,
  } = useCart()

  const [today, setToday] = React.useState(dayjs())
  const [todaySlots, setTodaySlots] = React.useState<AvailableReservationResultDto[]>([])
  const [selectedDatetime, setSelectedDatetime] = React.useState("")
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [eventPeriodAlert, setEventPeriodAlert] = React.useState(false)

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

  /* -------- NEW 예약 가능 시간 조회 -------- */
  const getAvailableReservationsPublic = async (y: number, m: number, d: number) => {
    return reservationControllerGetAvailableReservationByDayPublic({
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

  // 예약 버튼 클릭 시 모달만 여는 함수
  const openConfirmModal = () => {
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

    setConfirmOpen(true)
  }

  const reserveConfirm = async () => {
    if (!authInfo) return

    const selected = dayjs(selectedDatetime.replace("Z", ""))

    const currentTime = dayjs()
    const cutoff = getTodayCutoffTime()

    const isToday = selected.isSame(currentTime, "day")

    if (isToday && selected.isBefore(cutoff)) {
      alert(t("reservePage.timeExpired"))
      setSelectedDatetime("")
      localStorage.removeItem("reservation:selectedDatetime")
      return
    }

    try {
      await userControllerUpdateMine({ languageLocale: language })

      mutate(
        {
          data: {
            datetime: selectedDatetime.replace("Z", ""),
            productIds: getProductIdsWithInquiry(),
            eventIds: getCheckedEventIds(),
            userMemo: inquiryMemo || undefined,
          },
        },
        {
          onSuccess: () => {
            localStorage.removeItem("reservation:selectedDatetime")
            resetCart()
            navigate("/reservation/complete")
          },
        },
      )
    } catch (e) {
      console.error(e)
    }
  }

  React.useEffect(() => {
    const token = localStorage.getItem("authToken")

    if (token && me) {
      const info = {
        name: me.name,
        phone: me.phoneNumber,
        email: me.email,
      }
      setAuthInfo(info)
    }
  }, [me])

  // 페이지 진입 시 cookie 백업 복원 → localStorage 확인
  React.useEffect(() => {
    const restored = restoreFromCookie()
    const savedDatetime =
      restored?.selectedDatetime || localStorage.getItem("reservation:selectedDatetime")
    const savedToday = restored?.today || localStorage.getItem("reservation:today")

    if (savedDatetime) setSelectedDatetime(savedDatetime)
    if (savedToday) setToday(dayjs(savedToday))
  }, [])

  /* -------- 캘린더 변경 시 조회 -------- */
  React.useEffect(() => {
    if (getCheckedEventIds().length > 0 || getCheckedProductIds().length > 0 || inquiry) {
      getAvailableReservationsPublic(today.year(), today.month() + 1, today.date()).then((res) => {
        // UTC → KST (+9h) 변환 패치
        const patched = res.map((slot) => ({
          ...slot,
          datetime: dayjs(slot.datetime).add(9, "hour").toISOString(),
          building: "BUILDING_1",
        }))

        setTodaySlots(patched)
      })
    }
  }, [today, inquiry, checkedList])

  dayjs.extend(utc)

  const getTodayCutoffTime = () => {
    let cutoff = dayjs().startOf("minute").add(30, "minute")

    const remainder = cutoff.minute() % 30
    if (remainder !== 0) {
      cutoff = cutoff.add(30 - remainder, "minute")
    }

    return cutoff.second(0)
  }

  const renderTimeSlots = () => {
    const isToday = today.isSame(dayjs(), "day")
    const cutoffTime = isToday ? getTodayCutoffTime() : null

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
            "@media (min-width: 2200px)": {
              gap: "10px",
            },
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
            const availableFromBackend = availableTimes.has(slot)

            const slotDatetime = dayjs(`${today.format("YYYY-MM-DD")}T${slot}:00`)

            const blockedByTime = isToday && cutoffTime && slotDatetime.isBefore(cutoffTime)

            const disabled = !availableFromBackend || blockedByTime
            const selected = selectedDatetime.includes(slot)

            return (
              <TimeButton
                key={slot}
                disabled={disabled}
                selected={selected}
                onClick={() => {
                  if (disabled) return

                  const base = todaySlots[0]?.datetime
                  if (!base) return

                  const [datePart] = base.split("T")
                  const value = `${datePart}T${slot}:00.000Z`
                  setSelectedDatetime(`${datePart}T${slot}:00.000Z`)
                  // 카톡 본인인증 후 선택 리셋되는 것 방지하기 위해 localStorage 사용
                  localStorage.setItem("reservation:today", today.toISOString())
                  localStorage.setItem("reservation:selectedDatetime", value)
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

  // 장바구니에 시술이 있으면 상담하기는 항상 false
  // React.useEffect(() => {
  //   if (cart.length > 0 && inquiry) {
  //     setInquiry(false)
  //   }
  // }, [cart])
  React.useEffect(() => {
    if (!hasHydrated.current) return

    if (cart.length > 0 && inquiry) {
      setInquiry(false)
    }
  }, [cart, inquiry])

  /* -------- 예약 버튼 disabled -------- */
  const reservationDisabled = !authInfo || !agree.terms || !agree.privacy || !selectedDatetime

  /* ---------------- Render ---------------- */
  return (
    <Page>
      <div tw="bg-neutral w-screen min-h-screen">
        <AppMaxWidth tw="py-8 lg:py-12 overflow-x-hidden font-pretendard">
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
                <SurgeryList
                  cart={cart}
                  updateCartItem={updateCartItem}
                  inquiry={inquiry}
                  setInquiry={setInquiry}
                  inquiryMemo={inquiryMemo}
                  setInquiryMemo={setInquiryMemo}
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
                      localStorage.removeItem("reservation:selectedDatetime")
                      localStorage.setItem("reservation:today", value.toISOString())
                    }
                  }}
                  onMonthChange={(month: typeof dayjs.prototype) => {
                    const monthStart = dayjs(month).startOf("month")
                    const hasExpiredEvent = cart.some((item) => {
                      const endDate = (item.event as any)?.bundle?.endDate || item.event?.category?.endDate
                      if (!endDate) return false
                      return dayjs(endDate).isBefore(monthStart)
                    })
                    if (hasExpiredEvent) {
                      setEventPeriodAlert(true)
                    }
                  }}
                  footer={<div>{renderTimeSlots()}</div>}
                />
              </div>
            </div>

            {/* ---------------- RIGHT: Auth + 예약 버튼 ---------------- */}
            <div tw="hidden lg:block w-[390px] shrink-0">
              <Auth
                onAuth={(info) => setAuthInfo(info)}
                onAgreementChange={(a) => setAgree(a)}
                onBeforeKakaoAuth={backupToCookie}
              />

              {/* 예약 버튼 */}
              <Button
                tw="w-full h-[52px] mt-6 font-bold"
                style={{ variant: "filled", color: "point" }}
                disabled={reservationDisabled}
                onClick={openConfirmModal}>
                {t("button.reserve")}
              </Button>
              <div tw="mt-4 text-[13px] md:text-[14px] font-pretendard text-neutral70 whitespace-pre-wrap tracking-tight">
                {t("productDetail.reserveDescription")}
              </div>
            </div>
          </div>

          {/* ---------------- MOBILE ---------------- */}
          <div tw="block lg:hidden mt-10">
            <Auth
              onAuth={(info) => setAuthInfo(info)}
              onAgreementChange={(a) => setAgree(a)}
              onBeforeKakaoAuth={backupToCookie}
            />

            <Button
              tw="w-full h-[52px] mt-6 font-bold"
              style={{ variant: "filled", color: "point" }}
              disabled={reservationDisabled}
              onClick={openConfirmModal}>
              {t("button.reserve")}
            </Button>
          </div>
        </AppMaxWidth>
      </div>
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} width="max-w-[480px]">
        <div tw="font-pretendard">
          <div tw="text-[16px] md:text-[18px] font-semibold mb-4">
            {t("reservePage.reservationModalTitle")}
          </div>

          <div tw="text-neutral70 leading-[150%] text-[14px] md:text-[16px] mb-8">
            {t("reservePage.reservationModalText1")}
            <br />
            {t("reservePage.reservationModalText2")}
          </div>

          <div tw="flex gap-2 justify-center">
            <Button
              tw="flex-1 h-[40px] text-[13px] md:text-[15px]"
              style={{ variant: "outlined", color: "point", size: "sm" }}
              onClick={() => setConfirmOpen(false)}>
              {t("reservePage.reservationModalCancelButton")}
            </Button>

            <Button
              tw="flex-1 h-[40px] text-[13px] md:text-[15px]"
              style={{ variant: "filled", color: "point", size: "sm" }}
              onClick={reserveConfirm}>
              {t("reservePage.reservationModalReserveButton")}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={eventPeriodAlert} onClose={() => setEventPeriodAlert(false)} width="max-w-[400px]">
        <div tw="font-pretendard">
          <div tw="text-[16px] md:text-[18px] font-semibold mb-4 leading-snug">
            이달의 이벤트 상품의 예약 가능 날짜는
            <br />
            당월 말일까지입니다.
          </div>
          <div tw="text-neutral70 text-[14px] md:text-[16px] mb-6">
            예약 날짜를 다시 확인해주세요.
          </div>
          <Button
            tw="w-full h-[40px] text-[13px] md:text-[15px]"
            style={{ variant: "filled", color: "point", size: "sm" }}
            onClick={() => setEventPeriodAlert(false)}>
            확인
          </Button>
        </div>
      </Modal>
    </Page>
  )
}

export default Reserve
