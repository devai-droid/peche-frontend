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

          // Safari ITP / 모바일 Chrome: 크로스 도메인 리다이렉트 후 localStorage가 초기화될 수 있음
          // 카카오 인증 전에 Cookie에 백업한 장바구니 데이터를 localStorage로 복원
          // 새 slim 포맷: { items: [...], cl, inq, im, dt, td }
          const cm = document.cookie.match(/(?:^|; )__cart_backup=([^;]*)/)
          if (cm) {
            try {
              const b = JSON.parse(decodeURIComponent(cm[1]))
              // slim 포맷 (items 키가 있으면 새 포맷)
              if (b.items) {
                const cart = b.items.map((s: { e?: object; p?: object; c: number }) => ({
                  event: s.e || undefined,
                  product: s.p || undefined,
                  count: s.c,
                }))
                localStorage.setItem("cart", JSON.stringify(cart))
                if (b.cl) {
                  localStorage.setItem("checkedList", JSON.stringify(b.cl))
                }
                if (b.inq !== undefined) {
                  localStorage.setItem("inquiry", JSON.stringify(b.inq))
                }
                if (b.im) {
                  localStorage.setItem("inquiryMemo", JSON.stringify(b.im))
                }
                if (b.dt) {
                  localStorage.setItem("reservation:selectedDatetime", b.dt)
                }
                if (b.td) {
                  localStorage.setItem("reservation:today", b.td)
                }
              }
              const domain = window.location.hostname.replace(/^www\./, "")
              document.cookie = `__cart_backup=;path=/;max-age=0;domain=.${domain}`
            } catch (e) {
              console.warn("[cart] cookie restore failed", e)
            }
          }

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
