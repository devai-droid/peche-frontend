/* eslint-disable no-param-reassign */
import React from "react"
import tw, { styled } from "twin.macro"
import Page from "@/lib/components/layout/page.component"
import KakaoMap from "@/lib/components/kakao-map/kakao-map.component"
import GoogleMapComponent from "@/lib/components/google-map/google-map.component"
import CartView from "@/features/product/components/cart-view.component"

// 이미지 import
import modelImg from "@/assets/images/intro-model.jpg"
import peche1 from "@/assets/images/peche1-expand.jpg"
import peche2 from "@/assets/images/peche2-expand.jpg"
import peche3 from "@/assets/images/peche3-expand.jpg"
import peche1Mobile from "@/assets/images/peche1-mobile.jpg"
import peche2Mobile from "@/assets/images/peche2-mobile.jpg"
import peche3Mobile from "@/assets/images/peche3-mobile.jpg"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"

import beauty from "@/assets/images/beauty.png"
import trust from "@/assets/images/trust.png"
import transparency from "@/assets/images/transparency.png"
import { GrayPlusIcon } from "@/assets/icon"
import interior1 from "@/assets/images/interior1.png"
import interior2 from "@/assets/images/interior2.png"
import interior3 from "@/assets/images/interior3.png"
import interior4 from "@/assets/images/interior4.png"
import trustPic1 from "@/assets/images/trust-pic1.jpg"
import trustPic2 from "@/assets/images/trust-pic2.jpg"
import trustPic3 from "@/assets/images/trust-pic3.jpg"
import trustPic4 from "@/assets/images/trust-pic4.jpg"
import person1 from "@/assets/images/person1.png"
import person2 from "@/assets/images/person2.png"
import person3 from "@/assets/images/person3.png"
import person4 from "@/assets/images/person4.png"
import person5 from "@/assets/images/person5.png"
import person6 from "@/assets/images/person6.png"
import person7 from "@/assets/images/person7.png"
import person8 from "@/assets/images/person8.png"

const PageContainer = tw.div`w-full flex flex-col items-center bg-white`

/* 2️⃣ TRUST Section */
const SectionTrust = tw.section`
  w-full bg-white text-neutralBlack pt-32 md:pt-20 pb-16 md:py-32
`

const TrustInner = tw.div`
  max-w-[1440px] mx-auto px-6 md:px-10
  flex flex-col lg:flex-row justify-between
  gap-8 lg:gap-20 xl:gap-28
`

// 왼쪽 전체 텍스트 블록
const TrustTextBlock = tw.div`
  w-full lg:w-1/2 flex flex-col 
  justify-center
  lg:h-[520px]
`

const TrustHeadingBlock = tw.div`
  flex items-start
`

const TrustHeading = styled.h2`
  ${tw`text-[32px] md:text-[40px] font-semibold leading-[1.4] font-pretendard tracking-tight`}
  span {
    ${tw`text-primary font-time font-normal tracking-tight`}
  }
`

// 작은 글씨 섹션
const TrustParagraphBlock = tw.div`
  mt-4
`

const TrustParagraph = tw.p`
  text-[16px] md:text-[18px] leading-[1.5] text-neutral70 tracking-tight
  font-pretendard whitespace-pre-line
`

const TrustImage = styled.img`
  ${tw`
    w-full lg:w-[550px] xl:w-[704px]
    h-[280px] md:h-[420px] lg:h-[500px] xl:h-[520px]
    object-cover rounded-none
    lg:ml-auto
  `}
`

/* ──────────────────────────────
 * 3️⃣ SYMBOL × TRUST Section
 * ────────────────────────────── */
const HoverGrid = styled.div`
  ${tw`w-full flex overflow-hidden gap-2`}
  height: 438px;
  max-width: 1200px;

  @media (max-width: 767px) {
    ${tw`hidden`}
  }

  /* Hover가 아닐 때 — 기본 상태 */
  &:not(:hover) .item-0 {
    flex: 2;
  }

  &:not(:hover) .item-1,
  &:not(:hover) .item-2 {
    flex: 1;
  }
`

