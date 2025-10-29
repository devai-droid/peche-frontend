import React from "react"
import tw from "twin.macro"
import { useTranslation } from "react-i18next"
import i18n from "i18next"
import "react-phone-number-input/style.css"
import PhoneInput from "react-phone-number-input"
import { E164Number } from "libphonenumber-js/core"
import { Language } from "@/lib/locales/i18n.config"
import { KakaoLogo, LetterIcon, MailIcon } from "@/assets/icon"
import { Button, Icon, toast } from "@/design-system/components"
// import { useLogin } from "@/features/auth/hooks/use-auth"
import { authService } from "@/lib/service/auth.service"
import { useMe } from "@/features/user/hooks/use-user"
import "./auth.component.scss"
import {
  useAuthControllerAuthenticateByEmail,
  useAuthControllerAuthenticateByPhone,
  useAuthControllerCreateEmailCode,
  useAuthControllerCreatePhoneCode,
} from "@/lib/orval/auth/auth"
import { AxiosError } from "axios"
import { ToastType } from "@/design-system/components/toast/toast.component.type"
import { useToken } from "@/lib/hooks/use-token"
import { CountryCode } from "libphonenumber-js/types"
import { useSearchParams } from "react-router-dom"
import LineHelpImg from "@/assets/images/sns/icon_LINE_help.png"
import wechatHelpImg from "@/assets/images/sns/icon_WeChat_help.png"
import whatsappHelpImg from "@/assets/images/sns/icon_WhatsApp_help.png"

const H2 = tw.h2`text-lg font-extrabold`

const AuthBtn = tw.button`flex-1 shrink-0 h-24 border border-[#d0d0d0] rounded-lg flex flex-col justify-center items-center gap-2 font-extrabold`
const SocialAuthBtn = tw(
  Button,
)`flex-1 shrink-0 h-24 border border-[#d0d0d0] rounded-lg flex flex-col justify-center items-center gap-2 font-extrabold`

const InputWrapper = tw.div`flex gap-2 justify-between items-center`
const InputLabel = tw.div`text-sm w-14 shrink-0 hidden sm:block`
const Input = tw.input`h-10 py-1.5 px-2 border border-[#d0d0d0] rounded-lg flex-1 min-w-0 w-full placeholder-gray-400`
const PhoneWrapper = tw.div`h-10 py-1.5 px-2 border border-[#d0d0d0] rounded-lg flex-1 min-w-0 w-full`

interface Props {
  onAuth: () => void
}

