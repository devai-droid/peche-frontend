import React from "react"
import tw from "twin.macro"
import { useTranslation } from "react-i18next"
import i18n from "i18next"
import { Language } from "@/lib/locales/i18n.config"
import { KakaoLogoMini, EmailIcon, CloseIcon } from "@/assets/icon"
import wechatQrImg from "@/assets/images/wechat-qr.png"
import { Checkbox, Icon, Button } from "@/design-system/components"
import KakaoHelp from "@/assets/images/sns/icon_kakao_help.png"
import WhatsAppHelp from "@/assets/images/sns/icon_WhatsApp_help.png"
import LineHelp from "@/assets/images/sns/icon_LINE_help.png"
import WeChatHelp from "@/assets/images/sns/icon_WeChat_help.png"
import { authService } from "@/lib/service/auth.service"
import { useSearchParams } from "react-router-dom"
import EmailAuthModal from "./email-auth-modal.component"
import { useMe } from "@/features/user/hooks/use-user"
import Modal from "@/lib/components/modal/modal.component"

const H2 = tw.h2`text-lg font-extrabold`

/* ---------------- Props ---------------- */
interface AuthInfo {
  name: string
  phone?: string
  email?: string
}

interface Props {
  onAuth: (info: AuthInfo) => void
  onAgreementChange: (agree: { terms: boolean; privacy: boolean; marketing: boolean }) => void
}