const HoverItem = styled.div`
  ${tw`relative overflow-hidden`}
  flex: 1;
  transition: flex 0.4s ease;

  &:hover {
    flex: 2;
  }

  img {
    ${tw`w-full h-full object-cover`}
    transition: transform 0.4s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  /* 텍스트 오버레이 */
  .label {
    position: absolute;
    bottom: 20px;
    right: 20px;
    text-align: right;
    color: #da7f67;
    opacity: 0;
    transition: opacity 0.3s ease;

    p:first-child {
      font-size: 30px;
      font-weight: 400;
    }

    p:last-child {
      margin-top: 6px;
      font-size: 22px;
      font-weight: 500;
    }
  }

  /* hover 시 보여줌 */
  &:hover .label {
    opacity: 1;
  }
`

const desktopImages = [
  { src: peche1, title: "Pêche", desc: "생기있는 코랄빛" },
  { src: peche2, title: "Pêche", desc: "영원한 젊음" },
  { src: peche3, title: "Pêche", desc: "밝고 부드러운 속살" },
]

const mobileImages = [
  { src: peche1Mobile, title: "Pêche", desc: "생기있는 코랄빛" },
  { src: peche2Mobile, title: "Pêche", desc: "영원한 젊음" },
  { src: peche3Mobile, title: "Pêche", desc: "밝고 부드러운 속살" },
]

const MobileSwiperWrapper = styled.div`
  ${tw`w-full block md:hidden`}
`

const StyledSwiperSlide = styled(SwiperSlide)`
  width: 240px !important;
  display: flex;
  justify-content: center;
`

const MobileSlide = styled.div`
  ${tw`relative w-full flex justify-center items-center tracking-tight leading-[150%]`}

  /* 이미지 컨테이너 */
  .img-wrapper {
    position: relative;
    width: 240px;
    height: auto;
  }

  img {
    width: 240px;
    height: auto;
    object-fit: cover;
    display: block;
  }

  /* 이미지 위 오버레이 텍스트 */
  .label {
    position: absolute;
    bottom: 12px;
    right: 12px;
    text-align: right;
    color: #da7f67;
  }

  .label p:first-child {
    font-size: 24px;
    font-weight: 400;
  }

  .label p:last-child {
    font-size: 16px;
    font-weight: 500;
    margin-top: 8px;
  }
`

const SectionSymbolTrust = tw.section`
  w-full bg-[#FFF7EE] py-20 md:py-24
`
const SymbolInner = tw.div`
  max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col items-center
`

const SymbolTitle = tw.h3`
  text-center text-primary text-[18px] md:text-[22px] tracking-[0.1em] mb-3 font-medium tracking-tight
`
const SymbolSubTitle = tw.h2`
  text-center text-neutralBlack text-[24px] md:text-[30px] font-bold mb-4 tracking-tight
`
const SymbolDesc = tw.p`
  text-center text-neutral70 text-[14px] md:text-[16px] leading-[1.5] mb-10 max-w-[700px] tracking-tight
`

/* Core Value */
const CoreValueContainer = tw.div`
  w-full bg-white rounded-none mt-20 py-14 flex flex-col items-center
`
const CoreTitle = tw.h3`
  text-center text-[18px] md:text-[22px] font-medium text-neutralBlack mb-12 font-time tracking-tight
`
const Highlight = tw.span`text-primary ml-2 font-medium font-pretendard text-[16px] md:text-[18px]`
const CoreGrid = tw.div`
  flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20
`
const CoreItem = tw.div`flex flex-col items-center text-center max-w-[265px]`
const CoreImage = styled.img`
  ${tw`w-[100px] h-[100px] object-contain mb-4`}
`
const CoreTextTitle = tw.h4`text-[16px] md:text-[18px] font-bold mb-2 text-neutralBlack`
const CoreTextDesc = tw.p`text-neutral70 text-[14px] md:text-[16px] leading-[1.5] tracking-tight`

