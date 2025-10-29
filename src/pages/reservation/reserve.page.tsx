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
import { useParams, useSearchParams } from "react-router-dom"
import { Language } from "@/lib/locales/i18n.config"
import { userControllerUpdateMine } from "@/lib/orval/users/users"
import { useMe } from "@/features/user/hooks/use-user"

const H1 = tw.h1`text-xl font-bold`
const H2 = tw.h2`text-lg font-extrabold`
const Textarea = tw.textarea`h-10 py-1.5 px-2 border border-[#d0d0d0] rounded-lg flex-1 min-w-0 w-full`

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
      <span>{children}</span>
    </Button>
  )
}
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
    if (language === "en") {
      const m = monthNames[date.getMonth()]
      return `${m} ${day}`
    }
    return `${year}/${month}/${day}`
  }
  return (
    <div tw="last-of-type:([&>hr]:hidden)">
      <div tw="flex justify-between -ml-3">
        <div tw="flex-1">
          <Checkbox
            checked={checked}
            onChange={(event) => {
              onCheck(event.target.checked)
            }}
            label={tv(item.product ?? (item.event as Event), "name")}
          />
          {item.event &&
            item.event.category &&
            item.event.category.startDate &&
            item.event.category.endDate && (
              <div tw="flex ml-12 text-[#999] text-sm">
                <Icon icon={CalendarSimpleIcon} size={16} tw="mt-1 mr-1" />
                <p>
                  {formatDate(item.event.category.startDate)} ~{" "}
                  {formatDate(item.event.category.endDate)}
                  {item.event.category.startHour !== undefined &&
                  item.event.category.startMinute !== undefined
                    ? ` ${item.event.category.startHour}:${String(
                        item.event.category.startMinute,
                      ).padStart(2, "0")} ${item.event.category.startHour < 12 ? " am" : " pm"}`
                    : ""}{" "}
                  ~{" "}
                  {item.event.category.endHour !== undefined &&
                  item.event.category.endMinute !== undefined
                    ? ` ${item.event.category.endHour}:${String(
                        item.event.category.endMinute,
                      ).padStart(2, "0")} ${item.event.category.endHour < 12 ? " am" : " pm"}`
                    : ""}
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
        {item.event && item.event.discountPrice && item.event.price && (
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
  const [inquiryChecked, setInquiryChecked] = React.useState(inquiry)
  const { checkedList, setCheckedList } = useCart()
  const { t } = useTranslation()

  return (
    <>
      <div tw="flex items-center justify-between mb-3 -ml-3">
        <Checkbox
          checked={inquiryChecked}
          onChange={(event) => {
            if (event.target.checked) {
              setCheckedList(cart.map((item) => item.event?.id || item.product?.id || ""))
              setInquiryChecked(true)
              setInquiry(true)
            } else {
              setCheckedList([])
              setInquiryChecked(false)
              setInquiry(false)
            }
          }}
          label={<H2>{t("button.selectAll")} </H2>}
        />
        <div>
          <Button
            style={{ size: "lg" }}
            onClick={() => {
              removeFromCart(checkedList)
              setCheckedList([])
              setInquiryChecked(false)
              setInquiry(!inquiryChecked)
            }}>
            {t("button.deleteSelection")}
          </Button>
        </div>
      </div>
      <div tw="rounded-lg border border-[#d0d0d0] pl-5 pr-4">
        <div tw="-ml-3 my-3">
          <Checkbox
            checked={inquiryChecked}
            onChange={(event) => {
              setInquiryChecked(event.target.checked)
              setInquiry(event.target.checked)
            }}
            label={t("reservePage.bookConsultation")}
          />

          <hr tw="mt-3 mb-5" />
        </div>

        <div>
          <div tw="flex flex-col">
            {cart.map((item) => (
              <SurgeryItem
                key={item.event?.id || item.product?.id}
                checked={checkedList.includes(item.event?.id || item.product?.id || "")}
                onCheck={(checked) => {
                  const id = item.event?.id || item.product?.id || ""
                  if (checked) {
                    setCheckedList([...checkedList, id])
                  } else {
                    setCheckedList(checkedList.filter((checkedId) => id !== checkedId))
                  }
                }}
                item={item}
                updateCartItem={updateCartItem}
              />
            ))}
          </div>
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
  const [todaySlots, setTodaySlots] = React.useState<AvailableReservationResultDto[]>([])
  const [today, setToday] = React.useState(dayjs())
  const [selectedDatetime, setSelectedDatetime] = React.useState<string>("")
  const [userMemo, setUserMemo] = React.useState("")
  const [privacyAgreement, setPrivacyAgreement] = React.useState(false)
  const [marketingAgreement, setMarketingAgreement] = React.useState(false)
  const [params] = useSearchParams()
  const pathVisit = params.get("path_visit")
  const detailVisit = params.get("detail_visit")
  const [currentSelectedDate, setCurrentSelectedDate] = React.useState(dayjs())
  const [eventDateOutOfRange, setEventDateOutOfRange] = React.useState(false)

  const pdfUrls = {
    ko: "https://xenia-files.s3.us-east-1.amazonaws.com/xenia_ko.pdf",
    en: "https://xenia-files.s3.us-east-1.amazonaws.com/xenia_en.pdf",
    ja: "https://xenia-files.s3.us-east-1.amazonaws.com/xenia_ja.pdf",
    zh: "https://xenia-files.s3.us-east-1.amazonaws.com/xenia_zh.pdf",
    th: "https://xenia-files.s3.us-east-1.amazonaws.com/xenia_th.pdf",
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function normalizeDate(date: any) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  useEffect(() => {
    if (getCheckedEventIds().length > 0 || getCheckedProductIds().length > 0 || inquiry) {
      getAvailableReservations(today.year(), today.month() + 1, today.date()).then((data) => {
        setTodaySlots(data)
      })
    }

    const storedData = localStorage.getItem("eventEndDates")

    if (storedData) {
      // Parse the stored data into an object
      const eventEndDates = JSON.parse(storedData)

      let isOutOfRange = false
      const normalizedCurrentDate = normalizeDate(currentSelectedDate.toDate())

      // Check each ID in checkList
      checkedList.forEach((id) => {
        // Check if the current id exists in eventEndDates
        if (id in eventEndDates) {
          const endDateStr = eventEndDates[id]
          const endDate = new Date(endDateStr)
          const normalizedEndDate = normalizeDate(endDate)
          if (normalizedEndDate < normalizedCurrentDate) {
            // Ensure both are Date objects for comparison
            isOutOfRange = true
          }
        }
      })
      setEventDateOutOfRange(isOutOfRange)
    }
  }, [today, inquiry, checkedList])

  const [isLoading, setIsLoading] = React.useState(false)

  const getAvailableReservations = async (y: number, m: number, d: number) => {
    try {
      setIsLoading(true) // Set loading state to true before making the API call
      const result = await reservationControllerGetAvailableReservationByDay({
        year: y,
        month: m,
        day: d,
        productIds: getProductIdWithInquiry(),
        eventIds: getCheckedEventIds(),
      })
      return result
    } catch (error) {
      console.error(error) // Log the error to the console
      throw error
    } finally {
      setIsLoading(false) // Set loading state to false after the API call is completed
    }
  }
  const { mutate, isLoading: createLoading } = useReservationControllerCreate()

  const getProductIdWithInquiry = () => {
    const productIds = getCheckedProductIds() ?? []
    const inquiryProductId = DEFAULT_CONSULTATION_PRODUCT_ID[env.STAGE]
    if (inquiry && !productIds.includes(inquiryProductId)) {
      productIds.push(inquiryProductId)
    }
    return productIds
  }

  const reserve = () => {
    // 예약자의 국적 정보 설정
    userControllerUpdateMine({ languageLocale: language })

    getProductIdWithInquiry()
    // adminMemo 에 들어갈 상품명과 이벤트명을 가져옴
    const eventAndProductNames = cart
      .map((item) => {
        const productName = getCheckedProductIds()?.includes(item.product?.id ?? "")
          ? (item.product?.name || "").trim()
          : ""
        const eventName = getCheckedEventIds()?.includes(item.event?.id ?? "")
          ? (item.event?.name || "").trim()
          : ""
        return `${eventName}${productName}`
      })
      .filter((memo) => memo !== "")
      .join("\n")

    // Concatenate "상담하기" to eventAndProductNames if inquiry is true
    const finalEventAndProductNames = inquiry
      ? `${eventAndProductNames}\n상담하기`
      : eventAndProductNames

    mutate(
      {
        data: {
          userMemo,
          adminMemo: finalEventAndProductNames,
          datetime: selectedDatetime.replaceAll("Z", ""),
          productIds: getProductIdWithInquiry(),
          eventIds: getCheckedEventIds(),
          ...(pathVisit && detailVisit && { pathVisit, detailVisit }),
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

  const renderTimeSlots = () => {
    if (isLoading) {
      return <div tw="text-center w-full">{t("reservePage.loadingAvailableTime")}</div>
    }
    if (!me) {
      return <div tw="text-center w-full">{t("reservePage.needAuth")}</div>
    }
    if (eventDateOutOfRange) {
      return <div tw="text-center w-full">{t("reservePage.eventDateOutOfRange")}</div>
    }

    dayjs.extend(utc)

    // 중국어일때 평일 마감시간이 19시, 토요일 15시인 부분 세팅. 공휴일에 16시 마감
    const filteredTodaySlots = (() => {
      if (i18n.language !== "zh") {
        return todaySlots
      }

      // Step 1: 평일, 토요일 필터
      const slots = todaySlots.filter((slot) => {
        const koreaTime = dayjs.utc(slot.datetime)
        const hour = koreaTime.hour()
        const day = koreaTime.day()
        if (day === 6) {
          return hour < 15 // Saturday cutoff 15:00
        }
        return hour < 19 // Weekday cutoff 19:00
      })

      // Step 2: 공휴일 필터 (중국어면 16:00 마감, 나머지는 16:30 마감)
      if (slots.length > 0) {
        // Sort slots ascending
        slots.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())

        const lastSlot = slots.at(-1)
        if (lastSlot) {
          const lastHour = new Date(lastSlot.datetime).getUTCHours()
          if (lastHour === 16) {
            slots.pop()
          }
        }
      }

      return slots
    })()

    const availableTimes = new Set(
      filteredTodaySlots.map((slot) => dayjs(slot.datetime.replaceAll("Z", "")).format("HH:mm")),
    )

    return (
      <div tw="flex gap-4 overflow-auto p-4">
        {allSlots.map((slot, index) => {
          const isAvailable = availableTimes.has(slot)
          return (
            <TimeButton
              key={index}
              onClick={() => {
                if (isAvailable) {
                  const baseDatetime = todaySlots[0].datetime // "2024-08-07T10:00:00.000Z"
                  const newTime = slot // "11:00"
                  // Split the base datetime string to extract the date part
                  const [datePart] = baseDatetime.split("T")

                  // Construct the new datetime string by combining the date part with the new time
                  const newDatetime = `${datePart}T${newTime}:00.000Z`
                  setSelectedDatetime(newDatetime)
                }
              }}
              // selected={selectedDatetime === dayjs(slot, "HH:mm").toISOString()}
              selected={selectedDatetime ? selectedDatetime.split("T")[1].startsWith(slot) : false}
              disabled={!isAvailable}>
              {slot}
            </TimeButton>
          )
        })}
      </div>
    )
  }

  return (
    <Page>
      <AppMaxWidth tw="font-nanumgothic py-8 lg:py-12">
        <H1>{t("reservePage.reserve")}</H1>
        <hr tw="mt-4 mb-6" />
        <Auth
          onAuth={() => {
            navigate(".")
          }}
        />

        <div tw="flex flex-col lg:flex-row gap-x-6 gap-y-16 mt-20">
          <div tw="flex-1">
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
          </div>

          <div tw="lg:w-[24rem]">
            <H2 tw="mb-6">{t("reservePage.selectDateAndTime")}</H2>
            <div tw="h-16 -mt-1" />
            {/* [TODO] Calendar 에 onChange, shouldDisableDate... 으로 처리하면 됩니다. */}
            <Calendar
              key={language}
              disabled={isLoading}
              value={today}
              onChange={(value) => {
                if (value) {
                  setCurrentSelectedDate(value)
                  setToday(value)
                  setSelectedDatetime("")
                }
              }} // [TODO] 날짜 선택시 처리
              footer={
                <div tw="">
                  <div tw="flex gap-4 overflow-auto p-4">{renderTimeSlots()}</div>
                </div>
              }
            />
          </div>
        </div>

        <div tw="mt-11 mb-16">
          <div tw="flex items-center gap-9 lg:(max-w-xl items-start) mx-auto">
            <p tw="text-sm">{t("reservePage.memo")}</p>
            <Textarea
              value={userMemo}
              onChange={(event) => {
                setUserMemo(event.target.value)
              }}
              tw="lg:h-24"
            />
          </div>

          <div tw="text-[#717171] text-center my-10">{t("reservePage.guardianConsentText")}</div>

          {/* [TODO] 링크연결 */}
          <Button
            tw="flex justify-center items-center gap-2 min-w-[15rem] mx-auto"
            style={{
              color: "black",
              variant: "filled",
              size: "lg",
            }}
            onClick={() => {
              const pdfUrl = pdfUrls[language] || pdfUrls.en
              window.open(pdfUrl, "_blank")
            }}>
            <Icon icon={DownloadIcon} size={30} />
            {t("reservePage.guardianConsent")}
          </Button>
        </div>

        <hr />
        <div tw="py-4 text-[#333]">
          <Checkbox
            checked={privacyAgreement && marketingAgreement}
            onChange={(event) => {
              setPrivacyAgreement(event.target.checked)
              setMarketingAgreement(event.target.checked)
            }}
            label={<div tw="font-bold">{t("reservePage.agreeToAll")}</div>}
          />
          <div tw="flex items-center">
            <Checkbox
              checked={privacyAgreement}
              onChange={(event) => {
                setPrivacyAgreement(event.target.checked)
              }}
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
            onChange={(event) => {
              setMarketingAgreement(event.target.checked)
            }}
            checked={marketingAgreement}
            label={t("reservePage.marketingAgreement")}
          />
        </div>
        <hr />

        <div tw="mx-auto lg:max-w-lg">
          <div tw="flex justify-between mt-16">
            <div tw="font-extrabold text-sm mt-1 lg:text-xl">{t("reservePage.estimatedPrice")}</div>
            <div tw="text-right">
              <div tw="mb-4 lg:mb-2 text-point font-extrabold text-lg lg:text-[1.5rem]">
                {cart
                  .filter(
                    (item) =>
                      (item.event || item.product) &&
                      checkedList.includes(item.event?.id || item.product?.id || ""),
                  )
                  .reduce((acc, cur) => {
                    return (
                      acc +
                      (cur.event?.discountPrice || cur.event?.price || cur.product?.price || 0) *
                        cur.count
                    )
                  }, 0)
                  .toLocaleString()}
                {t("reservePage.won")}
              </div>
              {t("reservePage.vatNotIncluded")}
            </div>
          </div>

          <div tw="mt-6 mb-14 text-sm text-[#999] whitespace-pre-wrap tracking-tight">
            {t("productDetail.reserveDescription")}
          </div>

          <Button
            disabled={!selectedDatetime || !privacyAgreement || createLoading}
            tw="mb-5"
            style={{
              flexible: true,
              variant: "filled",
              size: "lg",
            }}
            onClick={reserve}>
            {t("button.reserve")}
          </Button>
          {!selectedDatetime && (
            <div tw="text-xs text-[#F40000] whitespace-pre-wrap tracking-tight">
              {t("productDetail.reserveButtonActiveText1")}
            </div>
          )}
          {!privacyAgreement && (
            <div tw="text-xs text-[#F40000] whitespace-pre-wrap tracking-tight">
              {t("productDetail.reserveButtonActiveText2")}
            </div>
          )}
        </div>
      </AppMaxWidth>
    </Page>
  )
}

export default Reserve
