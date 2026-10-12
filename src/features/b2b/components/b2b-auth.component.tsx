import React from "react"
import tw from "twin.macro"
import { useTranslation } from "react-i18next"
import i18n from "i18next"
import { Button, Checkbox, Input, toast } from "@/design-system/components"
import { ToastType } from "@/design-system/components/toast/toast.component.type"
import { useQuery } from "@tanstack/react-query"
import { b2bApi, b2bErrorMessage, b2bTokenStore } from "@/features/b2b/b2b.api"

const H2 = tw.h2`text-lg font-extrabold`
const Label = tw.p`mb-2 text-[13px] lg:text-[14px] font-semibold`
const Field = tw(Input)`w-full h-[40px] pl-2 text-[15px] lg:text-[16px] border border-neutral20`

interface AuthInfo {
  name: string
  phone?: string
  email?: string
}

interface Props {
  onAuth: (info: AuthInfo | null) => void
  onAgreementChange: (agree: { terms: boolean; privacy: boolean; marketing: boolean }) => void
  // 예약 완료·인증 만료 시 부모가 값을 올려 인증 화면을 초기화한다
  resetKey?: number
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const isValidMobile = (value: string) => /^01[016789][0-9]{7,8}$/.test(value.replace(/[^0-9]/g, ""))

/**
 * B2B 사이트 고객정보 영역: 회사 이메일 인증(이름·휴대폰·회사 이메일 → 인증번호).
 * 인증 1번으로 예약 1건만 할 수 있다(30분 유효). 공식 사이트 로그인은 쓰지 않는다.
 */
const B2bAuth = ({ onAuth, onAgreementChange, resetKey }: Props) => {
  const { t } = useTranslation()
  const { language } = i18n

  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [code, setCode] = React.useState("")
  const [codeSent, setCodeSent] = React.useState(false)
  const [sending, setSending] = React.useState(false)
  const [verifying, setVerifying] = React.useState(false)
  const [verified, setVerified] = React.useState<{ companyName: string; name: string } | null>(null)

  const [agreeAll, setAgreeAll] = React.useState(false)
  const [agreeTerms, setAgreeTerms] = React.useState(false)
  const [agreePrivacy, setAgreePrivacy] = React.useState(false)
  const [agreeMarketing, setAgreeMarketing] = React.useState(false)

  // 예약 화면 안내 문구(본인 이용·내원 시 확인 방법 등). 어드민 '협약사 관리'에서 입력, 비우면 숨김.
  const { data: notice } = useQuery({
    queryKey: ["b2b", "notice"],
    queryFn: () => b2bApi.notice().then((res) => res.reservationNotice),
    staleTime: 1000 * 60 * 5,
  })

  const formValid = !!name.trim() && isValidMobile(phone) && isValidEmail(email)

  React.useEffect(() => {
    if (agreeAll) {
      setAgreeTerms(true)
      setAgreePrivacy(true)
      setAgreeMarketing(true)
    }
  }, [agreeAll])

  React.useEffect(() => {
    onAgreementChange({ terms: agreeTerms, privacy: agreePrivacy, marketing: agreeMarketing })
  }, [agreeTerms, agreePrivacy, agreeMarketing])

  // 새로고침하면 이전 인증은 쓰지 않는다(예약할 때마다 새로 인증)
  React.useEffect(() => {
    b2bTokenStore.clear()
  }, [])

  React.useEffect(() => {
    if (resetKey === undefined || resetKey === 0) return
    b2bTokenStore.clear()
    setVerified(null)
    setCode("")
    setCodeSent(false)
    onAuth(null)
  }, [resetKey])

  const requestCode = async () => {
    if (!formValid || sending) return
    setSending(true)
    try {
      await b2bApi.requestCode({ name: name.trim(), phone, email: email.trim() })
      setCodeSent(true)
      toast({ type: ToastType.Success, message: "회사 이메일로 인증번호를 보냈습니다." })
    } catch (e) {
      toast({
        type: ToastType.Warning,
        message: b2bErrorMessage(e, "인증번호를 보내지 못했습니다. 잠시 후 다시 시도해 주세요."),
      })
    } finally {
      setSending(false)
    }
  }

  const verify = async () => {
    if (!code.trim() || verifying) return
    setVerifying(true)
    try {
      const result = await b2bApi.verify({
        name: name.trim(),
        phone,
        email: email.trim(),
        code: code.trim(),
      })
      b2bTokenStore.set(result.token)
      setVerified({ companyName: result.companyName, name: result.name })
      onAuth({ name: result.name, phone, email: email.trim() })
      toast({ type: ToastType.Success, message: t("auth.authSuccess") })
    } catch (e) {
      toast({
        type: ToastType.Warning,
        message: b2bErrorMessage(e, "인증번호가 올바르지 않습니다."),
      })
    } finally {
      setVerifying(false)
    }
  }

  const resetVerification = () => {
    b2bTokenStore.clear()
    setVerified(null)
    setCode("")
    setCodeSent(false)
    onAuth(null)
  }

  return (
    <div tw="w-full bg-white p-6 font-pretendard tracking-tight leading-[150%] text-[13px] lg:text-[15px]">
      <div tw="mb-2">
        <H2>{t("reservePage.customerInfo")}</H2>
        <div tw="mt-4 mb-3 border-t border-neutral20" />
      </div>

      {notice && (
        <div tw="mb-5">
          {/* 예약 화면 왼쪽 'STEP n' 라벨과 같은 스타일 */}
          <p tw="mb-2 text-primary text-[12px] md:text-[13px] font-bold tracking-[0.06em] leading-none font-pretendard">
            NOTICE
          </p>
          <div tw="px-3 py-2.5 bg-neutral border border-neutral20 text-[13px] lg:text-[14px] leading-[160%] whitespace-pre-line text-neutral70">
            {notice}
          </div>
        </div>
      )}

      <div tw="mb-2">
        <p tw="font-bold mb-3 text-[14px] lg:text-[16px]">
          협력 기업 임직원 확인
          <span tw="text-error">*</span>
        </p>
      </div>

      {verified ? (
        <div tw="mb-6 text-[13px] lg:text-[14px]">
          <div tw="flex mb-2">
            <span tw="w-[70px] text-neutral50">회사</span>
            <span tw="text-neutral50">{verified.companyName}</span>
          </div>
          <div tw="flex mb-2">
            <span tw="w-[70px] text-neutral50">{t("auth.name")}</span>
            <span tw="text-neutral50">{verified.name}</span>
          </div>
          <div tw="flex mb-2">
            <span tw="w-[70px] text-neutral50">{t("auth.phone")}</span>
            <span tw="text-neutral50">{phone}</span>
          </div>
          <div tw="flex mb-2">
            <span tw="w-[70px] text-neutral50">{t("auth.emailAddress")}</span>
            <span tw="text-neutral50">{email}</span>
          </div>
          <div tw="flex mb-2">
            <span tw="text-secondary3">인증은 30분 동안 예약 1건에만 사용할 수 있습니다.</span>
          </div>
          <Button
            tw="h-6 mt-2 px-2"
            style={{ bold: true, variant: "filled" }}
            onClick={resetVerification}>
            다시 인증
          </Button>
        </div>
      ) : (
        <div tw="mb-6 flex flex-col gap-4">
          <div>
            <Label>{t("auth.name")}</Label>
            <Field
              placeholder={t("auth.namePlaceholder")}
              value={name}
              disabled={codeSent}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label>{t("auth.phone")}</Label>
            <Field
              placeholder="010-0000-0000"
              inputMode="tel"
              value={phone}
              disabled={codeSent}
              onChange={(e) => setPhone(e.target.value)}
            />
            {phone.length > 0 && !isValidMobile(phone) && (
              <div tw="mt-1 text-[12px] text-red-500">휴대폰 번호를 정확히 입력해 주세요.</div>
            )}
          </div>
          <div>
            <Label>회사 이메일</Label>
            <div tw="flex gap-2 items-center">
              <Field
                tw="flex-1 min-w-0"
                placeholder="name@company.com"
                inputMode="email"
                value={email}
                disabled={codeSent}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />
              <Button
                tw="h-[40px] px-4 text-[13px] lg:text-[15px] whitespace-nowrap"
                disabled={!formValid || sending}
                style={{ variant: "filled", color: "point" }}
                onClick={requestCode}>
                {codeSent ? "재발송" : t("auth.sendCode")}
              </Button>
            </div>
          </div>
          {codeSent && (
            <div>
              <Label>{t("auth.authCode")}</Label>
              <div tw="flex gap-2 items-center">
                <Field
                  tw="flex-1 min-w-0"
                  placeholder={t("auth.authCodePlaceholder")}
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button
                  tw="h-[40px] px-4 text-[13px] lg:text-[15px] whitespace-nowrap"
                  disabled={!code.trim() || verifying}
                  style={{ variant: "filled", color: "point" }}
                  onClick={verify}>
                  {t("auth.confirm")}
                </Button>
              </div>
              <button
                tw="mt-2 text-[12px] text-neutral60 underline"
                onClick={() => {
                  setCodeSent(false)
                  setCode("")
                }}>
                입력 정보 수정
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= 약관동의 ================= */}
      <div>
        <p tw="font-bold mb-3 text-[14px] lg:text-[16px]">
          {t("reservePage.agreementTitle")}
          <span tw="text-error">*</span>
        </p>
        <div tw="bg-neutral py-4 border border-[#ddd] mb-3">
          <Checkbox
            checked={agreeAll}
            onChange={(e) => setAgreeAll(e.target.checked)}
            label={<span tw="font-bold">{t("reservePage.agreeToAll")}</span>}
          />
        </div>
        <div tw="flex justify-between items-start mb-6">
          <Checkbox
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            label={t("reservePage.termsOfService")}
          />
          <a
            tw="underline text-neutral70 ml-4 whitespace-nowrap"
            href={`/${language}/termsofservice`}
            target="_blank"
            rel="noreferrer">
            {t("reservePage.detail")}
          </a>
        </div>
        <div tw="flex justify-between items-start mb-6">
          <Checkbox
            checked={agreePrivacy}
            onChange={(e) => setAgreePrivacy(e.target.checked)}
            label={t("reservePage.privacyAgreement")}
          />
          <a
            tw="underline text-neutral70 ml-4 whitespace-nowrap"
            href={`/${language}/privacypolicy`}
            target="_blank"
            rel="noreferrer">
            {t("reservePage.detail")}
          </a>
        </div>
        <div tw="flex justify-between items-start mb-6">
          <Checkbox
            checked={agreeMarketing}
            onChange={(e) => setAgreeMarketing(e.target.checked)}
            label={t("reservePage.marketingAgreement")}
          />
        </div>
        <div tw="text-[13px] lg:text-[14px] text-secondary3">
          {t("reservePage.marketingNotice")}
        </div>
      </div>
    </div>
  )
}

export default B2bAuth