/* ──────────────────────────────
 * 4️⃣ INTERIOR × TRUST Section (상단)
 * ────────────────────────────── */
const SectionInterior = tw.section`
  w-full bg-white pt-20 pb-0 md:pt-28 overflow-x-hidden
`

const InteriorTextWrapper = tw.div`
  w-full max-w-[1440px] mx-auto px-6 md:px-10
`

const FullWidthImageWrapper = tw.div`
  w-full
`

const InteriorImageContainer = tw.div`
  max-w-[1440px] mx-auto w-full px-0
`

// 텍스트 블록
const InteriorLabel = tw.h3`
  text-primary text-[18px] md:text-[22px] tracking-tight mb-3 font-medium self-start leading-[1.5]
`
const InteriorTitle = tw.h2`
  text-[24px] md:text-[30px] font-bold text-neutralBlack mb-6 self-start tracking-tight leading-[1.5]
`
const InteriorDesc = tw.p`
  text-[14px] md:text-[16px] tracking-tight text-neutral70 font-pretendard mb-10 self-start leading-[1.5]
  whitespace-pre-line
`

// 🧡 상단 이미지 (2장, 1440px 컨테이너 내부 / 높이 351px 고정)
const TopImageRow = styled.div`
  ${tw`w-full flex flex-col md:flex-row items-center justify-center mb-16 md:mb-28`}
  gap: 0;

  img {
    ${tw`w-full object-cover`}
    height: 351px;
  }

  @media (max-width: 767px) {
    margin-left: -20px;
    margin-right: -20px;
    width: calc(100% + 40px);
    img {
      height: auto;
    }
  }

  // img + img {
  //   margin-left: 0;
  // }
`

// 🧡 하단 이미지 섹션
const BottomImageRow = styled.div`
  ${tw`flex flex-col md:flex-row w-full justify-between items-start md:items-end`}
  align-items: flex-start;
  gap: 0;

  @media (max-width: 767px) {
    margin-left: -20px;
    margin-right: -20px;
    width: calc(100% + 40px);
  }
`

// ✅ 왼쪽 블록 전체 높이를 오른쪽과 맞춤
const LeftBlock = styled.div`
  ${tw`flex flex-col md:w-[48%] w-full`}
  justify-content: space-between; /* ✅ 텍스트 + 이미지 분배 */
  height: auto; /* ✅ 모바일 기본값 */

  @media (min-width: 768px) {
    height: 584px; /* ✅ 데스크탑만 고정 */
  }
`

const LeftText = styled.p`
  ${tw`text-[14px] md:text-[16px] tracking-tight text-neutral70 font-pretendard leading-[1.5]`}
  margin-bottom: 25px; /* ✅ 모바일용 좁은 여백 */
  padding-left: 25px;

  @media (min-width: 768px) {
    margin-bottom: 32px; /* ✅ 데스크탑 여유 */
  }
`

const LeftImage = styled.img`
  ${tw`w-full object-cover`}
  height: 292px; /* ✅ 고정 */
  margin-top: auto;
  @media (max-width: 767px) {
    height: auto;
  }
`

const RightImage = styled.img`
  ${tw`md:w-[49%] w-full object-cover`}
  height: 584px; /* ✅ 오른쪽 기준 높이 */
  @media (max-width: 767px) {
    height: auto;
  }
`

/* ──────────────────────────────
 * 5️⃣ CUSTOMER × TRUST Section
 * ────────────────────────────── */
const SectionCustomerTrust = tw.section`
  w-full bg-white py-12 md:py-28
`

const CustomerTrustInner = tw.div`
  max-w-[1440px] mx-auto px-[20px] md:px-[30px]
`

// 🧡 섹션 제목
const SectionTitle = tw.h2`
  text-[24px] md:text-[30px] font-bold text-neutralBlack tracking-tight mb-12 
`

