/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import tw from "twin.macro"
import AppMaxWidth from "../app-max-width.component"
import { Logo } from "@/design-system/components"
import { useTranslation } from "react-i18next"
import CustomLink from "@/lib/components/custom-link.component"
import { useHospitalInfoControllerFindMany } from "@/lib/orval/hospital-infos/hospital-infos"
import { HospitalInfo } from "@/lib/orval/model"
import { Language } from "@/lib/locales/i18n.config"

const Container = tw.div`flex justify-between flex-col md:flex-row gap-4`
const Row = tw.div`flex flex-col`

const normalSm = tw`font-normal text-sm`
const boldMd = tw`font-bold text-md`

const getLocalizedValue = <T extends object>(
  base: keyof T & string,
  record: T | undefined,
  lang: string,
): string => {
  if (!record) return ""

  switch (lang) {
    case "en":
      return (record as any)[`${base}EN`] || (record as any)[base]
    case "zh":
      return (record as any)[`${base}ZH`] || (record as any)[base]
    case "ja":
      return (record as any)[`${base}JA`] || (record as any)[base]
    case "th":
      return (record as any)[`${base}TH`] || (record as any)[base]
    default:
      return (record as any)[base]
  }
}

const Footer = () => {
  const { t, i18n } = useTranslation()
  const language = i18n.language as Language
  const { data: hospitalInfoData } = useHospitalInfoControllerFindMany()
  const hospitalInfo = (hospitalInfoData as unknown as HospitalInfo[])?.[0]

  return (
    <div tw="bg-point text-white">
      <AppMaxWidth tw="py-8 lg:py-14">
        <Container>
          <Row css={normalSm}>
            <div>
              <Logo tw="w-36" />
            </div>
            <div tw="mt-8 mb-4">{t("footer.title")}</div>
            <div tw="flex md:justify-between">
              <p>{t("footer.nameOfCEO")}</p>
              <p tw="px-6">{t("footer.companyNumber")}</p>
            </div>
            <div tw="flex md:justify-between mt-4">
              <p>Email : cs@xenia.clinic</p>
            </div>
            <div tw="flex md:justify-between mt-4">
              {/* <p>{t("footer.termsOfService")}</p> */}
              <CustomLink to="/termsofservice">{t("footer.termsOfService")}</CustomLink>
              <CustomLink tw="px-6" to="/privacypolicy">
                {t("footer.privacyPolicy")}
              </CustomLink>
              {/* <p tw="px-6">{t("footer.privacyPolicy")}</p> */}
            </div>
            <div tw="mt-5">{t("footer.copyright")}</div>
          </Row>
          <Row css={normalSm} tw="gap-7">
            <div>
              <div>{t("footer.contact")}</div>
              <div css={boldMd}>
                {/* {t("footer.tel")} <span tw="font-normal text-xs">({t("footer.openTime")})</span> */}
                {t("footer.tel")}
              </div>
            </div>
            <div>
              <div>{t("footer.address")}</div>
              <div css={boldMd}>
                {getLocalizedValue("buildingOneFirstAddress", hospitalInfo, language)}
              </div>
              <p>
                {getLocalizedValue("buildingOneFirstAddressDirections", hospitalInfo, language)}
              </p>
            </div>
            <div>
              <div>{t("footer.newBuildingAddress")}</div>
              <div css={boldMd}>
                {getLocalizedValue("buildingTwoAddress", hospitalInfo, language)}
              </div>
              <p>{getLocalizedValue("buildingTwoAddressDirections", hospitalInfo, language)}</p>
            </div>
            <div>
              <div>{t("footer.thirdBuildingAddress")}</div>
              <div css={boldMd}>
                {getLocalizedValue("buildingThreeAddress", hospitalInfo, language)}
              </div>
              <p>{getLocalizedValue("buildingThreeAddressDirections", hospitalInfo, language)}</p>
            </div>
          </Row>
          {/* 상담받기 버튼 나올자리 확보 */}
          <Row tw="h-12"></Row>
        </Container>
      </AppMaxWidth>
    </div>
  )
}

export default Footer
