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

export default function App() {
  const { t } = useTranslation()

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
