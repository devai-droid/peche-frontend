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
  flex flex-col justify-between h-full font-pretendard
`

const InfoTitle = tw.h3`
  text-primary text-[16px] md:text-[18px] tracking-tight font-semibold mb-2 md:mb-3
`

const InfoText = tw.p`
  text-[14px] md:text-[16px] text-neutral70 tracking-tight leading-[150%] font-pretendard
`

/* Buttons */
const ButtonGroup = tw.div`
  flex flex-row md:flex-col gap-3 mt-3
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

const Location = () => {
  const tv = useLanguageValue()
  const { t, i18n } = useTranslation()

  return (
    <MapSection>
      <MapInner>
        {/* Left side */}
        <InfoColumn>
          <div tw="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 진료시간 안내 */}
            <InfoBlock>
              <InfoTitle>{t("location.hours")}</InfoTitle>
              <InfoText>평일 : AM 10:30 ~ PM 21:00</InfoText>
              <InfoText>주말·공휴일 : AM 10:00 ~ PM 18:00</InfoText>
              <InfoText tw="text-primary">※ 점심시간 없이 연중무휴 진료합니다.</InfoText>

              <ButtonGroup>
                <SolidButton>시술 예약하기</SolidButton>
                <SolidButton>카카오톡 상담하기</SolidButton>
              </ButtonGroup>
            </InfoBlock>

            {/* 오시는 길 */}
            <InfoBlock>
              <InfoTitle>{t("location.directions")}</InfoTitle>
              <InfoText>서울특별시 강남구 강남대로 364,</InfoText>
              <InfoText>3층 전체 (역삼동, 미왕빌딩)</InfoText>
              <InfoText tw="text-primary">※ 강남역 4번 출구 앞</InfoText>

              <ButtonGroup>
                <OutlineButton>네이버 플레이스 보기</OutlineButton>
                <OutlineButton>카카오 지도 보기</OutlineButton>
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
