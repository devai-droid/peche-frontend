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
import EmailAuthModal from "@/features/auth/components/email-auth-modal.component"

import React, { useEffect, useState } from "react"
import tw, { styled } from "twin.macro"
import dayjs from "dayjs"
import { Language } from "@/lib/locales/i18n.config"
import { useTranslation } from "react-i18next"
import { useMe } from "@/features/user/hooks/use-user"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

import {
  reservationControllerGetAvailableReservationByDay,
  useReservationControllerFindMine,
  useReservationControllerUpdate,
  useReservationControllerRemove,
} from "@/lib/orval/reservations/reservations"

import { Reservation, AvailableReservationResultDto } from "@/lib/orval/model"
import { isAfter, isSameDay } from "date-fns"

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
const TimeButton = ({ available, selected, children, ...props }: any) => {
  return (
    <Button
      tw="shrink-0 !h-[44px] text-[14px]"
      disabled={!available}
      style={{
        size: "sm",
        variant: selected ? "filled" : "outlined",
        color: selected ? "point" : "gray",
      }}
      {...props}>
      {children}
    </Button>
  )
}

// ─────────────────────────────────
// 본문 시작
// ─────────────────────────────────
const Reservations = () => {
  const { t } = useTranslation()
  const { user } = useMe()
  const authenticated = !!user?.id
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

  const now = new Date()

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

    reservationControllerGetAvailableReservationByDay({
      year: today.year(),
      month: today.month() + 1,
      day: today.date(),
      productIds: currentProducts,
      eventIds: currentEvents,
    }).then((res) => setTodaySlots(res))
  }, [today, changeId])

  const renderTimeSlots = () => {
    const available = new Set(
      todaySlots.map((slot) => dayjs(slot.datetime.replace("Z", "")).format("HH:mm")),
    )

    const times = [
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

    return (
      <div tw="grid grid-cols-3 gap-2 p-4">
        {times.map((time) => (
          <TimeButton
            key={time}
            available={available.has(time)}
            selected={selectedDatetime.includes(time)}
            onClick={() => {
              const base = today.format("YYYY-MM-DD")
              setSelectedDatetime(`${base}T${time}:00`)
            }}>
            {t}
          </TimeButton>
        ))}
      </div>
    )
  }

  const changeReservation = async () => {
    if (!selectedDatetime) return
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
          예약 취소됨
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
          같은 정보로 재예약하기
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
          예약 취소
        </Button>

        <Button
          disabled
          tw="flex-1 text-[13px] md:text-[15px]"
          style={{ variant: "filled", color: "point", size: "sm" }}
          onClick={() => {
            setCurrentProducts(r.products.map((p) => p.product.id))
            setCurrentEvents(r.events.map((e) => e.event.id))
            setChangeId(r.id)
          }}>
          예약 변경
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

    const datetime = r.datetime.replace("T", " ").slice(0, 16)

    const totalPrice =
      r.products.reduce((a, p) => a + p.product.price, 0) +
      r.events.reduce((a, e) => a + (e.event.discountPrice || e.event.price), 0)

    const contact = user?.phoneNumber || user?.email || "-"

    const datetimeDisplay = formatKstDatetime(r.datetime)

    // 지난 예약인지 계산
    const isPast = dayjs(r.datetime).isBefore(dayjs())

    return (
      <Card tw="bg-white px-6 pb-6 flex flex-col gap-6">
        {/* ---------------- 고객정보 ---------------- */}
        <div>
          <div tw="font-semibold text-[16px] md:text-[18px] mb-3 text-neutralBlack">고객정보</div>

          <Row>
            <Label>이름</Label>
            <div tw="text-neutral60">{user?.name ?? "-"}</div>
          </Row>

          <Row>
            <Label>연락처</Label>
            <div tw="text-neutral60">{user?.phoneNumber || user?.email || "-"}</div>
          </Row>
        </div>

        {/* ---------------- 예약정보 ---------------- */}
        <div>
          <div tw="font-semibold text-[16px] md:text-[18px] mb-3 text-neutralBlack">예약정보</div>

          <Row>
            <Label>예약번호</Label>
            <div tw="text-neutral60">{r.palettePlanId}</div>
          </Row>

          <Row>
            <Label>예약일시</Label>
            <div tw="text-neutral60">{datetimeDisplay}</div>
          </Row>

          <Row>
            <Label>예약시술명</Label>
            <div tw="whitespace-pre-wrap text-neutral60">{[...products, ...events].join("\n")}</div>
          </Row>

          <Row>
            <Label>총 금액</Label>
            <div tw="text-neutral60">{totalPrice.toLocaleString()} 원(부가세별도)</div>
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
          <span tw="text-[16px] md:text-[18px]">{formatKstDatetime(list[0].datetime)}</span>

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
    const { i18n } = useTranslation()
    const { language } = i18n
    const isKorean = language === "ko"

    const [params] = useSearchParams()
    const pathVisit = params.get("path_visit")
    const detailVisit = params.get("detail_visit")

    const [openEmailModal, setOpenEmailModal] = React.useState(false)

    /* ---------- 상담채널 이미지 매핑 ---------- */
    const helpImageMap: Record<string, string | null> = {
      ko: KakaoHelp,
      en: WhatsAppHelp,
      zh: null, // 중국 간체 없음
      ja: LineHelp,
      "zh-TW": LineHelp,
      th: LineHelp,
    }

    const helpIcon = helpImageMap[language]

    const HELP_LINKS: Record<Language, string> = {
      ko: "https://pf.kakao.com/_dxoiLn",
      en: "https://wa.me/821025326285",
      ja: "https://line.me/R/ti/p/@235wfyao",
      th: "https://line.me/R/ti/p/@892druai",
      "zh-TW": "https://line.me/R/ti/p/@683jgqmd",

      // 중국 간체는 상담채널 없음 → 빈 문자열 또는 undefined
      zh: "",
    }

    const handleHelpClick = () => {
      const url = HELP_LINKS[language as Language]
      if (!url) return // 중국어(zh)는 링크 없음

      window.open(url, "_blank")
    }

    return (
      <>
        {/* 로고 영역 */}
        <div tw="flex flex-col items-center mb-8">
          <img tw="w-[97px] mx-auto mb-4" src={LogoText} alt="Logo" />

          <div tw="text-center text-[18px] md:text-[22px] font-semibold">
            {t("reservePage.loginRequiredMessage", "본인 인증")}
          </div>
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

          {/* ---- 이메일 인증 ---- */}
          <button
            tw="flex flex-col items-center justify-center gap-2 font-bold text-white text-[15px] md:text-[17px]"
            css={tw`bg-[#4DAA57]`}
            style={{
              width: isKorean ? "220px" : "220px",
              height: "100px",
            }}
            onClick={() => setOpenEmailModal(true)}>
            <Icon icon={EmailIcon} size={26} />
            {t("reservePage.emailVerification")}
          </button>
        </div>

        {/* ================= 상담채널 영역 ================= */}
        {helpIcon && (
          <div tw="w-full flex flex-col items-start px-4 md:px-0 max-w-[460px] mx-auto">
            <div tw="text-[14px] md:text-[16px] mb-3 font-semibold">
              <span tw="text-[15px] font-semibold whitespace-nowrap">
                {t("reservePage.helpChannelTitle", "상담채널")}
              </span>

              <span tw="text-[13px] md:text-[14px] text-neutral60 mt-1 md:mt-0 pl-2">
                {t("reservePage.helpChannelDesc", "SNS 채널을 통해 빠르게 상담받아보세요.")}
              </span>
            </div>

            <button tw="flex items-center gap-2" onClick={handleHelpClick}>
              <img src={helpIcon} alt="help" tw="h-[36px]" />
            </button>
          </div>
        )}

        {/* ================= 이메일 인증 모달 ================= */}
        <EmailAuthModal
          open={openEmailModal}
          onClose={() => setOpenEmailModal(false)}
          onComplete={(info) => {
            setOpenEmailModal(false)
          }}
        />
      </>
    )
  }

  const [openId, setOpenId] = useState<string | null>(null)
  const toggle = (id: string) => setOpenId(openId === id ? null : id)

  const formatKstDatetime = (dt: string) => {
    const d = dayjs(dt.replace("Z", ""))
    const yoilMap = ["일", "월", "화", "수", "목", "금", "토"]
    const yoil = yoilMap[d.day()]
    return d.format(`YYYY/MM/DD(${yoil}) HH:mm`)
  }

  // ─────────────────────────────────
  // 렌더링
  // ─────────────────────────────────
  if (!authenticated) {
    return (
      <Page>
        <div tw="bg-neutral min-h-screen w-full">
          <AppMaxWidth tw="pt-20 pb-20 flex justify-center">
            <div tw="bg-white w-full max-w-[580px] md:h-[470px] px-4 py-10 rounded-none font-pretendard">
              <AuthButtons />
            </div>
          </AppMaxWidth>
        </div>
      </Page>
    )
  }

  return (
    <Page>
      <div tw="bg-neutral min-h-screen w-full">
        <AppMaxWidth tw="pt-16 pb-20 flex flex-col items-center gap-6">
          {/* ---------------- 예약 중 박스 ---------------- */}
          {Object.keys(activeGroups).length > 0 && (
            <div tw="bg-white w-full max-w-[600px] px-4 py-8">
              <SectionTitle tw="text-primary">예약 중</SectionTitle>
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
              <SectionTitle>지난 예약</SectionTitle>
              {Object.keys(pastGroups)
                .sort((a, b) => (dayjs(a).isBefore(dayjs(b)) ? 1 : -1))
                .map((date) => renderAccordion(date, pastGroups[date]))}
            </div>
          )}
        </AppMaxWidth>
      </div>

      {/* ---------------- 변경 모달 ---------------- */}
      <Modal open={!!changeId} title="예약 변경" onClose={() => setChangeId(null)}>
        <div tw="p-4">
          <Calendar
            value={today}
            onChange={(v) => v && setToday(v)}
            footer={<div>{renderTimeSlots()}</div>}
          />

          <div tw="flex justify-end gap-2 mt-6">
            <Button style={{ color: "black" }} onClick={() => setChangeId(null)}>
              취소
            </Button>
            <Button disabled={!selectedDatetime} onClick={changeReservation}>
              변경하기
            </Button>
          </div>
        </div>
      </Modal>

      {/* ---------------- 취소 모달 ---------------- */}
      <Modal open={!!cancelId} title="예약 취소" onClose={() => setCancelId(null)}>
        <div tw="p-4 text-center">
          정말 예약을 취소하시겠습니까?
          <div tw="flex justify-end gap-2 mt-6">
            <Button style={{ color: "black" }} onClick={() => setCancelId(null)}>
              뒤로
            </Button>
            <Button onClick={cancelReservation}>예약 취소</Button>
          </div>
        </div>
      </Modal>
    </Page>
  )
}

export default Reservations
