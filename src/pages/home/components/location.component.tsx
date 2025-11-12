import React from "react"
import tw, { styled } from "twin.macro"
import GoogleMapComponent from "@/lib/components/google-map/google-map.component"

const MapSection = tw.section`
  w-full bg-neutral overflow-hidden
`

const MapInner = styled.div`
  ${tw`max-w-[1440px] mx-auto flex flex-col md:flex-row gap-2 md:gap-[40px] px-[20px] md:px-[40px] items-stretch`}
`

/* Left Column */
const InfoColumn = tw.div`
  w-full md:w-1/2 flex flex-col justify-center
  text-[15px] text-[#333] py-10 md:py-0
`

const InfoBlock = tw.div`
  flex flex-col justify-between h-full
`

const InfoTitle = tw.h3`
  text-primary text-[16px] md:text-[18px] tracking-tight font-semibold mb-1
`

const InfoText = tw.p`
  text-[14px] md:text-[16px] text-neutral70 tracking-tight leading-[150%] font-pretendard
`

/* Buttons */
const ButtonGroup = tw.div`
  flex flex-row md:flex-col gap-3 mt-6
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
  return (
    <MapSection>
      <MapInner>
        {/* Left side */}
        <InfoColumn>
          <div tw="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 진료시간 안내 */}
            <InfoBlock>
              <InfoTitle>진료시간 안내</InfoTitle>
              <InfoText>평일 : AM 10:30 ~ PM 21:00</InfoText>
              <InfoText>토요일, 공휴일 : AM 10:00 ~ PM 18:00</InfoText>
              <InfoText>점심시간 : 00:00 ~ 00:00</InfoText>
              <InfoText tw="text-[14px] text-[#666]">※ 일요일은 휴무입니다.</InfoText>

              <ButtonGroup>
                <SolidButton>시술 예약하기</SolidButton>
                <SolidButton>카카오톡 상담하기</SolidButton>
              </ButtonGroup>
            </InfoBlock>

            {/* 오시는 길 */}
            <InfoBlock>
              <InfoTitle>오시는 길</InfoTitle>
              <InfoText>서울특별시 강남구 강남대로 364,</InfoText>
              <InfoText>3층 전체 (역삼동, 미왕빌딩)</InfoText>
              <InfoText>강남역 4번 출구 앞</InfoText>

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
