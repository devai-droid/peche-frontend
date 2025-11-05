/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import { useTranslation } from "react-i18next"
import { Language } from "@/lib/locales/i18n.config"

const containerStyle = {
  width: "100%",
  height: "100%",
}

const center = {
  lat: 37.49556,
  lng: 127.0294,
}

// const getLocalizedValue = <T extends object>(
//   base: keyof T & string,
//   record: T | undefined,
//   lang: string,
// ): string => {
//   if (!record) return ""

//   switch (lang) {
//     case "en":
//       return (record as any)[`${base}EN`] || (record as any)[base]
//     case "zh":
//       return (record as any)[`${base}ZH`] || (record as any)[base]
//     case "zh-TW":
//       return (record as any)[`${base}ZHTW`] || (record as any)[base]
//     case "ja":
//       return (record as any)[`${base}JA`] || (record as any)[base]
//     case "th":
//       return (record as any)[`${base}TH`] || (record as any)[base]
//     default:
//       return (record as any)[base]
//   }
// }

function GoogleMapComponent() {
  const { i18n, t } = useTranslation()
  const language = i18n.language as Language

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC3FKUB_8Mj0-nFmyb7CP8Pe5y0FzPjqhg",
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
            address: t("footer.hospitalAddress"),
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
