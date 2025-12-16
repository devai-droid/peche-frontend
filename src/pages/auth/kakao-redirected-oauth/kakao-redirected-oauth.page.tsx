import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { OAUTH_ERROR_KEY } from "@/lib/constants/auth.constants"
import { authService } from "@/lib/service/auth.service"
import { useToken } from "@/lib/hooks/use-token"

const KakaoRedirectedOauthPage = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setToken } = useToken()
  const authCode = params.get("code") as string
  const state = params.get("state") as string
  const visit = state ? decodeURIComponent(state) : ""

  const { mutate: login } = useMutation(authService.loginWithKakao)

  useEffect(() => {
    if (authCode) {
      login(authCode, {
        onSuccess: (data) => {
          setToken(data.token)
          // navigate(`/ko/reservation/new${visit}`, { replace: true })
          const target = visit || "/ko"
          navigate(target, { replace: true })
        },
        onError: () => {
          navigate(`/login${visit}`, { replace: true })
        },
      })
    } else {
      const error = params.get("error")
      const errorDescription = params.get("error_description")
      if (error !== "access_denied") {
        localStorage.setItem(
          OAUTH_ERROR_KEY,
          JSON.stringify({ data: { message: errorDescription } }),
        )
      }
      navigate(`/login${visit}`, { replace: true })
    }
  }, [])

  return <div />
}

export default KakaoRedirectedOauthPage
