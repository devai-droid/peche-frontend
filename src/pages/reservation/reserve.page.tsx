/* eslint-disable @typescript-eslint/no-unused-vars */
import { CalendarSimpleIcon, CloseIcon, DownloadIcon } from "@/assets/icon"
import { Button, Calendar, Checkbox, Icon, LinkButton } from "@/design-system/components"
import Auth from "@/features/auth/components/auth.component"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"
import Modal from "@/lib/components/modal/modal.component"
import { HTMLButtonProps } from "@/lib/types/html-element-type"
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
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
import { userControllerUpdateMine } from "@/lib/orval/users/users"
import { useMe } from "@/features/user/hooks/use-user"

/* ---------------------------- Small UI Components ---------------------------- */
const H1 = tw.h1`text-xl font-bold`
const H2 = tw.h2`text-lg font-extrabold`
const Textarea = tw.textarea`h-10 py-1.5 px-2 border border-[#d0d0d0] rounded-lg flex-1 min-w-0 w-full`

const TimeButton = ({ selected, children, ...props }: { selected?: boolean } & HTMLButtonProps) => {
  return (
    <Button
      tw="shrink-0"
      {...props}
      style={{
        size: "sm",
        color: selected ? "point" : "black",
        variant: selected ? "filled" : "outlined",
      }}>
      {children}
    </Button>
  )
}

/* ---------------------------- Surgery Item Component ---------------------------- */
const SurgeryItem = ({
  item,
  updateCartItem,
  checked,
  onCheck,
}: {
  item: CartItem
  updateCartItem: (item: CartItem) => void
  checked: boolean
  onCheck: (checked: boolean) => void
}) => {
  const tv = useLanguageValue()
  const { t, i18n } = useTranslation()
  const language = i18n.language as Language

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    if (language === "ko") return `${month}월 ${day}일`
    if (language === "en") return `${monthNames[date.getMonth()]} ${day}`
    return `${year}/${month}/${day}`
  }

  return (
    <div tw="last-of-type:([&>hr]:hidden)">
      <div tw="flex justify-between -ml-3">
        <div tw="flex-1">
          <Checkbox
            checked={checked}
            onChange={(e) => onCheck(e.target.checked)}
            label={tv(item.product ?? (item.event as Event), "name")}
          />

          {/* Event 기간 표시 */}
          {item.event?.category?.startDate && (
            <div tw="flex ml-12 text-[#999] text-sm">
              <Icon icon={CalendarSimpleIcon} size={16} tw="mt-1 mr-1" />
              <p>
                {formatDate(item.event.category.startDate)} ~{" "}
                {formatDate(item.event.category.endDate)}
              </p>
            </div>
          )}
        </div>

        <div tw="shrink-0 flex gap-2 items-center h-fit mt-3.5">
          <button
            tw="w-6 h-6 flex justify-center items-center rounded-full text-point border border-point"
            disabled={item.count === 1}
            onClick={() => updateCartItem({ ...item, count: item.count - 1 })}>
            -
          </button>
          <span>{item.count}</span>
          <button
            tw="w-6 h-6 flex justify-center items-center rounded-full text-white bg-point border border-point"
            onClick={() => updateCartItem({ ...item, count: item.count + 1 })}>
            +
          </button>
        </div>
      </div>

      <div tw="flex justify-end items-center gap-2">
        {item.event?.discountPrice && (
          <p tw="text-[#717171] text-sm line-through">
            {item.event.price} {t("reservePage.won")}
          </p>
        )}
        <p tw="font-bold text-[#8d7b64]">
          {(
            item.event?.discountPrice ||
            item.event?.price ||
            item.product?.price ||
            0
          ).toLocaleString()}
          {t("reservePage.won")}
        </p>
      </div>

      <hr tw="my-5" />
    </div>
  )
}

/* ---------------------------- Surgery List Component ---------------------------- */
const SurgeryList = ({
  cart,
  updateCartItem,
  inquiry,
  setInquiry,
  removeFromCart,
}: {
  cart: CartItem[]
  updateCartItem: (item: CartItem) => void
  inquiry: boolean
  setInquiry: (inquiry: boolean) => void
  removeFromCart: (ids: string[]) => void
}) => {
  const { checkedList, setCheckedList } = useCart()
  const { t } = useTranslation()

  return (
    <>
      <div tw="flex items-center justify-between mb-3 -ml-3">
        <Checkbox
          checked={checkedList.length === cart.length}
          onChange={(e) => {
            if (e.target.checked) {
              setCheckedList(cart.map((item) => item.event?.id || item.product?.id || ""))
            } else {
              setCheckedList([])
            }
          }}
          label={<H2>{t("button.selectAll")} </H2>}
        />
        <Button
          style={{ size: "lg" }}
          onClick={() => {
            removeFromCart(checkedList)
            setCheckedList([])
          }}>
          {t("button.deleteSelection")}
        </Button>
      </div>

      <div tw="rounded-lg border border-[#d0d0d0] pl-5 pr-4">
        <div tw="-ml-3 my-3">
          <Checkbox
            checked={inquiry}
            onChange={(e) => setInquiry(e.target.checked)}
            label={t("reservePage.bookConsultation")}
          />
          <hr tw="mt-3 mb-5" />
        </div>

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

        <div tw="flex gap-2 my-6 justify-center">
          <LinkButton
            to="/products"
            tw="flex justify-center items-center gap-2 max-w-[15rem]"
            style={{ flexible: true }}>
            <div tw="transform rotate-45">
              <Icon icon={CloseIcon} size={12} />
            </div>
            {t("reservePage.addTreatments")}
          </LinkButton>

          <LinkButton
            to="/events"
            tw="flex justify-center items-center gap-2 max-w-[15rem]"
            style={{ flexible: true }}>
            <div tw="transform rotate-45">
              <Icon icon={CloseIcon} size={12} />
            </div>
            {t("reservePage.addEventTreatments")}
          </LinkButton>
        </div>
      </div>
    </>
  )
}