const Auth = ({ onAuth, onAgreementChange }: Props) => {
  const { t } = useTranslation()
  const { language } = i18n
  const { user: me } = useMe()
  const isKorean = language === Language.KOR

  const [params] = useSearchParams()
  const pathVisit = params.get("path_visit")
  const detailVisit = params.get("detail_visit")

  /* ---------------- 인증 상태 ---------------- */
  const [authInfo, setAuthInfo] = React.useState<AuthInfo | null>(null)

  /* ---------------- 약관 상태 ---------------- */
  const [agreeAll, setAgreeAll] = React.useState(false)
  const [agreeTerms, setAgreeTerms] = React.useState(false)
  const [agreePrivacy, setAgreePrivacy] = React.useState(false)
  const [agreeMarketing, setAgreeMarketing] = React.useState(false)

  const [openEmailModal, setOpenEmailModal] = React.useState(false)
  const [openWeChatModal, setOpenWeChatModal] = React.useState(false)

  /* 전체동의 동기화 */
  React.useEffect(() => {
    if (agreeAll) {
      setAgreeTerms(true)
      setAgreePrivacy(true)
      setAgreeMarketing(true)
    }
  }, [agreeAll])

  React.useEffect(() => {
    const token = localStorage.getItem("authToken")

    // 이미 로그인 상태라면 useMe()의 me가 최신 정보
    if (token && me) {
      const info = {
        name: me.name,
        phone: me.phoneNumber,
        email: me.email,
      }

      setAuthInfo(info)
      onAuth(info)
    }
  }, [me])

  /* 부모에 약관 전달 */
  React.useEffect(() => {
    onAgreementChange({
      terms: agreeTerms,
      privacy: agreePrivacy,
      marketing: agreeMarketing,
    })
  }, [agreeTerms, agreePrivacy, agreeMarketing])

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
    en: "https://wa.me/821025326285",
    ja: "https://line.me/R/ti/p/@235wfyao",
    th: "https://line.me/R/ti/p/@892druai",
    "zh-TW": "https://line.me/R/ti/p/@683jgqmd",

    // 중국 간체는 상담채널 없음 → 빈 문자열 또는 undefined
    zh: "",
  }

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
    <div tw="w-full bg-white p-6 font-pretendard tracking-tight leading-[150%] text-[13px] lg:text-[15px]">
      {/* ================= 본인인증 ================= */}
      <div tw="mb-2">
        <H2>{t("reservePage.customerInfo")}</H2>
        <div tw="mt-4 mb-3 border-t border-neutral20" />

        <p tw="font-bold mb-3 text-[14px] lg:text-[16px]">
          {t("auth.identityVerification")}
          <span tw="text-error">*</span>
        </p>
      </div>

      {/* ================= 인증 완료 UI ================= */}
      {authInfo ? (
        <div tw="mb-6 text-[13px] lg:text-[14px]">
          <div tw="flex mb-2">
            <span tw="w-[70px] text-neutral50">{t("auth.name")}</span>
            <span tw="text-neutral50">{authInfo.name}</span>
          </div>

          {authInfo.phone && (
            <div tw="flex mb-2">
              <span tw="w-[70px] text-neutral50">{t("auth.phone")}</span>
              <span tw="text-neutral50">{authInfo.phone}</span>
            </div>
          )}

          {authInfo.email && (
            <div tw="flex mb-2">
              <span tw="w-[70px] text-neutral50">{t("auth.emailAddress")}</span>
              <span tw="text-neutral50">{authInfo.email}</span>
            </div>
          )}

          {/* ================= 로그아웃 버튼 ================= */}
          <div tw="flex justify-start">
            <Button
              onClick={() => {
                // eslint-disable-next-line no-alert
                const confirmLogout = window.confirm(t("reservePage.logoutConfirm"))
                if (confirmLogout) {
                  localStorage.removeItem("authToken")
                  localStorage.removeItem("user")
                  window.location.reload()
                }
              }}
              tw="w-20 h-6 mt-2 px-2"
              style={{
                bold: true,
                variant: "filled",
              }}>
              {t("reservePage.logout")}
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* ================= 인증 버튼 ================= */}
          <div tw="flex gap-3 justify-center items-center mb-6">
            {isKorean && (
              <button
                tw="h-[80px] flex flex-col items-center justify-center gap-2 font-bold"
                css={tw`flex-1 bg-[#FFE812]`}
                onClick={() => {
                  authService.loginWithKakaoSDK(pathVisit, detailVisit)
                }}>
                <Icon icon={KakaoLogoMini} size={25} />
                카카오 인증
              </button>
            )}

            <button
              tw="h-[80px] flex flex-col items-center justify-center gap-2 font-bold text-white"
              css={isKorean ? tw`flex-1 bg-[#4DAA57]` : tw`w-full bg-[#4DAA57]`}
              onClick={() => setOpenEmailModal(true)}>
              <Icon icon={EmailIcon} size={25} />
              {t("reservePage.emailVerification")}
            </button>
          </div>

          {helpIcon && (
            <div tw="w-full max-w-[580px] mb-6">
              {/* 제목 + 설명문구 */}
              <div tw="flex flex-col md:flex-row md:items-center gap-1 mb-3">
                <span tw="text-[15px] font-semibold whitespace-nowrap">
                  {t("auth.counselingChannel")}
                </span>
                <span tw="text-[14px] text-neutral60">{t("auth.counselingChannelText")}</span>
              </div>

              {/* 버튼 */}
              <button
                tw="flex items-center gap-2"
                className="sns-btn-conversion"
                onClick={handleHelpClick}>
                <img src={helpIcon} alt="help" tw="h-[38px]" />
              </button>
            </div>
          )}
        </>
      )}

      {/* ================= 약관동의 ================= */}
      <div>
        <p tw="font-bold mb-3 text-[14px] lg:text-[16px]">
          {t("reservePage.agreementTitle")}
          <span tw="text-error">*</span>
        </p>

        {/* 전체 동의 */}
        <div tw="bg-neutral py-4 border border-[#ddd] mb-3">
          <Checkbox
            checked={agreeAll}
            onChange={(e) => setAgreeAll(e.target.checked)}
            label={<span tw="font-bold">{t("reservePage.agreeToAll")}</span>}
          />
        </div>

        {/* 이용약관 */}
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

        {/* 개인정보 */}
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

        {/* 선택 마케팅 */}
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

      {/* ================= 이메일 인증 모달 ================= */}
      <EmailAuthModal
        open={openEmailModal}
        onClose={() => setOpenEmailModal(false)}
        onComplete={(info) => {
          setOpenEmailModal(false)
          setAuthInfo(info)
          onAuth(info)
        }}
      />
      <Modal open={openWeChatModal} onClose={() => setOpenWeChatModal(false)} width="max-w-md">
        <div tw="-mx-10 -my-8">
          {/* 상단 회색 영역 */}
          <div tw="bg-[#F3F3F3] w-full relative">
            <div tw="px-4 pb-3 pt-12">
              <div tw="text-[24px] font-time text-neutral90">Peche clinic</div>
            </div>

            <button tw="absolute top-3 right-4" onClick={() => setOpenWeChatModal(false)}>
              <CloseIcon width={22} height={22} />
            </button>
          </div>

          {/* QR 영역 */}
          <div tw="p-6 flex justify-center bg-white">
            <img src={wechatQrImg} alt="wechat qr" tw="w-[240px] h-[240px] object-contain" />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Auth
