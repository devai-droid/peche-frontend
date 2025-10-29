// import { Logo } from "@/design-system/components"
// import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import React from "react"
import img1 from "@/assets/images/intro/intro1.webp"
import img2 from "@/assets/images/intro/intro2.webp"
import tw from "twin.macro"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import { Trans } from "react-i18next"

const InformationContainer = tw.div`w-full flex flex-col lg:(flex-row justify-center items-center) gap-6 lg:gap-12`
const HospitalImg = tw.img`w-full lg:w-1/2 aspect-video object-cover`

const IntroHospital = () => {
  return (
    <div tw="w-full flex flex-col justify-center items-center font-nanumgothic leading-tight text-left whitespace-pre-wrap">
      {/* <div tw="h-8 md:h-16 mb-10 lg:mb-14">
        <Logo />
      </div> */}

      <InformationContainer tw="pt-12 lg:pt-16 relative gap-0">
        <div
          tw="border-t border-l border-[#cab69e] absolute top-0 right-0 h-28 left-1/4 lg:left-[40%] z-0"
          css={{ borderRadius: "100px 0 0 0" }}
        />
        <AppMaxWidth>
          <InformationContainer>
            <HospitalImg
              src={img1}
              alt="hospital1"
              tw="relative z-10 rounded-[8px_40px_8px_8px] lg:rounded-[8px_80px_8px_8px]"
            />
            <div tw="flex-1">
              <Trans
                i18nKey="intro.introduction1"
                components={{
                  bold: <strong />,
                }}
              />
            </div>
          </InformationContainer>
        </AppMaxWidth>
      </InformationContainer>

      <AppMaxWidth>
        <InformationContainer tw="mt-12 lg:mt-32 relative">
          <div tw="bg-[#F8EFE4] w-44 h-44 rounded-lg max-lg:hidden absolute left-0 bottom-0 z-0" />

          <HospitalImg
            src={img2}
            alt="hospital2"
            tw="order-1 lg:order-3  rounded-[40px_8px_8px_8px] lg:rounded-[80px_8px_8px_8px]"
          />
          <div tw="order-2 flex-1 relative z-10 lg:(flex justify-end)">
            <Trans i18nKey="intro.introduction2" />
          </div>
        </InformationContainer>
      </AppMaxWidth>
    </div>
  )
}

export default IntroHospital