// 🧡 카드 래퍼
const CustomerTrustCard = styled.div`
  ${tw`
    flex flex-col md:flex-row 
    items-center md:items-start justify-between 
    gap-10 md:gap-10 mb-8
  `}/* ✅ 항상 이미지 왼쪽 / 텍스트 오른쪽 */
`

// 🧡 이미지
const CustomerTrustImage = styled.img`
  ${tw`w-full md:w-[45%] object-cover rounded-none`}
  height: auto;

  @media (min-width: 768px) {
    height: 320px; /* ✅ 데스크탑 */
  }

  @media (max-width: 767px) {
    height: 201px; /* ✅ 모바일 고정 높이 */
  }
`

// 🧡 텍스트 블록
const CustomerTrustText = tw.div`
  md:w-[50%] w-full flex flex-col justify-center
`

const CustomerTrustHeading = tw.h3`
  text-[18px] md:text-[22px] font-semibold text-[#D47A5A] mb-3 tracking-tight leading-[1.4]
`

const CustomerTrustParagraph = tw.p`
  text-[16px] md:text-[18px] text-neutral70 tracking-tight leading-[1.4]
`

/* ──────────────────────────────
 * PEOPLE × TRUST SECTION
 * ────────────────────────────── */
const PeopleSection = tw.section`
  w-full bg-[#FEF3E6] pt-20 pb-12 md:pt-28 md:pb-28
`

const PeopleInner = tw.div`
  max-w-[1440px] mx-auto px-[20px] md:px-[30px] text-center
`

// 🧡 텍스트 영역 (이름 변경됨)
const PeopleTag = tw.p`
  text-primary text-[18px] md:text-[22px] tracking-tight mb-3 font-medium self-start leading-[1.5]
`
const PeopleTitle = tw.h2`
  text-[24px] md:text-[30px] font-bold text-neutralBlack tracking-tight mb-4
`
const PeopleParagraph = tw.p`
  text-[14px] md:text-[16px] text-neutral70 tracking-tight leading-[1.4] max-w-[700px] mx-auto mb-14
`

// 🧡 인물 그리드
const PeopleGrid = styled.div`
  ${tw`grid gap-6 md:gap-8`}
  grid-template-columns: repeat(2, 1fr);
  justify-items: center;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const PersonCard = styled.div`
  ${tw`w-full h-auto overflow-hidden rounded-none`}
  background-color: #FDE9D9; /* ✅ 이미지 배경 */
  display: flex;
  align-items: center;
  justify-content: center;
`
const PersonImage = styled.img`
  ${tw`object-cover w-full h-full block`}
  display: block;
