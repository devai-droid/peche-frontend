/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Calendar, Icon } from "@/design-system/components"
import Auth from "@/features/auth/components/auth.component"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"
import Modal from "@/lib/components/modal/modal.component"
import { HTMLButtonProps } from "@/lib/types/html-element-type"
import React, { useEffect, useState } from "react"
import tw from "twin.macro"
import { useTranslation } from "react-i18next"
import { useMe } from "@/features/user/hooks/use-user"
import {
  reservationControllerGetAvailableReservationByDay,
  useReservationControllerFindMine,
  useReservationControllerUpdate,
} from "@/lib/orval/reservations/reservations"
import { AvailableReservationResultDto, Event, Product, Reservation } from "@/lib/orval/model"
import { Language } from "@/lib/locales/i18n.config"
import { isAfter } from "date-fns"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

import logoText from "@/assets/images/peche-logo-text.png"
import { KakaoLogoMini, EmailIcon } from "@/assets/icon"
import { authService } from "@/lib/service/auth.service"
import { useSearchParams } from "react-router-dom"
import EmailAuthModal from "@/features/auth/components/email-auth-modal.component"

const Card = tw.div`border border-[#d0d0d0] rounded-lg py-4 px-6 flex flex-col gap-1 relative`
const Row = tw.div`flex gap-2`
const Label = tw.div`text-[#717171] w-28 shrink-0`

const TimeButton = ({ selected, ...props }: { selected?: boolean } & HTMLButtonProps) => {
  return (
    <Button
      tw="shrink-0"
      {...props}
      style={{
        size: "sm",
        color: selected ? "point" : "black",
        variant: selected ? "filled" : "outlined",
      }}
    />
  )
}
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

