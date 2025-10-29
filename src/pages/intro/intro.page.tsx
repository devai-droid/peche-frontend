import React from "react"
import tw from "twin.macro"
import Page from "@/lib/components/layout/page.component"
import { useTranslation } from "react-i18next"
import { Outlet, useLocation } from "react-router-dom"
import CustomLink from "@/lib/components/custom-link.component"

const item = tw`w-full font-bold font-nanumgothic text-center h-14 flex items-center justify-center border-l border-[#EBECEF] border-b -ml-px -mb-px`

// [TODO] XEN-66 소개 페이지 API 연결
// tabs 폴더 확인

const Intro = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const links = [
    {
      title: t("intro.introHospital"),
      href: "/intro",
    },
    // {
    //   title: t("intro.introDoctor"),
    //   href: "/intro/doctor",
    // },
    // {
    //   title: t("intro.introWorker"),
    //   href: "/intro/worker",
    // },
    {
      title: t("intro.introMachine"),
      href: "/intro/machine",
    },
    {
      title: t("intro.wayToCome"),
      href: "/intro/way",
    },
  ]

  return (
    <Page hiddenFooter={false}>
      <div tw="flex justify-center mt-9 lg:mt-16 px-4">
        <div tw="grid justify-center border border-[#EBECEF] grid-cols-3 lg:(grid-cols-3 lg:max-w-[calc(12rem*5)]) w-full">
          {links.map((link, index) => (
            <CustomLink
              key={index}
              to={link.href}
              css={[
                item,
                location.pathname === link.href ? tw`text-white bg-point` : tw`text-black`,
              ]}>
              <div>{link.title}</div>
            </CustomLink>
          ))}
          {/* <div tw="lg:hidden" css={item} /> */}
        </div>
      </div>

      <div tw="mt-10 lg:mt-16 mb-20 lg:mb-36">
        <Outlet />
      </div>
    </Page>
  )
}

export default Intro
