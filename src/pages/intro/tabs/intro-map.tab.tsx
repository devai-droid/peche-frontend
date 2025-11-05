/* eslint-disable @typescript-eslint/no-explicit-any */
import KakaoMap from "@/lib/components/kakao-map/kakao-map.component"
import GoogleMapComponent from "@/lib/components/google-map/google-map.component"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import { useTranslation } from "react-i18next"
import { Language } from "@/lib/locales/i18n.config"
import { useHospitalInfoControllerFindMany } from "@/lib/orval/hospital-infos/hospital-infos"
import { HospitalInfo } from "@/lib/orval/model"

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

const IntroMap = () => {
  const { t, i18n } = useTranslation()
  const language = i18n.language as Language
  const { data: hospitalInfoData } = useHospitalInfoControllerFindMany()
  const hospitalInfo = (hospitalInfoData as unknown as HospitalInfo[])?.[0]

  return (
    <AppMaxWidth>
      <div tw="mx-auto max-w-3xl">
        <div tw="aspect-video">
          {/* 여기서 언어에 따라 지도 다르게 보여주고. 구글맵일 경우 구글맵 언어를 prop으로 넘겨주기? */}
          <GoogleMapComponent />
        </div>
        <div tw="mt-6 bg-[#f8efe4] rounded-lg min-h-[3.5rem] font-nanumgothic text-black flex items-center justify-center p-2">
          <div tw="flex flex-col items-center gap-2">
            <div>
              <strong>{t("home.location")}</strong>:{" "}
              {getLocalizedValue("buildingOneFirstAddress", hospitalInfo, language)}
            </div>
            <div>
              <strong>{t("home.newLocation")}</strong>:{" "}
              {getLocalizedValue("buildingTwoAddress", hospitalInfo, language)}
            </div>
            <div>
              <strong>{t("home.thirdLocation")}</strong>:{" "}
              {getLocalizedValue("buildingThreeAddress", hospitalInfo, language)}
            </div>
          </div>
        </div>
      </div>
    </AppMaxWidth>
  )
}

export default IntroMap
