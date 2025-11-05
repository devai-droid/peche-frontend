/* eslint-disable @typescript-eslint/no-explicit-any */
import tw from "twin.macro"
import { useTranslation } from "react-i18next"
import { Language } from "@/lib/locales/i18n.config"
import KakaoMap from "@/lib/components/kakao-map/kakao-map.component"
import GoogleMapComponent from "@/lib/components/google-map/google-map.component"
import { useHospitalInfoControllerFindMany } from "@/lib/orval/hospital-infos/hospital-infos"
import { HospitalInfo } from "@/lib/orval/model"

const tag = tw`min-w-[6rem] w-fit rounded-full bg-[#5b5f6b] bg-opacity-30 px-2.5 leading-9 mb-2 text-center`

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

const Location = () => {
  const { t, i18n } = useTranslation()
  const language = i18n.language as Language
  const { data: hospitalInfoData } = useHospitalInfoControllerFindMany()
  const hospitalInfo = (hospitalInfoData as unknown as HospitalInfo[])?.[0]
  return (
    <div tw="max-lg:px-4 flex flex-col lg:flex-row font-nanumgothic">
      <div tw="flex-1 max-lg:(aspect-square max-h-[50vh]) lg:min-w-[50%]">
        <GoogleMapComponent />
      </div>
      <div tw="w-full overflow-hidden bg-[#2F323B] text-white px-4 py-8 lg:(px-16 pt-20 pb-36 gap-12) gap-5 flex flex-col">
        <h5 tw="font-bold text-xl">{t("home.hospitalName")}</h5>
        <div>
          <p css={tag}>{t("home.location")}</p>
          <p tw="mb-3">{getLocalizedValue("buildingOneFirstAddress", hospitalInfo, language)}</p>
          <p>{getLocalizedValue("buildingOneFirstAddressDirections", hospitalInfo, language)}</p>
        </div>
        <div>
          <p css={tag}>{t("home.newLocation")}</p>
          <p tw="mb-3">{getLocalizedValue("buildingTwoAddress", hospitalInfo, language)}</p>
          <p>{getLocalizedValue("buildingTwoAddressDirections", hospitalInfo, language)}</p>
        </div>
        <div>
          <p css={tag}>{t("home.thirdLocation")}</p>
          <p tw="mb-3">{getLocalizedValue("buildingThreeAddress", hospitalInfo, language)}</p>
          <p>{getLocalizedValue("buildingThreeAddressDirections", hospitalInfo, language)}</p>
        </div>
        <div>
          <p css={tag}>{t("home.parking")}</p>
          <p tw="whitespace-pre-wrap">{getLocalizedValue("parkingInfo", hospitalInfo, language)}</p>
        </div>
        <div>
          <p css={tag}>{t("home.openTime")}</p>
          <div>
            <p>
              <span tw="inline-block w-20">{t("home.monday")}</span>{" "}
              <span>{hospitalInfo?.mondayHours}</span>{" "}
              {/* <span tw="max-xl:(block ml-20)">({t("home.workDayLastReservation")})</span> */}
            </p>
            <p>
              <span tw="inline-block w-20">{t("home.tuesday")}</span>{" "}
              <span>{hospitalInfo?.tuesdayHours}</span>{" "}
            </p>
            <p>
              <span tw="inline-block w-20">{t("home.wednesday")}</span>{" "}
              <span>{hospitalInfo?.wednesdayHours}</span>{" "}
            </p>
            <p>
              <span tw="inline-block w-20">{t("home.thursday")}</span>{" "}
              <span>{hospitalInfo?.thursdayHours}</span>{" "}
            </p>
            <p>
              <span tw="inline-block w-20">{t("home.friday")}</span>{" "}
              <span>{hospitalInfo?.fridayHours}</span>{" "}
            </p>
            <p tw="max-xl:mt-2">
              <span tw="inline-block w-20">{t("home.saturday")}</span>{" "}
              <span>{hospitalInfo?.saturdayHours}</span>{" "}
              {/* <span tw="max-xl:(block ml-20)">({t("home.saturdayLastReservation")})</span> */}
            </p>
          </div>
          <p tw="max-xl:mt-2 whitespace-pre">{t("home.openTimeDescription")}</p>
        </div>
      </div>
    </div>
  )
}

export default Location
