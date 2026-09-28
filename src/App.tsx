import React from "react"
import { RouterProvider } from "react-router-dom"
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { AxiosError } from "axios"

import { Toast, toast } from "./design-system/components"
import { ToastType } from "./design-system/components/toast/toast.component.type"
import { CssBaseline } from "@mui/material"
import router from "./routers/routes"
import { useTranslation } from "react-i18next"
import { reloadIfNewVersion } from "./lib/utils/version-check.util"

export default function App() {
  const { t } = useTranslation()

  // 사이트 전체에서 새 배포를 자동 반영: 탭 복귀 시 + 주기적으로(5분) 최신 배포면 자동 새로고침.
  // 장바구니·선택시간 등은 localStorage라 유지됨. 새 버전이 아니면 아무 일 없음.
  React.useEffect(() => {
    reloadIfNewVersion() // 앱 시작 직후 1회
    const onVisible = () => {
      if (document.visibilityState === "visible") reloadIfNewVersion()
    }
    document.addEventListener("visibilitychange", onVisible)
    // 켜둔 채로 있어도(활성 탭 포함) 새 배포가 나가면 5분 내 자동 갱신
    const timer = window.setInterval(() => reloadIfNewVersion(), 5 * 60 * 1000)
    return () => {
      document.removeEventListener("visibilitychange", onVisible)
      window.clearInterval(timer)
    }
  }, [])

  const mutationCache = new MutationCache({
    onError: (error, _value, _context, mutation) => {
      if (mutation.options.onError) {
        return
      }

      const { message, response } = error as AxiosError
      const { message: responseMessage } = response?.data as { message: string }

      const finalMessage = (responseMessage || message).includes("Event is not available")
        ? t("error.eventNotAvailable")
        : `${responseMessage || message}`

      toast({
        title: "Error",
        message: finalMessage,
        type: ToastType.Highlight,
      })
    },
  })
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        mutationCache,
        defaultOptions: {
          queries: {
            retry: false,
            onError: (error) => {
              // 404(리소스 없음)는 각 페이지가 not-found 화면으로 처리 → 놀라운 에러 토스트는 띄우지 않음
              // (예: 특정 언어로 미번역된 블로그 글, 삭제된 상세페이지)
              if ((error as AxiosError)?.response?.status === 404) {
                return
              }

              const { message } = error as unknown as { message: string }

              // Check if the message contains '401'
              const errorMessage = message.includes("401")
                ? `${t("error.verificationNeeded")}` // Append localized 'hello there' if '401' is found
                : message // Otherwise, show the original message
              toast({
                title: "Network Error",
                message: errorMessage,
                type: ToastType.Highlight,
              })
            },
          },
        },
      }),
  )
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
      <CssBaseline />
      <Toast />
    </QueryClientProvider>
  )
}
