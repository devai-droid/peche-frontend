// email-auth-modal.component.tsx
import React from "react"
import tw from "twin.macro"
import Modal from "@/lib/components/modal/modal.component"
import { CloseIcon } from "@/assets/icon"
import { Button, Input, toast } from "@/design-system/components"
import { useTranslation } from "react-i18next"
import {
  useAuthControllerCreateEmailCode,
  useAuthControllerAuthenticateByEmail,
} from "@/lib/orval/auth/auth"
import { ToastType } from "@/design-system/components/toast/toast.component.type"
import { useQueryClient } from "@tanstack/react-query"
import { useToken } from "@/lib/hooks/use-token"

interface Props {
  open: boolean
  onClose: () => void
  onComplete: (info: { name: string; email: string }) => void
}

const EmailAuthModal = ({ open, onClose, onComplete }: Props) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { setToken } = useToken()

  const [email, setEmail] = React.useState("")
  const [emailTouched, setEmailTouched] = React.useState(false)

  const [code, setCode] = React.useState("")
  const [codeTouched, setCodeTouched] = React.useState(false)
  const [codeError, setCodeError] = React.useState(false)
  const [sentModalOpen, setSentModalOpen] = React.useState(false)

  const [name, setName] = React.useState("")

  /* ---------------- 이메일 유효성 체크 ---------------- */
  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const emailValid = isValidEmail(email)

  /* ---------------- 이메일 보더 색 ---------------- */
  let emailBorderStyle = tw`border-neutral20`
  if (emailTouched) {
    if (emailValid) emailBorderStyle = tw`border-green-600`
    else emailBorderStyle = tw`border-red-500`
  }

  /* ---------------- 인증코드 보더 색 ---------------- */
  let codeBorderStyle = tw`border-neutral20`
  if (codeTouched) {
    if (codeError) codeBorderStyle = tw`border-red-500`
    else if (code.length > 0) codeBorderStyle = tw`border-green-600`
  }

  /* ---------------- 인증코드 요청 ---------------- */
  const { mutate: createEmailCode } = useAuthControllerCreateEmailCode({
    mutation: {
      onSuccess: () => {
        setSentModalOpen(true)
      },
      onError: (err) => {
        console.log(err)
      },
    },
  })

  /* ---------------- 이메일 인증 ---------------- */
  const { mutate: authByEmailCode } = useAuthControllerAuthenticateByEmail({
    mutation: {
      onSuccess: (data) => {
        setCodeError(false)
        localStorage.setItem("authToken", data.token)
        // IMPORTANT: Axios Authorization 헤더 적용
        setToken(data.token)

        // 로그인 상태 갱신
        queryClient.invalidateQueries({ queryKey: ["me"] })

        // 부모 컴포넌트로 인증된 정보 전달
        onComplete({
          name,
          email,
        })

        localStorage.setItem("user", JSON.stringify({ name, email }))

        toast({ type: ToastType.Success, message: t("auth.authSuccess") })
      },
      onError: () => {
        setCodeError(true)
      },
    },
  })

  const SendCodeModal = ({
    openCodeModal,
    onCloseCodeModal,
  }: {
    openCodeModal: boolean
    onCloseCodeModal: () => void
  }) => {
    return (
      <Modal open={openCodeModal} onClose={onCloseCodeModal}>
        <div tw="-my-8 w-full">
          <div tw="p-10 lg:p-14 text-center font-pretendard">
            <p tw="text-[18px] md:text-[22px] font-semibold leading-[1.4] mb-6">
              <span tw="text-primary">{t("auth.codeSentText1")}</span>
              <br />
              {t("auth.codeSentText2")}
            </p>

            <Button
              tw="w-full h-[48px] text-[16px] font-semibold bg-[#C97A60]"
              style={{ variant: "filled" }}
              onClick={onCloseCodeModal}>
              {t("auth.confirm")}
            </Button>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <>
      <Modal open={open} onClose={onClose}>
        {/* Modal 기본 padding(px-10 py-8) 제거용 wrapper */}
        <div tw="-mx-10 -my-8 relative">
          {/* ------------------------ 닫기 버튼 ------------------------ */}
          <button onClick={onClose} tw="absolute top-4 right-4 z-10">
            <CloseIcon width={22} height={22} />
          </button>

          {/* ------------------------ 본문 컨텐츠 ------------------------ */}
          <div tw="p-4 lg:p-14 w-full font-pretendard tracking-tight leading-[150%]">
            {/* 제목 */}
            <div tw="mb-4">
              <div tw="text-[18px] lg:text-[22px] font-extrabold">
                <span tw="text-primary">{t("auth.email")}</span>
                <span tw="text-neutralBlack"> {t("auth.auth")}</span>
              </div>
            </div>

            {/* 이름 입력 */}
            <div tw="mb-4">
              <p tw="mb-2 text-[13px] lg:text-[14px] font-semibold">{t("auth.name")}</p>
              <Input
                placeholder={t("auth.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                tw="w-full flex-1 min-w-0 h-[40px] pl-2 text-[15px] lg:text-[17px] border border-neutral20"
              />
            </div>

            {/* 이메일 입력 */}
            <div tw="mb-6">
              <p tw="mb-2 text-[13px] lg:text-[14px] font-semibold">{t("auth.emailAddress")}</p>

              <div tw="flex gap-2 items-center">
                <Input
                  placeholder={t("auth.emailAddressPlaceholder")}
                  value={email}
                  onChange={(e) => {
                    const lower = e.target.value.toLowerCase()
                    setEmail(lower)
                    if (!emailTouched) setEmailTouched(true)
                  }}
                  tw="flex-1 h-[40px] pl-2 text-[15px] lg:text-[17px] border focus:(outline-none ring-0)"
                  css={[
                    emailBorderStyle,
                    emailValid && emailTouched && tw`focus:border-green-600`,
                    !emailValid && emailTouched && tw`focus:border-red-500`,
                  ]}
                />

                <Button
                  tw="h-[40px] px-4 text-[13px] lg:text-[15px]"
                  disabled={!name.trim() || !emailValid}
                  style={{ variant: "filled", color: "point" }}
                  onClick={() => {
                    if (!name.trim() || !emailValid) return
                    createEmailCode({ data: { email } })
                  }}>
                  {t("auth.sendCode")}
                </Button>
              </div>

              {emailTouched && email.length > 0 && (
                <div tw="mt-2 text-[13px] lg:text-[14px]">
                  {emailValid ? (
                    <span tw="text-green-600">{t("auth.emailValid")}</span>
                  ) : (
                    <span tw="text-red-500">{t("auth.emailError")}</span>
                  )}
                </div>
              )}
            </div>

            {/* 인증 코드 입력 */}
            <div tw="mb-6">
              <p tw="mb-2 text-[13px] lg:text-[14px] font-semibold">{t("auth.authCode")}</p>

              <div tw="flex gap-2 items-center">
                <Input
                  placeholder={t("auth.authCodePlaceholder")}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value)
                    if (!codeTouched) setCodeTouched(true)
                    if (codeError) setCodeError(false)
                  }}
                  tw="flex-1 h-[40px] pl-2 text-[15px] lg:text-[17px] border focus:(outline-none ring-0)"
                  css={[codeBorderStyle, codeError && tw`focus:border-red-500`]}
                />

                <Button
                  tw="h-[40px] px-4 text-[13px] lg:text-[15px]"
                  style={{ variant: "filled", color: "point" }}
                  onClick={() =>
                    authByEmailCode({
                      data: { email, code, name },
                    })
                  }>
                  {t("auth.authButton")}
                </Button>
              </div>

              {codeTouched && codeError && (
                <div tw="mt-2 text-[13px] lg:text-[14px] text-red-500">{t("auth.authError")}</div>
              )}
            </div>

            {/* 완료 버튼 */}
            <Button
              tw="w-full h-[40px] text-[13px] lg:text-[15px] font-normal bg-tertiaryDark border-tertiaryDark"
              style={{ variant: "filled" }}
              onClick={onClose}>
              {t("auth.authComplete")}
            </Button>
          </div>
        </div>
      </Modal>
      <SendCodeModal
        openCodeModal={sentModalOpen}
        onCloseCodeModal={() => setSentModalOpen(false)}
      />
    </>
  )
}

export default EmailAuthModal