const Auth = ({ onAuth }: Props) => {
  const { t } = useTranslation()
  const { language } = i18n
  const { user: me } = useMe()
  const { setToken } = useToken()
  const [authType, setAuthType] = React.useState<"kakao" | "sms" | "email">("sms")
  const [phoneNumber, setPhoneNumber] = React.useState<E164Number>()
  const [code, setCode] = React.useState<string>("")
  const [name, setName] = React.useState<string>("")
  const [email, setEmail] = React.useState<string>("")
  const [isTermsCheckboxChecked, setTermsCheckboxChecked] = React.useState(false)
  const [params] = useSearchParams()
  const pathVisit = params.get("path_visit")
  const detailVisit = params.get("detail_visit")

  React.useEffect(() => {
    // 중국어일때 이메일 인증만 가능하게
    if (language === Language.CHN) {
      setAuthType("email")
    }
    // 한국어 일때는 이용약관 체크박스 체크 안해도 인증 가능하게
    // if (language === Language.KOR) {
    //   setTermsCheckboxChecked(true)
    // } else {
    //   setTermsCheckboxChecked(false)
    // }
  }, [language])

  const { mutate: createEmailCode } = useAuthControllerCreateEmailCode({
    mutation: {
      onSuccess: () => {
        toast({ type: ToastType.Success, message: t("auth.authSent") })
      },
      onError: (error: AxiosError) => {
        const { message, response } = error
        const { message: responseMessage } = response?.data as { message: string }
        toast({
          message: `${responseMessage || message}`,
          type: ToastType.Highlight,
        })
      },
    },
  })

  const { mutate: createPhoneCode } = useAuthControllerCreatePhoneCode({
    mutation: {
      onSuccess: () => {
        toast({ type: ToastType.Success, message: t("auth.authSent") })
      },
      onError: (error: AxiosError) => {
        const { message, response } = error
        const { message: responseMessage } = response?.data as { message: string }

        const finalMessage = (responseMessage || message).includes("Delay")
          ? t("error.authErrorDelay")
          : `${responseMessage || message}`

        toast({
          message: finalMessage,
          type: ToastType.Highlight,
        })
      },
    },
  })

  const { mutate: authByPhone } = useAuthControllerAuthenticateByPhone({
    mutation: {
      onSuccess: (data) => {
        setToken(data.token)
        onAuth()
        toast({ type: ToastType.Success, message: t("auth.authSuccess") })
      },
      onError: (error: AxiosError) => {
        const { message, response } = error
        const { message: responseMessage } = response?.data as { message: string }
        toast({
          message: `${responseMessage || message}`,
          type: ToastType.Highlight,
        })
      },
    },
  })

  const { mutate: authByEmailCode } = useAuthControllerAuthenticateByEmail({
    mutation: {
      onSuccess: (data) => {
        setToken(data.token)
        onAuth()
        toast({ type: ToastType.Success, message: t("auth.authSuccess") })
      },
      onError: (error: AxiosError) => {
        const { message, response } = error
        const { message: responseMessage } = response?.data as { message: string }

        const finalMessage = (responseMessage || message).includes("Unauthorized")
          ? t("error.emailError")
          : `${responseMessage || message}`
        toast({
          message: finalMessage,
          type: ToastType.Highlight,
        })
      },
    },
  })

  // 전화번호 국가코드 매핑
  const languageToCountryMap: { [key: string]: string } = {
    ko: "KR",
    en: "US",
    zh: "CN",
    ja: "JP",
    th: "TH",
  }

  const inputField = document.getElementById("inputField")
  const errorDiv = document.getElementById("error")
  inputField?.addEventListener("input", (event) => {
    const { value } = event.target as HTMLInputElement
    const isEnglishOrKorean =
      /^[A-Za-z0-9\u3131-\uD79D\s]*$/.test(value) && !/[\u4E00-\u9FFF]/.test(value)

    if (errorDiv) {
      if (isEnglishOrKorean || value === "") {
        errorDiv.style.display = "none"
        inputField.style.backgroundColor = "white" // Reset to default background color
      } else {
        errorDiv.style.display = "block"
        inputField.style.backgroundColor = "lightcoral" // Set background color to red
      }
    }
  })
  const [showDisabledText, setShowDisabledText] = React.useState(false)

  return me ? (
    <div>
      <H2>
        <span tw="text-point">{me.name}</span>
        {t("reservePage.welcome")}
      </H2>
      <div tw="mt-1 text-sm text-[#999] whitespace-pre-wrap tracking-tight">
        {t("reservePage.nameFix")}
      </div>
      <Button
        onClick={() => {
          // 로그아웃 / 인증 토큰 삭제
          // eslint-disable-next-line no-alert
          const confirmLogout = window.confirm(t("reservePage.logoutConfirm"))
          if (confirmLogout) {
            localStorage.removeItem("authToken") // Remove the authToken
            localStorage.removeItem("user") // Remove the user
            window.location.reload() // Refresh the page
          }
        }}
        tw="w-28 px-2 mt-4"
        style={{
          bold: true,
          variant: "filled",
        }}>
        {t("reservePage.logout")}
      </Button>
    </div>
  ) : (
    <div>
      <H2>{t("reservePage.auth")}</H2>
      <div tw="mt-3 mb-6">{t("reservePage.authDescription")}</div>
      <div tw="flex gap-4 justify-center items-center lg:max-w-2xl mx-auto">
        {language === Language.KOR ? (
          <SocialAuthBtn
            tw=""
            onClick={() => {
              setAuthType("kakao")
              authService.loginWithKakaoSDK(pathVisit, detailVisit)
            }}>
            <div tw="w-10 h-10 rounded-full bg-[#FFE812] flex justify-center items-center">
              <Icon icon={KakaoLogo} />
            </div>
            카카오톡 인증
          </SocialAuthBtn>
        ) : null}
        <AuthBtn
          css={authType === "sms" && tw`bg-[#f3e8da]`}
          onClick={() => {
            if (language === "zh") return // 중국어일때는 클릭 불가
            setAuthType("sms")
          }}
          style={language === "zh" ? { cursor: "not-allowed", opacity: 0.6 } : {}}>
          <div
            tw="w-10 h-10 rounded-full  flex justify-center items-center"
            css={[authType === "sms" ? tw`bg-white` : tw`bg-[#f3e8da]`]}>
            <Icon icon={LetterIcon} size={40} />
          </div>
          {t("reservePage.smsVerification")}
        </AuthBtn>
        {language !== Language.KOR ? (
          <AuthBtn
            css={authType === "email" && tw`bg-[#f3e8da]`}
            onClick={() => setAuthType("email")}>
            <div
              tw="w-10 h-10 rounded-full  flex justify-center items-center"
              css={[authType === "email" ? tw`bg-white` : tw`bg-[#f3e8da]`]}>
              <Icon icon={MailIcon} size={40} />
            </div>
            {t("reservePage.emailVerification")}
          </AuthBtn>
        ) : null}
      </div>
      <div
        tw="flex flex-col gap-6 mt-10 sm:(max-w-md mx-auto)"
        css={authType !== "sms" && tw`hidden`}>
        <InputWrapper>
          <InputLabel>{t("reservePage.name")}</InputLabel>
          <Input
            id="inputField"
            placeholder={t("reservePage.name")}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
        </InputWrapper>
        <div
          id="error"
          tw="flex"
          style={{ marginTop: "-1rem", fontSize: "16px", color: "red", display: "none" }}>
          {t("reservePage.nameError")}
        </div>
        <div tw="flex" style={{ marginTop: "-1rem", fontSize: "16px", color: "red" }}>
          {t("reservePage.namePlaceholder")}
        </div>
        <InputWrapper>
          <InputLabel>{t("reservePage.phone")}</InputLabel>
          <div tw="flex-1 flex gap-2.5">
            <PhoneWrapper>
              <PhoneInput
                international
                className="placeholder-transparent"
                countryCallingCodeEditable={false}
                placeholder={t("reservePage.phone")}
                defaultCountry={languageToCountryMap[language] as CountryCode | undefined}
                value={phoneNumber}
                onChange={setPhoneNumber}
              />
            </PhoneWrapper>
            {/* <Button
              onClick={() => createPhoneCode({ data: { phoneNumber: `${phoneNumber}` } })}
              tw="w-28 px-2"
              style={{
                bold: true,
                variant: "filled",
              }}
              disabled={!isTermsCheckboxChecked}>
              {t("reservePage.getVerificationCode")}
            </Button> */}

            <div
              onMouseEnter={() => {
                if (!isTermsCheckboxChecked) {
                  setShowDisabledText(true) // Show the text on hover
                }
              }}
              onMouseLeave={() => {
                setShowDisabledText(false) // Hide the text when hover ends
              }}>
              <Button
                onClick={() => {
                  if (isTermsCheckboxChecked) {
                    createPhoneCode({ data: { phoneNumber: `${phoneNumber}` } })
                  }
                }}
                tw="w-28 px-2"
                style={{
                  bold: true,
                  variant: "filled",
                }}
                disabled={!isTermsCheckboxChecked} // Still disable the button functionality
              >
                {t("reservePage.getVerificationCode")}
              </Button>
            </div>
          </div>
        </InputWrapper>
        <div id="error" tw="flex" style={{ marginTop: "-1rem", fontSize: "16px", color: "red" }}>
          {!isTermsCheckboxChecked && showDisabledText && (
            <p tw="text-red-500 mt-2">{t("reservePage.checkBoxPress")}</p>
          )}
        </div>
        {/* 체크박스 확인 안되있으면 인증코드 버튼 안눌리게 해야함 */}
        <div tw="flex flex-col gap-2">
          <div tw="flex items-start gap-2">
            <input
              tw="mt-1"
              type="checkbox"
              id="termsCheckbox"
              onChange={(e) => setTermsCheckboxChecked(e.target.checked)}
            />
            <label htmlFor="termsCheckbox">{t("reservePage.smsCodeTerms")}</label>
          </div>
        </div>
        <div tw="flex" style={{ marginTop: "-1rem", marginLeft: "1rem", fontSize: "12px" }}>
          <a
            href={`/${language}/termsofservice`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginRight: "6px", textDecoration: "underline" }}>
            {t("footer.termsOfService")}
          </a>
          <a
            href={`/${language}/privacypolicy`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline" }}>
            {t("footer.privacyPolicy")}
          </a>
        </div>
        <InputWrapper>
          <InputLabel>{t("reservePage.verificationCode")}</InputLabel>
          <div tw="flex-1 flex gap-2.5">
            <Input
              placeholder={t("reservePage.verificationCodePlaceholder")}
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
              }}
            />
            <Button
              onClick={() => authByPhone({ data: { phoneNumber: `${phoneNumber}`, code, name } })}
              tw="w-28 px-2"
              style={{
                bold: true,
                variant: "filled",
                color: "black",
              }}>
              {t("reservePage.confirmVerificationCode")}
            </Button>
          </div>
        </InputWrapper>
      </div>
      <div
        tw="flex flex-col gap-6 mt-10 sm:(max-w-md mx-auto)"
        css={authType !== "email" && tw`hidden`}>
        <InputWrapper>
          <InputLabel>{t("reservePage.name")}</InputLabel>
          <Input
            placeholder={t("reservePage.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputWrapper>
        <div tw="flex" style={{ marginTop: "-1rem", fontSize: "16px", color: "red" }}>
          {t("reservePage.namePlaceholder")}
        </div>
        <InputWrapper>
          <InputLabel>{t("reservePage.email")}</InputLabel>
          <div tw="flex-1 flex gap-2.5">
            <Input
              placeholder={t("reservePage.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
            />
            <Button
              onClick={() => createEmailCode({ data: { email } })}
              type="submit"
              tw="w-28 px-2"
              disabled={!name.trim()}
              style={{
                bold: true,
                variant: "filled",
              }}>
              {t("reservePage.getVerificationCode")}
            </Button>
          </div>
        </InputWrapper>
        <InputWrapper>
          <InputLabel>{t("reservePage.verificationCode")}</InputLabel>
          <div tw="flex-1 flex gap-2.5">
            <Input
              placeholder={t("reservePage.verificationCodePlaceholder")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button
              onClick={() => authByEmailCode({ data: { email, code, name } })}
              tw="w-28 px-2"
              style={{
                bold: true,
                variant: "filled",
                color: "black",
              }}>
              {t("reservePage.confirmVerificationCode")}
            </Button>
          </div>
        </InputWrapper>
      </div>
      <div
        tw="flex gap-4 justify-center items-center mt-10 lg:max-w-2xl mx-auto"
        style={{ fontSize: "15px" }}>
        {language === Language.ENG && (
          <div>
            *If the verification code is not working, please contact us through the channels below.
            <div tw="flex" style={{ marginTop: "1rem" }}>
              <a
                href="https://wa.me/+1027694410"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: "6px", textDecoration: "underline" }}>
                <img
                  src={whatsappHelpImg}
                  alt="WhatsApp"
                  style={{ width: "100px", height: "50px" }}
                />
              </a>
            </div>
          </div>
        )}
        {language === Language.CHN && (
          <div>
            无法确认验证码时，请通过以下渠道进行咨询。
            <div tw="flex" style={{ marginTop: "1rem" }}>
              <a
                href="https://work.weixin.qq.com/kfid/kfc8dbe1152fad99e74"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: "6px", textDecoration: "underline" }}>
                <img src={wechatHelpImg} alt="weChat" style={{ width: "100px", height: "50px" }} />
              </a>
              <span>&nbsp;</span>
              <a
                href="https://lin.ee/DDK3D3JK"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: "6px", textDecoration: "underline" }}>
                <img src={LineHelpImg} alt="Line" style={{ width: "100px", height: "50px" }} />
              </a>
              <span>&nbsp;</span>
              <a
                href="https://wa.me/821059494410"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: "6px", textDecoration: "underline" }}>
                <img
                  src={whatsappHelpImg}
                  alt="whatsApp"
                  style={{ width: "100px", height: "50px" }}
                />
              </a>
            </div>
          </div>
        )}
        {language === Language.JPN && (
          <div>
            認証コードの確認ができない場合は、下記のチャンネルでお問い合わせください
            <div tw="flex" style={{ marginTop: "1rem" }}>
              <a
                href="https://lin.ee/efw7rbT"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: "6px", textDecoration: "underline" }}>
                <img src={LineHelpImg} alt="Line" style={{ width: "100px", height: "50px" }} />
              </a>
            </div>
          </div>
        )}
        {language === Language.THA && (
          <div>
            กรณีที่ไม่สามารถดูโค้ดได้ สามารถติดต่อช่องทางด้านล่างนี้ได้เลยนะคะ
            <div tw="flex" style={{ marginTop: "1rem" }}>
              <a
                href="https://lin.ee/BNTlo0y"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: "6px", textDecoration: "underline" }}>
                <img src={LineHelpImg} alt="Line" style={{ width: "100px", height: "50px" }} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Auth
