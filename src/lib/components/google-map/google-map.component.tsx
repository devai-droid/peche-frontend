/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import { useTranslation } from "react-i18next"
import { Language } from "@/lib/locales/i18n.config"
import { useHospitalInfoControllerFindMany } from "@/lib/orval/hospital-infos/hospital-infos"
import { HospitalInfo } from "@/lib/orval/model"

const containerStyle = {
  width: "100%",
  height: "100%",
}

const center = {
  lat: 37.50178909301758,
  lng: 127.02523803710938,
}

const secondMarkerPosition = {
  lat: 37.50194558942308,
  lng: 127.02475356660678,
}

const thirdMarkerPosition = {
  lat: 37.501778430417126,
  lng: 127.02425374665002,
}

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

function GoogleMapComponent() {
  const { i18n, t } = useTranslation()
  const language = i18n.language as Language
  const { data: hospitalInfoData } = useHospitalInfoControllerFindMany()
  const hospitalInfo = (hospitalInfoData as unknown as HospitalInfo[])?.[0]

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCnwITjv4eAtku7my1KwCdFsh9Q4Upn2ZA",
    language: "en",
  })

  const [map, setMap] = React.useState(null)
  const [selectedMarker, setSelectedMarker] = useState<null | {
    position: { lat: number; lng: number }
    building: string
    address: string
  }>(null)

  const onLoad = React.useCallback((map: any) => {
    setMap(map)
  }, [])

  const onUnmount = React.useCallback((map: any) => {
    setMap(null)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={17}
      onLoad={onLoad}
      onUnmount={onUnmount}>
      <Marker
        position={center}
        onClick={() =>
          setSelectedMarker({
            position: center,
            building: t("footer.address"),
            address: getLocalizedValue("buildingOneFirstAddress", hospitalInfo, language),
          })
        }
      />
      <Marker
        position={secondMarkerPosition}
        onClick={() =>
          setSelectedMarker({
            position: secondMarkerPosition,
            building: t("footer.newBuildingAddress"),
            address: getLocalizedValue("buildingTwoAddress", hospitalInfo, language),
          })
        }
      />
      <Marker
        position={thirdMarkerPosition}
        onClick={() =>
          setSelectedMarker({
            position: thirdMarkerPosition,
            building: t("footer.thirdBuildingAddress"),
            address: getLocalizedValue("buildingThreeAddress", hospitalInfo, language),
          })
        }
      />
      {/* InfoWindow */}
      {selectedMarker && (
        <InfoWindow
          position={selectedMarker.position}
          onCloseClick={() => setSelectedMarker(null)} // Close InfoWindow on close click
        >
          <div>
            <h4>{selectedMarker.building}</h4>
            <p>{selectedMarker.address}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : (
    <></>
  )
}

export default React.memo(GoogleMapComponent)
