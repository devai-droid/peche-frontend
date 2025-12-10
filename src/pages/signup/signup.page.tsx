import React, { useState } from "react"
import tw, { css } from "twin.macro"
import Page from "@/lib/components/layout/page.component"
import { useTranslation } from "react-i18next"
import CartView from "@/features/product/components/cart-view.component"
import { Language } from "@/lib/locales/i18n.config"
import CustomLink from "@/lib/components/custom-link.component"
import { useNavigate } from "react-router-dom"

const Input = tw.input`w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400`
const Label = tw.label`block text-sm font-medium mb-2`
const Button = tw.button`w-full bg-[#FEE500] text-black font-semibold py-3 rounded-md hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed`
const Checkbox = tw.input`mr-2`
const Container = tw.div`max-w-md w-full mx-auto bg-white p-6 rounded-2xl shadow-md`

const Signup = () => {
  const { i18n } = useTranslation()
  const language = i18n.language as Language
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [agree, setAgree] = useState(false)

  const navigate = useNavigate()

  const handleSignup = () => {
    if (!agree) return

    // 회원가입 로직 (API 요청 등) 후 페이지 이동
    navigate("/ko/signup/complete", { state: { name } })
  }

  const Required = tw.span`text-red-500 ml-1`

  return (
    <Page hiddenFooter={false}>
      <CartView isHome>
        <div tw="flex justify-center mt-9 lg:mt-16 px-4">
          <Container>
            <h2 tw="text-xl font-semibold mb-6 text-center">회원가입</h2>

            <div>
              <Label>
                이름<Required>*</Required>
              </Label>
              <Input
                type="text"
                value={name}
                placeholder="홍길동"
                onChange={(e) => setName(e.target.value)}
              />

              <Label>
                전화번호<Required>*</Required>
              </Label>
              <Input
                type="tel"
                value={phone}
                placeholder="010-1234-5678"
                onChange={(e) => setPhone(e.target.value)}
              />
              <p tw="text-xs text-red-500 pb-4">* 필수 회원정보 입력 항목입니다.</p>

              {/* ✅ 여백 + Flex 정렬 */}
              <div tw="flex flex-wrap items-center mb-6 text-sm text-gray-700">
                <Checkbox type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
                <span>개인정보 수집 및 이용에 동의합니다.</span>
                <CustomLink
                  to="/privacypolicy"
                  css={css`
                    ${tw`ml-3 text-blue-500 underline`}
                  `}>
                  자세히 보기
                </CustomLink>
              </div>

              {language === Language.KOR && (
                <Button type="button" onClick={handleSignup} disabled={!agree || !name || !phone}>
                  회원가입
                </Button>
              )}
            </div>
          </Container>
        </div>
      </CartView>
    </Page>
  )
}

export default Signup
