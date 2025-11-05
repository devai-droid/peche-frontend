/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Language } from "@/lib/locales/i18n.config"

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
  lat: 37.49556,
  lng: 127.0294,
}

const { kakao } = window as unknown as { kakao: Kakao }

const KakaoMap = () => {
  const { t, i18n } = useTranslation()
  const language = i18n.language as Language

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
          ${t("footer.hospitalAddress")}
        </div>`,
    })

    // Add click event listener for the first marker
    kakao.maps.event.addListener(marker1, "click", () => {
      infoWindow1.open(map, marker1)
    })

    // Function to close all info windows
    const closeAllInfoWindows = () => {
      infoWindow1.close()
    }

    // Add a click listener to the map to close all info windows when clicking outside
    kakao.maps.event.addListener(map, "click", closeAllInfoWindows)
  }, [language])

  return <div tw="w-full h-full" id="map"></div>
}

export default KakaoMap
