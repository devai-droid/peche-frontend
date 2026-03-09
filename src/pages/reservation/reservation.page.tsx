/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Calendar, Icon } from "@/design-system/components"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"
import Modal from "@/lib/components/modal/modal.component"
import { authService } from "@/lib/service/auth.service"
import { useSearchParams } from "react-router-dom"
import { KakaoLogoMini, EmailIcon } from "@/assets/icon"
import LogoText from "@/assets/images/peche-logo-text.png"
import KakaoHelp from "@/assets/images/sns/icon_kakao_help.png"
import WhatsAppHelp from "@/assets/images/sns/icon_WhatsApp_help.png"
import LineHelp from "@/assets/images/sns/icon_LINE_help.png"
import WeChatHelp from "@/assets/images/sns/icon_WeChat_help.png"
// TODO: icon_Instagram_help.png 에셋 추가 후 교체 예정
import InstaHelpIcon from "@/assets/icons/Logo-Insta.svg"
import wechatQrImg from "@/assets/images/wechat-qr.png"
import EmailAuthModal from "@/features/auth/components/email-auth-modal.component"

import React, { useEffect, useState } from "react"
import tw, { styled } from "twin.macro"
import dayjs from "dayjs"
import { Language } from "@/lib/locales/i18n.config"
import { useTranslation } from "react-i18next"
import { useMe } from "@/features/user/hooks/use-user"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import localizedFormat from "dayjs/plugin/localizedFormat"

import {
  reservationControllerGetAvailableReservationByDayPublic,
  useReservationControllerFindMine,
  useReservationControllerUpdate,
  useReservationControllerRemove,
} from "@/lib/orval/reservations/reservations"

import { Reservation, AvailableReservationResultDto } from "@/lib/orval/model"

import "dayjs/locale/en"
import "dayjs/locale/zh-cn"
import "dayjs/locale/ja"
import "dayjs/locale/zh-tw"
import "dayjs/locale/th"