/* ---------------------------- Main Reserve Component ---------------------------- */
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
  const [selectedDatetime, setSelectedDatetime] = React.useState<string>("")
  const [userMemo, setUserMemo] = React.useState("")

  const [privacyAgreement, setPrivacyAgreement] = React.useState(false)
  const [marketingAgreement, setMarketingAgreement] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const { mutate, isLoading: createLoading } = useReservationControllerCreate()

  const allSlots = [
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
  ]

  /* ---------------------------- Reservation API ---------------------------- */
  const getAvailableReservations = async (y: number, m: number, d: number) => {
    setIsLoading(true)
    try {
      return await reservationControllerGetAvailableReservationByDay({
        year: y,
        month: m,
        day: d,
        productIds: getProductIdWithInquiry(),
        eventIds: getCheckedEventIds(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getProductIdWithInquiry = () => {
    const productIds = getCheckedProductIds() ?? []
    const inquiryProductId = DEFAULT_CONSULTATION_PRODUCT_ID[env.STAGE]
    if (inquiry && !productIds.includes(inquiryProductId)) {
      productIds.push(inquiryProductId)
    }
    return productIds
  }

  /* ---------------------------- Fetch Available Time Slots ---------------------------- */
  useEffect(() => {
    if (getCheckedEventIds().length > 0 || getCheckedProductIds().length > 0 || inquiry) {
      getAvailableReservations(today.year(), today.month() + 1, today.date()).then(setTodaySlots)
    }
  }, [today, inquiry, checkedList])

  /* ---------------------------- Time Slot Rendering ---------------------------- */
  const renderTimeSlots = () => {
    if (isLoading) {
      return <div tw="text-center w-full">{t("reservePage.loadingAvailableTime")}</div>
    }

    dayjs.extend(utc)

    const availableTimes = new Set(
      todaySlots.map((slot) => dayjs(slot.datetime.replaceAll("Z", "")).format("HH:mm")),
    )

    return (
      <div tw="flex gap-4 overflow-auto p-4">
        {allSlots.map((slot) => {
          const available = availableTimes.has(slot)
          return (
            <TimeButton
              key={slot}
              disabled={!available}
              selected={selectedDatetime?.includes(slot)}
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
    )
  }

  /* ---------------------------- Reservation Submission ---------------------------- */
  const reserve = () => {
    if (!me) {
      alert("본인인증이 필요합니다.")
      return
    }

    userControllerUpdateMine({ languageLocale: language })

    const eventNames = cart
      .map((item) => {
        const eventName = getCheckedEventIds().includes(item.event?.id ?? "")
          ? item.event?.name || ""
          : ""
        const productName = getCheckedProductIds().includes(item.product?.id ?? "")
          ? item.product?.name || ""
          : ""
        return `${eventName}${productName}`
      })
      .filter((x) => x)
      .join("\n")

    const finalMemo = inquiry ? `${eventNames}\n상담하기` : eventNames

    mutate(
      {
        data: {
          userMemo,
          adminMemo: finalMemo,
          datetime: selectedDatetime.replaceAll("Z", ""),
          productIds: getProductIdWithInquiry(),
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

  /* ---------------------------- PDF Links ---------------------------- */
  const pdfUrls = {
    ko: "https://peche-files.s3.us-east-1.amazonaws.com/peche_ko.pdf",
    en: "https://peche-files.s3.us-east-1.amazonaws.com/peche_en.pdf",
    ja: "https://peche-files.s3.us-east-1.amazonaws.com/peche_ja.pdf",
    zh: "https://peche-files.s3.us-east-1.amazonaws.com/peche_zh.pdf",
    th: "https://peche-files.s3.us-east-1.amazonaws.com/peche_th.pdf",
  }

  const estimatedPrice = cart
    .filter((item) => checkedList.includes(item.event?.id || item.product?.id || ""))
    .reduce((acc, cur) => {
      return (
        acc + (cur.event?.discountPrice || cur.event?.price || cur.product?.price || 0) * cur.count
      )
    }, 0)

  /* ---------------------------- Render ---------------------------- */
  return (
    <Page>
      <AppMaxWidth tw="py-8 lg:py-12 overflow-x-hidden">
        <H1>{t("reservePage.reserve")}</H1>
        <hr tw="mt-4 mb-10" />

        {/* ---- DESKTOP: 2-Column Layout ---- */}
        <div tw="flex flex-col lg:flex-row lg:items-start gap-12 w-full">
          {/* ===================== LEFT COLUMN ======================= */}
          <div tw="flex-1 min-w-0">
            {/* --- 시술 목록 --- */}
            <H2 tw="mb-6">
              {t("reservePage.addedTreatments")} <span tw="text-point">{cart.length}</span>
            </H2>

            <SurgeryList
              cart={cart}
              updateCartItem={updateCartItem}
              inquiry={inquiry}
              setInquiry={setInquiry}
              removeFromCart={removeFromCart}
            />

            {/* --- 날짜 선택 캘린더 --- */}
            <div tw="mt-12 min-w-0">
              <H2 tw="mb-6">{t("reservePage.selectDateAndTime")}</H2>

              <Calendar
                key={language}
                disabled={isLoading}
                value={today}
                onChange={(value) => {
                  if (value) {
                    setToday(value)
                    setSelectedDatetime("")
                  }
                }}
                footer={<div tw="flex gap-4 p-4">{renderTimeSlots()}</div>}
              />
            </div>

            {/* --- 시간 선택 --- */}
            <div tw="min-w-0">{renderTimeSlots()}</div>

            {/* --- 메모 --- */}
            <div tw="mt-12">
              <div tw="flex items-center gap-9 lg:(max-w-xl items-start) mx-auto">
                <p tw="text-sm">{t("reservePage.memo")}</p>
                <Textarea
                  tw="lg:h-24"
                  value={userMemo}
                  onChange={(e) => setUserMemo(e.target.value)}
                />
              </div>

              <div tw="text-[#717171] text-center my-10">
                {t("reservePage.guardianConsentText")}
              </div>

              <Button
                tw="flex justify-center items-center gap-2 min-w-[15rem] mx-auto"
                style={{ color: "black", variant: "filled", size: "lg" }}
                onClick={() => window.open(pdfUrls[language] || pdfUrls.en)}>
                <Icon icon={DownloadIcon} size={30} />
                {t("reservePage.guardianConsent")}
              </Button>
            </div>

            {/* --- 약관 --- */}
            <hr tw="mt-16" />
            <div tw="py-4 text-[#333]">
              <Checkbox
                checked={privacyAgreement && marketingAgreement}
                onChange={(e) => {
                  setPrivacyAgreement(e.target.checked)
                  setMarketingAgreement(e.target.checked)
                }}
                label={<div tw="font-bold">{t("reservePage.agreeToAll")}</div>}
              />

              <div tw="flex items-center">
                <Checkbox
                  checked={privacyAgreement}
                  onChange={(e) => setPrivacyAgreement(e.target.checked)}
                  label={t("reservePage.privacyAgreement")}
                />
                <CustomLink
                  target="_blank"
                  to="/"
                  tw="text-point underline pl-2"
                  onClick={(e) => e.stopPropagation()}>
                  {t("reservePage.detail")}
                </CustomLink>
              </div>

              <Checkbox
                checked={marketingAgreement}
                onChange={(e) => setMarketingAgreement(e.target.checked)}
                label={t("reservePage.marketingAgreement")}
              />
            </div>
            <hr />

            {/* --- 최종 가격 + 예약하기 버튼 --- */}
            <div tw="mx-auto lg:max-w-lg mt-10">
              <div tw="flex justify-between">
                <div tw="font-extrabold text-sm mt-1 lg:text-xl">
                  {t("reservePage.estimatedPrice")}
                </div>

                <div tw="text-right">
                  <div tw="text-point font-extrabold text-lg lg:text-[1.5rem] mb-2">
                    {estimatedPrice.toLocaleString()}
                    {t("reservePage.won")}
                  </div>
                  {t("reservePage.vatNotIncluded")}
                </div>
              </div>

              <Button
                disabled
                tw="mt-8 mb-5"
                style={{ flexible: true, variant: "filled", size: "lg" }}
                // disabled={!selectedDatetime || !privacyAgreement || createLoading}
                onClick={reserve}>
                {t("button.reserve")}
              </Button>

              {!selectedDatetime && (
                <div tw="text-xs text-[#F40000]">{t("productDetail.reserveButtonActiveText1")}</div>
              )}
              {!privacyAgreement && (
                <div tw="text-xs text-[#F40000]">{t("productDetail.reserveButtonActiveText2")}</div>
              )}
            </div>

            {/* ---- MOBILE Auth ---- */}
            <div tw="block lg:hidden mt-14">
              <Auth onAuth={() => {}} />
            </div>
          </div>

          {/* ===================== RIGHT COLUMN ======================= */}
          <div tw="hidden lg:block w-[360px] shrink-0">
            <Auth onAuth={() => {}} />
          </div>
        </div>
      </AppMaxWidth>
    </Page>
  )
}

export default Reserve
