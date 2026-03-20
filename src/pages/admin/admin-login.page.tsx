import React, { useState } from "react"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useToken } from "@/lib/hooks/use-token"
import axiosClient from "@/lib/api/http-client"
import type { AxiosResponse } from "axios"
import tw, { css } from "twin.macro"

const inputStyle = tw`
  w-full border border-neutral30 px-4 py-3
  text-[14px] lg:text-[15px] font-pretendard
  outline-none focus:border-[#DA7F67]
  transition-colors duration-200
`

const AdminLogin = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { setToken } = useToken()
  const lang = i18n.language

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res: AxiosResponse<string> = await axiosClient.post("/api/admin-auth/login", {
        email,
        password,
      })
      const token = res.data
      if (token) {
        setToken(token)
        navigate(`/${lang}/blog`)
      } else {
        setError(t("admin.loginError"))
      }
    } catch {
      setError(t("admin.loginError"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Page hiddenFooter={false} bottomCartExists={false}>
      <div tw="bg-white min-h-screen font-pretendard tracking-tight leading-[150%]">
        <AppMaxWidth>
          <div tw="pt-[80px] lg:pt-[120px] pb-16 max-w-[400px] mx-auto">
            <h1 tw="text-[24px] lg:text-[30px] font-semibold text-neutralBlack mb-8 text-center">
              {t("admin.login")}
            </h1>

            <form onSubmit={handleSubmit} tw="flex flex-col gap-4">
              <div>
                <label tw="text-[14px] font-semibold text-neutralBlack mb-1 block">
                  {t("admin.email")}
                </label>
                <input
                  type="email"
                  css={[inputStyle]}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pecheskin.clinic"
                  required
                />
              </div>

              <div>
                <label tw="text-[14px] font-semibold text-neutralBlack mb-1 block">
                  {t("admin.password")}
                </label>
                <input
                  type="password"
                  css={[inputStyle]}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div tw="text-[13px] text-red-500 text-center">{error}</div>}

              <button
                type="submit"
                disabled={isLoading}
                tw="
                  w-full py-3 text-[15px] text-white font-medium
                  transition-colors duration-200
                  disabled:opacity-50
                "
                css={[
                  css`
                    background-color: #da7f67;
                    &:hover {
                      background-color: #bd7b60;
                    }
                  `,
                ]}>
                {isLoading ? "..." : t("admin.loginButton")}
              </button>
            </form>
          </div>
        </AppMaxWidth>
      </div>
    </Page>
  )
}

export default AdminLogin