dayjs.extend(localizedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

const DATE_FORMAT_BY_LANG: Record<string, (d: dayjs.Dayjs) => string> = {
  ko: (d) => {
    const yoilMap = ["일", "월", "화", "수", "목", "금", "토"]
    return d.format(`YYYY/MM/DD(${yoilMap[d.day()]}) HH:mm`)
  },

  en: (d) => d.locale("en").format("dddd, MMMM D, YYYY, h:mm A"),

  zh: (d) => d.locale("zh-cn").format("YYYY年M月D日，dddd，A h:mm"),

  "zh-TW": (d) => d.locale("zh-tw").format("YYYY年M月D日，dddd，A h:mm"),

  ja: (d) => d.locale("ja").format("YYYY年M月D日（ddd）A h時mm分"),

  th: (d) => {
    // 태국: 불교력 (서기 + 543)
    const buddhistYear = d.year() + 543
    return d.locale("th").format(`วันddddที่ D MMMM พ.ศ. ${buddhistYear} เวลา HH:mm น.`)
  },
}

const formatReservationDatetime = (dt: string, language: string) => {
  const d = dayjs(dt.replace("Z", "")).tz("Asia/Seoul")

  const formatter = DATE_FORMAT_BY_LANG[language] ?? DATE_FORMAT_BY_LANG.ko

  return formatter(d)
}

// ─────────────────────────────────
// Accordion 스타일 (MostPopular 디자인 동일 적용)
// ─────────────────────────────────
const AccordionItem = tw.div`border-b border-[#ddd]`

const AccordionHeader = styled.div<{ open: boolean }>`
  ${tw`flex items-center justify-between py-4 cursor-pointer font-pretendard tracking-tight leading-[140%]`}
  font-weight: 600;

  svg {
    ${tw`w-4 h-4 transition-transform`}
    transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0deg)")};
    stroke: #9b9b9b;
  }
`

const AccordionContent = styled.div<{ open: boolean }>`
  ${tw`overflow-hidden transition-all duration-300 ease-in-out`}
  max-height: ${({ open }) => (open ? "1000px" : "0")};
`

// ─────────────────────────────────
// Styled 카드 요소
// ─────────────────────────────────
const Card = tw.div`py-4 px-6 flex flex-col gap-3 bg-white font-pretendard tracking-tight leading-[140%]`
const Row = tw.div`flex gap-2 text-[16px] md:text-[18px] font-pretendard tracking-tight leading-[140%] py-1`
const Label = tw.div`text-neutralBlack w-28 shrink-0 font-pretendard tracking-tight leading-[140%]`
const SectionTitle = tw.div`font-bold text-[18px] md:text-[22px] mb-4 font-pretendard tracking-tight leading-[140%]`

// 시간 버튼 스타일
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

// ─────────────────────────────────
// 본문 시작
// ─────────────────────────────────
const Reservations = () => {
  const { t, i18n } = useTranslation()
  const { language } = i18n
  const { user } = useMe()
  const [authenticated, setAuthenticated] = React.useState(!!user?.id)
  dayjs.extend(utc)
  dayjs.extend(timezone)

  const { data: reservationData } = useReservationControllerFindMine(
    { statusIn: ["DONE", "WAITING", "CANCELED"] },
    { query: { enabled: authenticated, retry: false } },
  )

  const { mutateAsync: updateReservation } = useReservationControllerUpdate()
  const { mutateAsync: removeReservation } = useReservationControllerRemove()

  const reservations: Reservation[] = reservationData?.items ?? []

  // ─────────────────────────────────
  // 예약 그룹 분리
  // ─────────────────────────────────
  const activeReservations: Reservation[] = []
  const pastReservations: Reservation[] = []

  React.useEffect(() => {
    setAuthenticated(!!user?.id)
  }, [user])

  reservations.forEach((r) => {
    const date = dayjs.utc(r.datetime).tz("Asia/Seoul")
    const nowKst = dayjs().tz("Asia/Seoul")

    if (r.status === "CANCELED") {
      pastReservations.push(r)
    } else if (date.isSame(nowKst, "day") || date.isAfter(nowKst)) {
      activeReservations.push(r)
    } else {
      pastReservations.push(r)
    }
  })

  const groupByDate = (list: Reservation[]) => {
    const groups: Record<string, Reservation[]> = {}
    list.forEach((r) => {
      const key = dayjs(r.datetime).format("YYYY-MM-DD")
      if (!groups[key]) groups[key] = []
      groups[key].push(r)
    })
    return groups
  }

  const activeGroups = groupByDate(activeReservations)
  const pastGroups = groupByDate(pastReservations)

  // ─────────────────────────────────
  // 변경/취소 모달
  // ─────────────────────────────────
  const [changeId, setChangeId] = useState<string | null>(null)
  const [cancelId, setCancelId] = useState<string | null>(null)

  const [currentProducts, setCurrentProducts] = useState<any[]>([])
  const [currentEvents, setCurrentEvents] = useState<any[]>([])

  // ─────────────────────────────────
  // 날짜 / 시간 처리
  // ─────────────────────────────────
  const [today, setToday] = useState(dayjs())
  const [todaySlots, setTodaySlots] = useState<AvailableReservationResultDto[]>([])
  const [selectedDatetime, setSelectedDatetime] = useState("")

  useEffect(() => {
    if (!changeId) return
    if (currentProducts.length === 0 && currentEvents.length === 0) return

    reservationControllerGetAvailableReservationByDayPublic({
      year: today.year(),
      month: today.month() + 1,
      day: today.date(),
      productIds: currentProducts,
      eventIds: currentEvents,
    }).then((res) => setTodaySlots(res))
  }, [today, changeId])

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

  const changeReservation = async () => {
    if (!selectedDatetime) return
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await updateReservation({ id: changeId!, data: { datetime: selectedDatetime } })
    alert("예약이 변경되었습니다.")
    setChangeId(null)
  }

  const cancelReservation = async () => {
    if (!cancelId) return

    try {
      await removeReservation({ id: cancelId })
      alert("예약이 취소되었습니다.")
    } catch (e) {
      alert("취소 중 오류가 발생했습니다.")
    }

    setCancelId(null)
  }

  const renderButtons = (r: Reservation, isPast: boolean) => {
    // 1. 취소된 예약 → 비활성 버튼
    if (r.status === "CANCELED") {
      return (
        <Button
          disabled
          tw="w-full mt-2 text-[13px] md:text-[15px]"
          style={{ variant: "outlined", color: "point", size: "sm" }}>
          {t("reservationCheckPage.reservationCanceled")}
        </Button>
      )
    }

    // 2. 지난 예약 → 같은 정보로 재예약하기
    if (isPast) {
      return (
        <Button
          disabled
          tw="w-full mt-2 text-[13px] md:text-[15px]"
          style={{ variant: "filled", color: "point", size: "sm" }}
          onClick={() => {
            // setCurrentProducts(r.products.map((p) => p.product.id))
            // setCurrentEvents(r.events.map((e) => e.event.id))
            // setChangeId(r.id)
          }}>
          {t("reservationCheckPage.customerInfo")}
        </Button>
      )
    }

    // 3. 예약 중 → 취소 / 변경 버튼 2개
    return (
      <div tw="flex gap-3 pt-2">
        <Button
          tw="flex-1 text-[13px] md:text-[15px]"
          style={{ variant: "outlined", color: "point", size: "sm" }}
          onClick={() => setCancelId(r.id)}>
          {t("reservationCheckPage.reservationCancel")}
        </Button>

        <Button
          tw="flex-1 text-[13px] md:text-[15px]"
          style={{ variant: "filled", color: "point", size: "sm" }}
          onClick={() => {
            setCurrentProducts(r.products.map((p) => p.product.id))
            setCurrentEvents(r.events.map((e) => e.event.id))
            setChangeId(r.id)
          }}>
          {t("reservationCheckPage.reservationChange")}
        </Button>
      </div>
    )
  }

  // ─────────────────────────────────
  // 카드 렌더링
  // ─────────────────────────────────
  const renderReservationCard = (r: Reservation) => {
    const products = r.products.map((p) => p.product.name)
    const events = r.events.map((e) => e.event.name)

    const totalPrice =
      r.products.reduce((a, p) => a + p.product.price, 0) +
      r.events.reduce((a, e) => a + (e.event.discountPrice || e.event.price), 0)

    // 지난 예약인지 계산
    const isPast = dayjs(r.datetime).isBefore(dayjs())

    return (
      <Card key={r.id} tw="bg-white px-6 pb-6 flex flex-col gap-6">
        {/* ---------------- 고객정보 ---------------- */}
        <div>
          <div tw="font-semibold text-[16px] md:text-[18px] mb-3 text-neutralBlack">
            {t("reservationCheckPage.customerInfo")}
          </div>

          <Row>
            <Label>{t("reservationCheckPage.name")}</Label>
            <div tw="text-neutral60">{user?.name ?? "-"}</div>
          </Row>

          <Row>
            <Label>{t("reservationCheckPage.contact")}</Label>
            <div tw="text-neutral60">{user?.phoneNumber || user?.email || "-"}</div>
          </Row>
        </div>

        {/* ---------------- 예약정보 ---------------- */}
        <div>
          <div tw="font-semibold text-[16px] md:text-[18px] mb-3 text-neutralBlack">
            {t("reservationCheckPage.reservationInfo")}
          </div>

          <Row>
            <Label>{t("reservationCheckPage.reservationNumber")}</Label>
            <div tw="text-neutral60">{r.palettePlanId}</div>
          </Row>

          <Row>
            <Label>{t("reservationCheckPage.reservationDate")}</Label>
            <div tw="text-neutral60">{formatReservationDatetime(r.datetime, language)}</div>
          </Row>

          <Row>
            <Label>{t("reservationCheckPage.treatmentList")}</Label>
            <div tw="whitespace-pre-wrap text-neutral60">{[...products, ...events].join("\n")}</div>
          </Row>

          <Row>
            <Label>{t("reservationCheckPage.totalPrice")}</Label>
            <div tw="text-neutral60">
              {totalPrice.toLocaleString()} {t("reservationCheckPage.vatNotIncluded")}
            </div>
          </Row>
        </div>

        {/* ---------------- 버튼 영역 ---------------- */}
        {renderButtons(r, isPast)}
      </Card>
    )
  }

  const renderAccordion = (date: string, list: Reservation[]) => {
    const isOpen = openId === date

    return (
      <AccordionItem key={date}>
        <AccordionHeader open={isOpen} onClick={() => toggle(date)}>
          <span tw="text-[16px] md:text-[18px]">
            {formatReservationDatetime(list[0].datetime, language)}
          </span>

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </AccordionHeader>

        <AccordionContent open={isOpen}>
          <div tw="flex flex-col gap-4">{list.map((r) => renderReservationCard(r))}</div>
        </AccordionContent>
      </AccordionItem>
    )
  }

  const AuthButtons = () => {
    const isKorean = language === "ko"

    const [params] = useSearchParams()
    const pathVisit = params.get("path_visit")
    const detailVisit = params.get("detail_visit")

    const [openEmailModal, setOpenEmailModal] = React.useState(false)
    const [openWeChatModal, setOpenWeChatModal] = React.useState(false)

    /* ---------- 상담채널 이미지 매핑 ---------- */
    const helpImageMap: Record<string, string | null> = {
      ko: KakaoHelp,
      en: WhatsAppHelp,
      zh: WeChatHelp,
      ja: LineHelp,
      "zh-TW": LineHelp,
      th: LineHelp,
    }

    const helpIcon = helpImageMap[language]

    const HELP_LINKS: Record<Language, string> = {
      ko: "https://pf.kakao.com/_dxoiLn",
      en: "https://wa.me/message/3ARKGGTBNAY2M1",
      ja: "https://line.me/R/ti/p/@235wfyao",
      th: "https://line.me/R/ti/p/@892druai",
      "zh-TW": "https://line.me/R/ti/p/@683jgqmd",

      // 중국 간체는 상담채널 없음 → 빈 문자열 또는 undefined
      zh: "",
    }

    const INSTAGRAM_LINKS: Record<string, string> = {
      en: "https://www.instagram.com/pecheclinic.en/",
      zh: "https://www.instagram.com/pecheclinic.cn/",
      ja: "https://www.instagram.com/pecheclinic.jp/",
    }
    const instaLink = INSTAGRAM_LINKS[language]

    const handleHelpClick = () => {
      if (language === Language.CHN) {
        setOpenWeChatModal(true)
        return
      }

      const url = HELP_LINKS[language as Language]
      if (!url) return

      window.open(url, "_blank")
    }

    return (
      <>
        {/* 로고 영역 */}
        <div tw="flex flex-col items-center mb-8">
          <img tw="w-[97px] mx-auto mb-4" src={LogoText} alt="Logo" />
        </div>

        {/* ================= 상담채널 영역 (상단) ================= */}
        {helpIcon && (
          <div tw="w-full flex flex-col items-center px-4 md:px-0 max-w-[460px] mx-auto mb-10">
            <div tw="text-center text-[18px] md:text-[22px] font-semibold mb-2">
              {t("auth.counselingChannel")}
            </div>
            <div tw="text-center text-[13px] md:text-[14px] text-neutral60 mb-4">
              {t("auth.counselingChannelText")}
            </div>

            <div tw="flex items-center gap-3">
              <button tw="flex items-center gap-2" onClick={handleHelpClick}>
                <img src={helpIcon} alt="help" tw="h-[36px]" />
              </button>
              {instaLink && (
                <a
                  href={instaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  tw="flex items-center">
                  <img src={InstaHelpIcon} alt="Instagram" tw="h-[36px]" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* ================= 본인인증 (하단) ================= */}
        <div tw="text-center text-[18px] md:text-[22px] font-semibold mb-8">
          {t("auth.identityVerification")}
        </div>

        {/* ===================== 인증 버튼 그룹 ===================== */}
        <div tw="flex justify-center gap-4 mb-10" css={tw`flex-row`}>
          {/* ---- 카카오 인증 (한국어 전용) ---- */}
          {isKorean && (
            <button
              tw="flex flex-col items-center justify-center gap-2 font-bold text-[15px] md:text-[17px]"
              css={tw`bg-[#FFE812]`}
              style={{
                width: "220px",
                height: "100px",
              }}
              onClick={() => {
                authService.loginWithKakaoSDK(pathVisit, detailVisit)
              }}>
              <Icon icon={KakaoLogoMini} size={26} />
              카카오 인증
            </button>
          )}

          {/* ---- 이메일 인증 (한국어 제외) ---- */}
          {!isKorean && (
            <button
              tw="flex flex-col items-center justify-center gap-2 font-bold text-white text-[15px] md:text-[17px]"
              css={tw`bg-[#4DAA57]`}
              style={{
                width: "220px",
                height: "100px",
              }}
              onClick={() => setOpenEmailModal(true)}>
              <Icon icon={EmailIcon} size={26} />
              {t("reservePage.emailVerification")}
            </button>
          )}
        </div>

        {/* ================= 이메일 인증 모달 ================= */}
        <EmailAuthModal
          open={openEmailModal}
          onClose={() => setOpenEmailModal(false)}
          onComplete={() => {
            setOpenEmailModal(false)
            window.location.reload()
          }}
        />
        <Modal open={openWeChatModal} onClose={() => setOpenWeChatModal(false)} width="max-w-md">
          <div tw="-mx-10 -my-8">
            {/* 상단 영역 */}
            <div tw="bg-[#F3F3F3] w-full relative">
              <div tw="px-4 pb-3 pt-12">
                <div tw="text-[24px] font-time text-neutral90">Peche clinic</div>
              </div>

              <button tw="absolute top-3 right-4" onClick={() => setOpenWeChatModal(false)}>
                ✕
              </button>
            </div>

            {/* QR 영역 */}
            <div tw="p-6 flex justify-center bg-white">
              <img src={wechatQrImg} alt="wechat qr" tw="w-[240px] h-[240px] object-contain" />
            </div>
          </div>
        </Modal>
      </>
    )
  }

  const [openId, setOpenId] = useState<string | null>(null)
  const toggle = (id: string) => setOpenId(openId === id ? null : id)

  const H1 = tw.h1`text-xl font-bold`

  // ─────────────────────────────────
  // 렌더링
  // ─────────────────────────────────
  if (!authenticated) {
    return (
      <Page>
        <div tw="bg-neutral min-h-screen w-full font-pretendard">
          <AppMaxWidth tw="pt-20 pb-20 flex flex-col items-center">
            <H1 tw="pt-4 md:pt-0 pb-8 text-[24px] lg:text-[30px] text-center">
              {t("reservationCheckPage.reservationCheck")}
            </H1>
            <div tw="bg-white w-full max-w-[580px] md:min-h-[470px] px-4 py-10 rounded-none font-pretendard">
              <AuthButtons />
            </div>
          </AppMaxWidth>
        </div>
      </Page>
    )
  }

  return (
    <Page>
      <div tw="bg-neutral min-h-screen w-full font-pretendard">
        <AppMaxWidth tw="pt-16 pb-20 flex flex-col items-center gap-6">
          <H1 tw="pt-4 md:pt-0 pb-0 text-[24px] lg:text-[30px] text-center">
            {t("reservationCheckPage.reservationCheck")}
          </H1>
          {/* ---------------- 예약 중 박스 ---------------- */}
          {Object.keys(activeGroups).length > 0 && (
            <div tw="bg-white w-full max-w-[600px] px-4 py-8">
              <SectionTitle tw="text-primary">{t("reservationCheckPage.upcoming")}</SectionTitle>
              {Object.keys(activeGroups)
                .sort((a, b) => (dayjs(a).isBefore(dayjs(b)) ? 1 : -1))
                .map((date) => renderAccordion(date, activeGroups[date]))}
            </div>
          )}

          {/* 여백 (bg-neutral 노출) */}
          <div tw="h-4" />

          {/* ---------------- 지난 예약 박스 ---------------- */}
          {Object.keys(pastGroups).length > 0 && (
            <div tw="bg-white w-full max-w-[600px] px-4 py-8">
              <SectionTitle>{t("reservationCheckPage.past")}</SectionTitle>
              {Object.keys(pastGroups)
                .sort((a, b) => (dayjs(a).isBefore(dayjs(b)) ? 1 : -1))
                .map((date) => renderAccordion(date, pastGroups[date]))}
            </div>
          )}
        </AppMaxWidth>
      </div>

      {/* ---------------- 변경 모달 ---------------- */}
      <Modal open={!!changeId} title="예약 변경" onClose={() => setChangeId(null)}>
        <div
          tw="p-4 overflow-y-auto font-pretendard"
          css={{
            maxHeight: "700px",
            "@media (max-width: 640px)": {
              maxHeight: "85vh",
            },
            WebkitOverflowScrolling: "touch", // 모바일 스크롤 부드럽게
          }}>
          <Calendar
            value={today}
            onChange={(v) => v && setToday(v)}
            footer={<div>{renderTimeSlots()}</div>}
          />

          <div tw="flex justify-end gap-2 mt-6">
            <Button style={{ color: "black" }} onClick={() => setChangeId(null)}>
              {t("reservationCheckPage.cancel")}
            </Button>
            <Button disabled={!selectedDatetime} onClick={changeReservation}>
              {t("reservationCheckPage.reservationChange")}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ---------------- 취소 모달 ---------------- */}
      <Modal open={!!cancelId} onClose={() => setCancelId(null)}>
        <div tw="p-4 text-center font-pretendard">
          {t("reservationCheckPage.cancelConfirm")}
          <div tw="flex justify-end gap-2 mt-6">
            <Button style={{ color: "black" }} onClick={() => setCancelId(null)}>
              {t("reservationCheckPage.back")}
            </Button>
            <Button onClick={cancelReservation}>
              {t("reservationCheckPage.reservationCancel")}
            </Button>
          </div>
        </div>
      </Modal>
    </Page>
  )
}

export default Reservations
