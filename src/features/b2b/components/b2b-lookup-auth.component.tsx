import React from "react"
import tw from "twin.macro"
import { useQueryClient } from "@tanstack/react-query"
import { Button, Input, toast } from "@/design-system/components"
import { ToastType } from "@/design-system/components/toast/toast.component.type"
import { useToken } from "@/lib/hooks/use-token"
import { userKeys } from "@/lib/constants/query-keys/user.query-key"
import { b2bApi, b2bErrorMessage } from "@/features/b2b/b2b.api"

const Label = tw.p`mb-2 text-[13px] lg:text-[14px] font-semibold`
const Field = tw(Input)`w-full h-[40px] pl-2 text-[15px] lg:text-[16px] border border-neutral20`

const RESEND_WAIT_SECONDS = 60
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

/**
 * B2B 사이트 예약확인 진입 인증: 회사 이메일 → 인증번호 → 30분 동안 본인 예약 조회·변경·취소.
 * 성공하면 받은 토큰을 사이트 로그인 토큰으로 넣어 공식 사이트와 같은 예약확인 화면을 그대로 쓴다.
 */
const B2bLookupAuth = () => {
  const queryClient = useQueryClient()
  const { setToken } = useToken()

  const [email, setEmail] = React.useState("")
  const [code, setCode] = React.useState("")
  const [codeSent, setCodeSent] = React.useState(false)
  const [sending, setSending] = React.useState(false)
  const [verifying, setVerifying] = React.useState(false)
  const [resendLeft, setResendLeft] = React.useState(0)

  React.useEffect(() => {
    if (resendLeft <= 0) return undefined
    const timer = setTimeout(() => setResendLeft((left) => left - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendLeft])

  const requestCode = async () => {
    if (!isValidEmail(email) || sending || resendLeft > 0) return
    setSending(true)
    try {
      await b2bApi.requestLookupCode({ email: email.trim() })
      setCodeSent(true)
      setResendLeft(RESEND_WAIT_SECONDS)
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
      const result = await b2bApi.verifyLookup({ email: email.trim(), code: code.trim() })
      setToken(result.token)
      await queryClient.invalidateQueries({ queryKey: userKeys.me })
    } catch (e) {
      toast({
        type: ToastType.Warning,
        message: b2bErrorMessage(e, "인증번호가 올바르지 않습니다."),
      })
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div tw="w-full max-w-[420px] mx-auto font-pretendard tracking-tight leading-[150%] text-[13px] lg:text-[15px]">

      <div tw="flex flex-col gap-4">
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
              disabled={!isValidEmail(email) || sending || resendLeft > 0}
              style={{ variant: "filled", color: "point" }}
              onClick={requestCode}>
              {codeSent ? "재발송" : "인증번호 받기"}
            </Button>
          </div>
          {resendLeft > 0 && (
            <div tw="mt-1.5 text-[12px] lg:text-[13px] text-neutral60">
              인증번호는 60초에 한 번 요청할 수 있습니다.{" "}
              <span tw="text-primary font-semibold">{resendLeft}초</span> 후 재발송할 수 있습니다.
            </div>
          )}
        </div>

        {codeSent && (
          <div>
            <Label>인증번호</Label>
            <div tw="flex gap-2 items-center">
              <Field
                tw="flex-1 min-w-0"
                placeholder="인증번호를 입력해주세요."
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Button
                tw="h-[40px] px-4 text-[13px] lg:text-[15px] whitespace-nowrap"
                disabled={!code.trim() || verifying}
                style={{ variant: "filled", color: "point" }}
                onClick={verify}>
                확인
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default B2bLookupAuth