const Reservations = () => {
  const { t, i18n } = useTranslation()
  const { user } = useMe()
  const [authenticated, setAuthenticated] = React.useState(!!user?.id)
  const [changeId, setChangeId] = useState<string | null>(null)
  const [cancelId, setCancelId] = useState<string | null>(null)
  const { data: reservations } = useReservationControllerFindMine(
    {
      statusIn: ["DONE", "WAITING", "CANCELED"],
    },
    {
      query: {
        enabled: authenticated, // 로그인 해야만 호출됨
        retry: false,
      },
    },
  )
  const language = i18n.language as Language
  const [todaySlots, setTodaySlots] = React.useState<AvailableReservationResultDto[]>([])
  const [today, setToday] = React.useState(dayjs())
  const [selectedDatetime, setSelectedDatetime] = React.useState<string>("")
  // IDs of products and events that user is trying to change the date of
  const [currentProducts, setCurrentProducts] = React.useState<any>([])
  const [currentEvents, setCurrentEvents] = React.useState<any>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const [params] = useSearchParams()
  const pathVisit = params.get("path_visit")
  const detailVisit = params.get("detail_visit")
  const [openEmailModal, setOpenEmailModal] = React.useState(false)

  useEffect(() => {
    if (currentProducts.length > 0 || currentEvents.length > 0) {
      getAvailableReservations(today.year(), today.month() + 1, today.date()).then((data) => {
        setTodaySlots(data)
      })
    }
  }, [today, changeId])
  const getAvailableReservations = async (y: number, m: number, d: number) => {
    try {
      setIsLoading(true) // Set loading state to true before making the API call
      const result = await reservationControllerGetAvailableReservationByDay({
        year: y,
        month: m,
        day: d,
        productIds: currentProducts,
        eventIds: currentEvents,
      })
      return result
    } finally {
      setIsLoading(false) // Set loading state to false after the API call is completed
    }
  }

  const { mutateAsync: updateReservation } = useReservationControllerUpdate()

  const changeReservation = async (datetime?: string) => {
    if (changeId && window.confirm(t("reservePage.reservationChangeCheck"))) {
      await updateReservation({ id: changeId, data: { datetime } })
      alert(t("reservePage.reservationChangeConfirm"))
      setChangeId(null)
    }
  }

  const cancelReservation = async () => {
    if (cancelId && window.confirm(t("reservePage.reservationCancelCheck"))) {
      await updateReservation({ id: cancelId, data: { status: "CANCELED" } })
      alert(t("reservePage.reservationCancelConfirm"))
      setCancelId(null)
    }
  }

  const userCard = [
    {
      label: t("reservePage.name"),
      value: user?.name,
    },
    {
      label: t("reservePage.phone"),
      value: user?.phoneNumber,
    },
    {
      label: t("reservePage.memo"),
      value: user?.description || "-",
    },
  ]

  const getProductLocalizedName = (product: Product, lang: string) => {
    switch (lang) {
      case "en":
        return product.nameEN || product.name
      case "ja":
        return product.nameJA || product.name
      case "th":
        return product.nameTH || product.name
      case "zh":
        return product.nameZH || product.name
      default:
        return product.name
    }
  }

  const getEventLocalizedName = (event: Event, lang: string) => {
    switch (lang) {
      case "en":
        return event.nameEN || event.name
      case "ja":
        return event.nameJA || event.name
      case "th":
        return event.nameTH || event.name
      case "zh":
        return event.nameZH || event.name
      default:
        return event.name
    }
  }

  const reservationCard = (reservation: Reservation) => {
    const totalProductPrice = reservation.products.reduce((acc, cur) => {
      const p = cur.product
      return acc + p.price
    }, 0)

    const totalEventPrice = reservation.events.reduce((acc, cur) => {
      const e = cur.event
      return acc + (e.discountPrice && e.discountPrice > 0 ? e.discountPrice : e.price)
    }, 0)

    const withoutSeconds = reservation.datetime.slice(0, -8).replace("T", " ")

    return [
      {
        label: t("reservePage.appointmentTime"),
        value: withoutSeconds,
      },
      {
        label: t("reservePage.treatmentName"),
        value: reservation.products
          .map((product) => getProductLocalizedName(product.product, language))
          .concat(reservation.events.map((event) => getEventLocalizedName(event.event, language)))
          .join("\n"),
      },
      {
        label: t("reservePage.estimatedPrice"),
        value: (
          <div tw="text-[1.5rem] text-point font-extrabold leading-none">
            {(totalProductPrice + totalEventPrice).toLocaleString()} {t("reservePage.won")}
          </div>
        ),
      },
    ]
  }

  const selectedProduct = reservations?.items.find(
    (reservation) => reservation.id === (cancelId || changeId),
  )

  const filteredReservations = reservations?.items.filter((reservation) =>
    isAfter(new Date(reservation.datetime), new Date()),
  )

  const renderTimeSlots = () => {
    if (isLoading) {
      return <div tw="text-center w-full">{t("reservePage.loadingAvailableTime")}</div>
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
    <Page hiddenFooter={false}>
      <div tw="bg-neutral w-screen min-h-[70rem]">
        <AppMaxWidth tw="my-4 pt-24 md:pt-20">
          {/* <div tw="font-semibold text-[24px] md:text-[30px] text-center pb-6">
            {t("reservationCheckPage.reservationCheck")}
          </div>

          {!authenticated && (
            <div tw="max-w-[360px] md:max-w-[580px] mx-auto flex flex-col items-center justify-center py-16 bg-white">
              <img src={logoText} alt="" tw="w-[100px] mb-4" />

              <div tw="text-[18px] md:text-[22px] font-semibold mb-8">
                {t("reservePage.authTitle")}
              </div>

              <div tw="flex justify-center gap-4 w-full max-w-[400px] mx-auto sm:px-2">
                <button
                  tw="h-[100px] w-[145px] md:w-[220px] flex flex-col items-center justify-center 
                    bg-[#FFE812] font-semibold text-[15px] md:text-[17px]"
                  onClick={() => authService.loginWithKakaoSDK(pathVisit, detailVisit)}>
                  <Icon icon={KakaoLogoMini} size={25} />
                  <span tw="pt-1">카카오 인증</span>
                </button>

                <button
                  tw="h-[100px] w-[145px] md:w-[220px] flex flex-col items-center justify-center 
                    bg-[#4DAA57] text-white font-semibold text-[15px] md:text-[17px]"
                  onClick={() => setOpenEmailModal(true)}>
                  <Icon icon={EmailIcon} size={25} />
                  <span tw="pt-1">이메일 인증</span>
                </button>
              </div>

              <EmailAuthModal
                open={openEmailModal}
                onClose={() => setOpenEmailModal(false)}
                onComplete={(info) => {
                  setOpenEmailModal(false)
                  setAuthenticated(true)
                }}
              />
            </div>
          )}

          {authenticated && (
            <div tw="mt-10 flex flex-col lg:flex-row gap-x-11 gap-y-14">
              <div tw="flex-1">
                <div tw="font-bold mb-4">{t("reservePage.customer")}</div>
                <div>
                  <Card tw="gap-6">
                    {userCard.map((item) => (
                      <Row key={item.label}>
                        <Label>{item.label}</Label>
                        <div>{item.value}</div>
                      </Row>
                    ))}
                  </Card>
                </div>
              </div>
              <div tw="flex-1">
                <div tw="font-bold mb-4">{t("common.reservation")}</div>
                <div tw="flex flex-col gap-20">
                  {filteredReservations?.map((reservation, index) => {
                    return (
                      <Card key={index} tw="gap-6">
                        {reservationCard(reservation).map((item) => (
                          <Row key={item.label}>
                            <Label>{item.label}</Label>
                            <div tw="whitespace-pre-wrap">{item.value}</div>
                          </Row>
                        ))}
                        <div tw="relative text-left">
                          <div tw="left-0 bottom-0">
                            {(() => {
                              if (
                                reservation.status === "DONE" ||
                                reservation.status === "WAITING"
                              ) {
                                return (
                                  <>
                                    <Button
                                      style={{ variant: "filled" }}
                                      tw="inline-flex items-center justify-center gap-1"
                                      onClick={() => {
                                        setCurrentProducts(
                                          reservation.products.map((product) => product.product.id),
                                        )
                                        setCurrentEvents(
                                          reservation.events.map((event) => event.event.id),
                                        )
                                        setChangeId(reservation.id)
                                      }}>
                                      {t("reservePage.reservationDateChange")}
                                    </Button>
                                    <Button
                                      style={{ variant: "filled", color: "black" }}
                                      tw="ml-4 inline-flex items-center justify-center gap-1"
                                      onClick={() => {
                                        setCancelId(reservation.id)
                                      }}>
                                      {t("reservePage.reservationCancel")}
                                    </Button>
                                  </>
                                )
                              }
                              if (reservation.status === "CANCELED") {
                                return (
                                  <Button
                                    style={{ variant: "filled" }}
                                    tw="inline-flex items-center justify-center gap-1"
                                    disabled>
                                    {t("reservePage.reservationCanceled")}
                                  </Button>
                                )
                              }
                              return null
                            })()}
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          )} */}
        </AppMaxWidth>
        <Modal open={!!cancelId} title="예약 취소" onClose={() => setCancelId(null)}>
          <div tw="flex flex-col items-center justify-center h-full">
            <div tw="">{t("reservePage.reservationCancelCheck")}</div>
            <div tw="flex flex-col gap-2 my-4">
              <Row>
                <Label>{t("reservePage.reservationDateTime")}</Label>
                <div>
                  {selectedProduct?.datetime &&
                    selectedProduct.datetime.split("T").join(" ").slice(0, 16)}
                </div>
              </Row>
              <Row>
                <Label>{t("reservePage.treatmentName")}</Label>
                <div tw="whitespace-pre-wrap">
                  {[
                    ...(selectedProduct?.products.map((product) => product.product.name) || []),
                    ...(selectedProduct?.events.map((event) => event.event.name) || []),
                  ].join("\n")}
                </div>
              </Row>
            </div>
            <div tw="flex justify-end gap-2">
              <Button
                tw="min-w-[12rem]"
                style={{ variant: "filled", color: "black", size: "lg" }}
                onClick={() => {
                  cancelReservation()
                }}>
                {t("reservePage.reservationCancel")}
              </Button>
              <Button
                tw="min-w-[8rem]"
                style={{ variant: "filled", size: "lg" }}
                onClick={() => {
                  setCancelId(null)
                }}>
                {t("reservePage.cancelButton")}
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          open={!!changeId}
          title={t("reservePage.reservationDateChangeTitle")}
          onClose={() => setChangeId(null)}>
          <div tw="flex flex-col items-center justify-center h-full">
            <div tw="my-4 max-sm:hidden">
              <span tw="font-bold">{t("reservePage.reservationPreviousDate")}</span>
              <span tw="pl-1">
                {selectedProduct?.datetime &&
                  selectedProduct.datetime.split("T").join(" ").slice(0, 16)}
              </span>
            </div>
            <div tw="w-full">
              <Calendar
                value={today}
                onChange={(value) => {
                  if (value) {
                    setToday(value)
                    setSelectedDatetime("")
                  }
                }}
                footer={
                  <div tw="">
                    <div tw="flex gap-4 overflow-auto p-4">{renderTimeSlots()}</div>
                  </div>
                }
              />
            </div>
            <div tw="flex justify-end gap-2 mt-8">
              <Button
                tw="min-w-[8rem]"
                style={{ variant: "filled", color: "black", size: "lg" }}
                onClick={() => {
                  setChangeId(null)
                }}>
                {t("reservePage.cancelButton")}
              </Button>
              <Button
                tw="min-w-[12rem]"
                style={{ variant: "filled", size: "lg" }}
                disabled={!selectedDatetime}
                onClick={() => {
                  changeReservation(selectedDatetime.replaceAll("Z", ""))
                }}>
                {t("reservePage.reservationDateChange")}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Page>
  )
}

export default Reservations
