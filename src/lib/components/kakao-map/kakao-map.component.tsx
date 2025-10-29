/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Language } from "@/lib/locales/i18n.config"
import { useHospitalInfoControllerFindMany } from "@/lib/orval/hospital-infos/hospital-infos"
import { HospitalInfo } from "@/lib/orval/model"

interface Kakao {
  maps: {
    LatLng: any
    Map: any
    Marker: any
    InfoWindow: any
    event: {
      addListener: (target: any, type: string, callback: () => void) => void
    }
  }
}

const location = {
  lat: 37.50173,
  lng: 127.02527,
}

const secondLocation = {
  lat: 37.50194,
  lng: 127.02475,
}

const thirdLocation = {
  lat: 37.50178,
  lng: 127.024249,
}

const { kakao } = window as unknown as { kakao: Kakao }

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

const KakaoMap = () => {
  const { t, i18n } = useTranslation()
  const language = i18n.language as Language
  const { data: hospitalInfoData } = useHospitalInfoControllerFindMany()
  const hospitalInfo = (hospitalInfoData as unknown as HospitalInfo[])?.[0]

  useEffect(() => {
    const container = document.getElementById("map")
    const options = {
      center: new kakao.maps.LatLng(location.lat, location.lng),
      level: 3,
    }

    const map = new kakao.maps.Map(container, options)

    // First marker
    const markerPosition1 = new kakao.maps.LatLng(location.lat, location.lng)
    const marker1 = new kakao.maps.Marker({ position: markerPosition1 })
    marker1.setMap(map)

    // InfoWindow for the first marker
    const infoWindow1 = new kakao.maps.InfoWindow({
      content: `
        <div style="
          padding:10px; 
          font-size:14px; 
          border-radius:5px; 
          background-color:#fff; 
          box-shadow:0px 2px 5px rgba(0,0,0,0.3); 
          max-width:200px;">
          <strong>${t("footer.address")}</strong>
          <br />
          ${getLocalizedValue("buildingOneFirstAddress", hospitalInfo, language)}
        </div>`,
    })

    // Add click event listener for the first marker
    kakao.maps.event.addListener(marker1, "click", () => {
      infoWindow1.open(map, marker1)
    })

    // Second marker
    const markerPosition2 = new kakao.maps.LatLng(secondLocation.lat, secondLocation.lng)
    const marker2 = new kakao.maps.Marker({ position: markerPosition2 })
    marker2.setMap(map)

    // InfoWindow for the second marker
    const infoWindow2 = new kakao.maps.InfoWindow({
      content: `
        <div style="
          padding:10px; 
          font-size:14px; 
          border-radius:5px; 
          background-color:#fff; 
          box-shadow:0px 2px 5px rgba(0,0,0,0.3); 
          max-width:200px;">
          <strong>${t("footer.newBuildingAddress")}</strong>
          <br />
          ${getLocalizedValue("buildingTwoAddress", hospitalInfo, language)}
        </div>`,
    })

    // Add click event listener for the second marker
    kakao.maps.event.addListener(marker2, "click", () => {
      infoWindow2.open(map, marker2)
    })

    // Third marker
    const markerPosition3 = new kakao.maps.LatLng(thirdLocation.lat, thirdLocation.lng)
    const marker3 = new kakao.maps.Marker({ position: markerPosition3 })
    marker3.setMap(map)

    // InfoWindow for the second marker
    const infoWindow3 = new kakao.maps.InfoWindow({
      content: `
        <div style="
          padding:10px; 
          font-size:14px; 
          border-radius:5px; 
          background-color:#fff; 
          box-shadow:0px 2px 5px rgba(0,0,0,0.3); 
          max-width:200px;">
          <strong>${t("footer.thirdBuildingAddress")}</strong>
          <br />
          ${getLocalizedValue("buildingThreeAddress", hospitalInfo, language)}
        </div>`,
    })

    // Add click event listener for the third marker
    kakao.maps.event.addListener(marker3, "click", () => {
      infoWindow3.open(map, marker3)
    })

    // Function to close all info windows
    const closeAllInfoWindows = () => {
      infoWindow1.close()
      infoWindow2.close()
      infoWindow3.close()
    }

    // Add a click listener to the map to close all info windows when clicking outside
    kakao.maps.event.addListener(map, "click", closeAllInfoWindows)
  }, [hospitalInfo, language])

  return <div tw="w-full h-full" id="map"></div>
}

export default KakaoMap
