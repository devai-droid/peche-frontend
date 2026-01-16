import React from "react"
import Page from "@/lib/components/layout/page.component"
import CartView from "@/features/product/components/cart-view.component"
import CustomLink from "@/lib/components/custom-link.component"
import { useLocation } from "react-router-dom"

const SignupComplete = () => {
  const location = useLocation()
  const name = location.state?.name || "회원"

  return (
    <Page hiddenFooter={false}>
      <CartView isHome>
        <div tw="flex justify-center mt-12 lg:mt-20 px-4">
          <div tw="max-w-md w-full mx-auto bg-white p-8 rounded-2xl shadow-md text-center">
            <h2 tw="text-2xl font-semibold mb-4">회원가입 완료</h2>
            <p tw="text-gray-700 mb-6 leading-relaxed">
              <span tw="text-yellow-600 font-semibold">{name}</span>님, 회원가입이 완료되었습니다.{" "}
              <br />
              아래 <span tw="font-semibold">홈으로 이동</span> 버튼을 클릭하여 홈페이지를
              이용해주세요.
              <br />
              문의사항이 있으실 경우 02-553-8176 로 연락주세요.
            </p>

            <CustomLink to="/">
              <button tw="w-full bg-[#FEE500] text-black font-semibold py-3 rounded-md hover:bg-yellow-300 transition">
                홈으로 이동
              </button>
            </CustomLink>
          </div>
        </div>
      </CartView>
    </Page>
  )
}

export default SignupComplete
