import React from "react"
import tw, { styled } from "twin.macro"
import GoogleMapComponent from "@/lib/components/google-map/google-map.component"
import useLanguageValue from "@/lib/hooks/use-language-key"
import { useTranslation } from "react-i18next"

const MapSection = tw.section`
  w-full bg-neutral overflow-hidden
`

const MapInner = styled.div`
  ${tw`max-w-[1440px] mx-auto flex flex-col md:flex-row gap-2 md:gap-[40px] px-[20px] md:px-[40px] items-stretch`}
`

/* Left Column */
const InfoColumn = tw.div`
  w-full md:w-1/2 flex flex-col justify-center
  py-10 md:py-0
`

const InfoBlock = tw.div`
  flex flex-col h-full font-pretendard
`

const InfoTitle = tw.h3`
  text-primary text-[16px] md:text-[18px] tracking-tight font-semibold mb-2 md:mb-3
`

const InfoText = tw.p`
  text-[14px] md:text-[16px] text-neutral70 tracking-tight leading-[150%] font-pretendard
`

/* Buttons */
const ButtonGroup = tw.div`
  flex flex-row md:flex-col gap-3 mt-auto
`

const SolidButton = tw.button`
  flex-1 bg-primary text-white py-2 md:py-2 text-[15px] font-medium hover:opacity-90 transition
`

const OutlineButton = tw.button`
  flex-1 border border-primary bg-white text-primary py-2 md:py-2 text-[15px] font-medium hover:bg-primary/10 transition
`

/* Right Column (Map) */
const MapColumn = tw.div`
  w-full md:w-1/2 h-[400px] md:h-[480px] flex
`

const GoogleMapWrapper = tw.div`
  w-full h-full
`

const InfoTextWrapper = tw.div`
  flex flex-col
  justify-start
  lg:min-h-[140px]
  md:min-h-[200px]
  min-h-[120px]
`

const Location = () => {
  const tv = useLanguageValue()
  const { t } = useTranslation()

  return (
    <MapSection>
      <MapInner>
        {/* Left side */}
        <InfoColumn>
          <div tw="grid grid-cols-1 md:grid-cols-2 gap-6 md:auto-rows-fr">
            {/* 진료시간 안내 */}
            <InfoBlock>
              <InfoTextWrapper>
                <InfoTitle>{t("location.hours")}</InfoTitle>
                <InfoText>{t("location.weekdayHours")}</InfoText>
                <InfoText>{t("location.weekendHours")}</InfoText>
                <InfoText tw="text-primary">{t("location.lunch")}</InfoText>
              </InfoTextWrapper>

              <ButtonGroup tw="mt-[1px]">
                <SolidButton>{t("location.leftButton1")}</SolidButton>
                <SolidButton>{t("location.leftButton2")}</SolidButton>
              </ButtonGroup>
            </InfoBlock>

            <InfoBlock>
              <InfoTextWrapper>
                <InfoTitle>{t("location.directions")}</InfoTitle>
                <InfoText>{t("location.address1")}</InfoText>
                <InfoText>{t("location.address2")}</InfoText>
                <InfoText tw="text-primary">{t("location.subway")}</InfoText>
              </InfoTextWrapper>

              <ButtonGroup>
                <OutlineButton>{t("location.rightButton1")}</OutlineButton>
                <OutlineButton>{t("location.rightButton2")}</OutlineButton>
              </ButtonGroup>
            </InfoBlock>
          </div>
        </InfoColumn>

        {/* Right side */}
        <MapColumn>
          <GoogleMapWrapper>
            <GoogleMapComponent />
          </GoogleMapWrapper>
        </MapColumn>
      </MapInner>
    </MapSection>
  )
}

export default Location
