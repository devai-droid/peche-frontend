import React from "react"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"

import bannerImg from "@/assets/images/products-banner.jpg"
import mobileBannerImg from "@/assets/images/products-mobile-banner.jpg"
import useResponsive from "@/lib/hooks/use-responsive"

const Blog = () => {
  const { isMobile } = useResponsive()

  return (
    <Page hiddenFooter={false} bottomCartExists={false}>
      <div tw="w-screen overflow-hidden relative">
        <img
          src={isMobile ? mobileBannerImg : bannerImg}
          alt="banner"
          tw="w-full max-h-[310px] h-[310px] object-cover block"
        />
        <div
          tw="
      absolute top-1/2 left-1/2 
      -translate-x-1/2 -translate-y-1/2 
      text-center text-neutralBlack
    ">
          <div tw="text-[39px] lg:text-[50px] font-time font-normal tracking-tight">Blog</div>
          <div tw="text-[18px] lg:text-[22px] font-pretendard text-center">블로그</div>
        </div>
      </div>

      <div tw="bg-white min-h-screen font-pretendard tracking-tight leading-[150%]">
        <AppMaxWidth tw="max-lg:p-0">
          <div tw="flex justify-center mt-[64px] lg:mt-[160px] mb-4 lg:mb-8 max-lg:p-4 text-[24px] lg:text-[30px]">
            서비스 준비 중입니다.
          </div>
        </AppMaxWidth>
      </div>
    </Page>
  )
}

export default Blog