`

const MapSection = tw.section`
  w-full bg-[#F5F5F5] overflow-hidden
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
  w-full md:w-1/2 h-[300px] md:h-[400px] flex
`

const GoogleMapWrapper = tw.div`
  w-full h-full
`

/* ──────────────────────────────
 *  MAIN PAGE
 * ────────────────────────────── */
const Intro = () => {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const people = [person1, person2, person3, person4, person5, person6, person7, person8]

  return (
    <Page hiddenFooter={false} bottomCartExists={false}>
      <CartView isHome>
        <PageContainer>
          {/* 2️⃣ TRUST Section */}
          <SectionTrust>
            <TrustInner>
              <TrustTextBlock>
                <TrustHeadingBlock>
                  <TrustHeading>
                    아름다움의 시작과 <br />
                    끝을 완성하는 <br />
                    페슈의원의 <span>‘TRUST’</span>
                  </TrustHeading>
                </TrustHeadingBlock>

                <TrustParagraphBlock>
                  <TrustParagraph>
                    페슈의원은 고객이 경험하는 모든 순간에서 신뢰를 만들기 위해 오랜 시간 깊은
                    고민과 노력을 쌓아 만들어졌습니다.
                    {"\n"} {"\n"}
                    처음 만나는 순간부터 치료를 마치고 병원을 나서는 순간까지, 페슈의원에서의 모든
                    경험은 언제나 투명하고 정직합니다.
                  </TrustParagraph>
                </TrustParagraphBlock>
              </TrustTextBlock>

              <TrustImage src={modelImg} alt="clinic model" />
            </TrustInner>
          </SectionTrust>

          {/* 3️⃣ SYMBOL × TRUST Section */}
          <SectionSymbolTrust>
            <SymbolInner>
              <SymbolTitle>SYMBOL × TRUST</SymbolTitle>
              <SymbolSubTitle>
                복숭아 <span tw="font-normal">[pêche]</span>
              </SymbolSubTitle>
              <SymbolDesc>
                페슈(Pêche)는 프랑스어로 ‘복숭아’를 뜻합니다.
                <br />
                화사함과 생기를 불러일으키는 복숭아의 이미지는 피부과가 추구하는 아름다움의 본질과도
                맞닿아 있습니다.
                <br />이 의미는 브랜드 심볼로 이어지고 그 안에 페슈의원의 철학을 담았습니다.
              </SymbolDesc>

              <HoverGrid>
                {desktopImages.map((img, index) => (
                  <HoverItem key={index} className={`item-${index}`}>
                    <img src={img.src} alt={`peche-${index}`} />
                    <div className="label">
                      <p tw="font-time">{img.title}</p>
                      <p>{img.desc}</p>
                    </div>
                  </HoverItem>
                ))}
              </HoverGrid>

              <MobileSwiperWrapper>
                <Swiper
                  modules={[Pagination]}
                  pagination={{ clickable: true }}
                  spaceBetween={5}
                  slidesPerView="auto"
                  onReachEnd={(swiper) => {
                    swiper.allowSlideNext = false
                  }}
                  onFromEdge={(swiper) => {
                    swiper.allowSlideNext = true
                    swiper.allowSlidePrev = true
                  }}>
                  {mobileImages.map((img, i) => (
                    <StyledSwiperSlide key={i}>
                      <MobileSlide>
                        <div className="img-wrapper">
                          <img src={img.src} alt={`mobile-peche-${i}`} />

                          <div className="label">
                            <p tw="font-time">{img.title}</p>
                            <p>{img.desc}</p>
                          </div>
                        </div>
                      </MobileSlide>
                    </StyledSwiperSlide>
                  ))}
                </Swiper>
              </MobileSwiperWrapper>

              {/* Core Value */}
              <CoreValueContainer>
                <CoreTitle>
                  Core Value <Highlight>페슈의원의 핵심가치</Highlight>
                </CoreTitle>

                <CoreGrid>
                  <CoreItem>
                    <CoreImage src={beauty} alt="아름다움" />
                    <CoreTextTitle>아름다움</CoreTextTitle>
                    <CoreTextDesc>
                      복숭아 고유의 부드러운 곡선과 생기 있는 컬러는 건강하고 생기있는 피부를
                      상징합니다.
                    </CoreTextDesc>
                  </CoreItem>

                  <GrayPlusIcon />

                  <CoreItem>
                    <CoreImage src={trust} alt="신뢰" />
                    <CoreTextTitle>신뢰</CoreTextTitle>
                    <CoreTextDesc>
                      삼각형의 단단한 직선은 진정성 있는 진료와 일관된 기준을 지키는 신뢰를 담고
                      있습니다.
                    </CoreTextDesc>
                  </CoreItem>

                  <GrayPlusIcon />

                  <CoreItem>
                    <CoreImage src={transparency} alt="투명함" />
                    <CoreTextTitle>투명함</CoreTextTitle>
                    <CoreTextDesc>
                      복숭아의 뽀얀 단면처럼 진실되고 투명한 마음으로 고객을 대합니다.
                    </CoreTextDesc>
                  </CoreItem>
                </CoreGrid>
              </CoreValueContainer>
            </SymbolInner>
          </SectionSymbolTrust>
          <SectionInterior>
            <InteriorTextWrapper>
              {/* 텍스트 */}
              <InteriorLabel>INTERIOR × TRUST</InteriorLabel>
              <InteriorTitle>모든 공간에 새겨 넣은, 신뢰의 가치</InteriorTitle>
              <InteriorDesc>
                페슈의원은 고급스럽게 과시하기보다 신뢰감을 줄 수 있는 공간을 지향합니다.
                <br />
                개방감과 투명성이 느껴지는 구조, 남녀 모두에게 어울리는 중성적 분위기, 낮은 조도의
                편안한 대기 공간까지
                <br />
                모든 요소는 환자가 편안하게 머무르면서도 신뢰와 안정감을 느낄 수 있도록
                디자인되었습니다.
              </InteriorDesc>
            </InteriorTextWrapper>
            <FullWidthImageWrapper>
              {/* 이미지 2장 (1440px 안, gap 없음) */}
              <TopImageRow>
                <img src={interior1} alt="대기실 인테리어" />
                <img src={interior2} alt="진료실 인테리어" />
              </TopImageRow>
            </FullWidthImageWrapper>

            <FullWidthImageWrapper>
              <InteriorImageContainer>
                {/* 하단 이미지 */}
                <BottomImageRow>
                  <LeftBlock>
                    <LeftText>
                      특히 공간 곳곳에는 독창적인 소재 텍스처와 우리의 철학이 담긴 복숭아 심볼을
                      <br />
                      형상화한 포인트 요소를 담아냈습니다. 이 세심한 디테일을 통해 다른 곳에서는
                      <br />
                      경험할 수 없는 페슈만의 특별함이 완성됩니다.
                    </LeftText>
                    <LeftImage src={interior3} alt="복도 인테리어" />
                  </LeftBlock>

                  <RightImage src={interior4} alt="리셉션 인테리어" />
                </BottomImageRow>
              </InteriorImageContainer>
            </FullWidthImageWrapper>
          </SectionInterior>
          <SectionCustomerTrust>
            <CustomerTrustInner>
              <SectionTitle>고객이 마주하는 모든 곳에 담아낸 ‘신뢰의 가치’</SectionTitle>

              {/* 1️⃣ 카드 */}
              <CustomerTrustCard>
                <CustomerTrustImage src={trustPic1} alt="언제나 같은, 합리적이고 정직한 가격" />
                <CustomerTrustText>
                  <CustomerTrustHeading>언제나 같은, 합리적이고 정직한 가격</CustomerTrustHeading>
                  <CustomerTrustParagraph>
                    페슈의원은 가격을 통해서도 신뢰를 지켜갑니다. 누구에게나 다르게, 순간적인
                    이벤트로만 달라지는 가격은 없습니다. 언제나 어디서나 동일하게 적용되는 정찰제를
                    고수하며, 불필요한 거품을 뺀 합리적인 가격만을 제시합니다.
                    <br /> <br />
                    최저가 경쟁은 아니지만, 누구나 납득할 수 있는 수준에서 공정하고 투명하게
                    지켜갑니다.
                  </CustomerTrustParagraph>
                </CustomerTrustText>
              </CustomerTrustCard>

              {/* 2️⃣ 카드 */}
              <CustomerTrustCard>
                <CustomerTrustImage
                  src={trustPic2}
                  alt="가장 효과적인 방법으로, 정확하게 진행되는 시술"
                />
                <CustomerTrustText>
                  <CustomerTrustHeading>
                    가장 효과적인 방법으로, 정확하게 진행되는 시술
                  </CustomerTrustHeading>
                  <CustomerTrustParagraph>
                    시술은 단순히 기계와 약물이 아니라, 효과를 극대화할 수 있는 정확한 방법에서
                    시작됩니다. 페슈의원은 환자 한 분 한 분의 피부 상태를 세심히 진단하고, 가장
                    효과적인 방법을 찾아 안내합니다.
                    <br /> <br />
                    충분한 설명을 통해 환자가 올바른 선택을 하도록 돕고, 그 선택이 최고의 결과로
                    이어질 수 있도록 전문성과 정직함을 바탕으로 시술합니다. 결국 진료의 가치는
                    정직한 설명과 정확한 실행에서 완성된다고 믿습니다.
                  </CustomerTrustParagraph>
                </CustomerTrustText>
              </CustomerTrustCard>

              {/* 3️⃣ 카드 */}
              <CustomerTrustCard>
                <CustomerTrustImage
                  src={trustPic3}
                  alt="불필요함을 덜어낸, 친절하고 진심 어린 상담"
                />
                <CustomerTrustText>
                  <CustomerTrustHeading>
                    불필요함을 덜어낸, 친절하고 진심 어린 상담
                  </CustomerTrustHeading>
                  <CustomerTrustParagraph>
                    페슈의원의 상담은 환자를 설득하기 위한 과정이 아닙니다. 과장된 말이나 불필요한
                    권유는 덜어내고, 꼭 필요한 정보와 진실된 설명만을 전달합니다. 의료진과 실장은
                    환자의 이야기를 경청하며, 개인의 상황과 피부 상태에 맞는 가장 적절한 방법을 함께
                    고민합니다.
                    <br /> <br />
                    친절함은 기본이지만, 그 안에 담긴 진심, 환자가 안심할 수 있는 신뢰로 이어진다고
                    믿습니다.
                  </CustomerTrustParagraph>
                </CustomerTrustText>
              </CustomerTrustCard>

              {/* 4️⃣ 카드 */}
              <CustomerTrustCard>
                <CustomerTrustImage src={trustPic4} alt="숨기지 않고 투명하게 드러낸 자신감" />
                <CustomerTrustText>
                  <CustomerTrustHeading>숨기지 않고 투명하게 드러낸 자신감</CustomerTrustHeading>
                  <CustomerTrustParagraph>
                    페슈의원의 공간은 숨기기 위해 설계되지 않았습니다. 상담과 시술 준비 과정까지
                    환자가 직접 확인할 수 있도록 오픈되어 있으며, 이 구조는 단순한 인테리어가 아닌
                    우리의 자신감을 보여주는 방식입니다.
                    <br /> <br />
                    투명한 공간은 곧 정직한 태도의 반영이며, 환자가 느끼는 모든 과정 속에서 신뢰를
                    체감하게 합니다. 공간 하나하나가 곧 페슈의원의 철학을 증명합니다.
                  </CustomerTrustParagraph>
                </CustomerTrustText>
              </CustomerTrustCard>
            </CustomerTrustInner>
          </SectionCustomerTrust>
          {/* <PeopleSection>
          <PeopleInner>
            <PeopleTag>PEOPLE × TRUST</PeopleTag>
            <PeopleTitle>결국, 신뢰는 사람으로 완성됩니다</PeopleTitle>
            <PeopleParagraph>
              페슈의원의 의료진과 직원들은 정직한 설명으로 환자가 올바른 선택을 할 수 있도록
              돕습니다.
              <br /> <br />
              개인에게 가장 효과적인 시술을 고민하고, 전문성을 바탕으로 신중하게 진료합니다. 또한
              진심 어린 응대와 세심한 배려 속에서도, 때로는 단호하게 신뢰의 가치를 지켜나갑니다.
            </PeopleParagraph>

            <PeopleGrid>
              {people.map((src, i) => (
                <PersonCard key={i}>
                  <PersonImage src={src} alt={`person${i + 1}`} />
                </PersonCard>
              ))}
            </PeopleGrid>
          </PeopleInner>
        </PeopleSection> */}
          <MapSection>
            <MapInner>
              {/* Left side */}
              <InfoColumn>
                <div tw="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 진료시간 안내 */}
                  <InfoBlock>
                    <InfoTitle>진료시간 안내</InfoTitle>
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
                    <InfoTitle>오시는 길</InfoTitle>
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
        </PageContainer>
      </CartView>
    </Page>
  )
}

export default Intro
