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
import { GrayPlusIcon, CloseIcon } from "@/assets/icon"
import interior1 from "@/assets/images/interior1.png"
import interior2 from "@/assets/images/interior2.png"
import interior3 from "@/assets/images/interior3.png"
import interior4 from "@/assets/images/interior4.png"
import trustPic1 from "@/assets/images/trust-pic1.jpg"
import trustPic2 from "@/assets/images/trust-pic2.jpg"
import trustPic3 from "@/assets/images/trust-pic3.jpg"
import trustPic4 from "@/assets/images/trust-pic4.jpg"
import crewPicture from "@/assets/images/crew-picture.jpg"
import wechatQrImg from "@/assets/images/wechat-qr.png"
import { useTranslation } from "react-i18next"
import useCustomNavigate from "@/lib/hooks/use-custom-navigate"
import { Language } from "@/lib/locales/i18n.config"
import Modal from "@/lib/components/modal/modal.component"

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

const TrustHeading = styled.h2<{ language: string }>`
  ${tw`text-[32px] md:text-[40px] font-semibold leading-[1.4] font-pretendard tracking-tight`}

  span {
    ${({ language }) =>
      language === "ko"
        ? tw`text-primary font-time font-normal tracking-tight`
        : tw`text-primary font-semibold tracking-tight`}/* 한국어가 아닐 때 font-time 제거 */
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
  text-center text-neutralBlack text-[24px] md:text-[30px] font-bold mb-4 tracking-tight font-pretendard
`
const SymbolDesc = tw.p`
  text-center text-neutral70 text-[14px] md:text-[16px] leading-[1.5] mb-10 max-w-[700px] tracking-tight font-pretendard
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
const CoreItem = tw.div`flex flex-col items-center text-center max-w-[265px] font-pretendard`
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
  w-full max-w-[1440px] mx-auto px-6 md:px-10 font-pretendard
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
  text-[24px] md:text-[30px] font-bold text-neutralBlack tracking-tight mb-12 font-pretendard
`

// 🧡 카드 래퍼
const CustomerTrustCard = styled.div`
  ${tw`
    flex flex-col md:flex-row 
    items-center md:items-start justify-between font-pretendard
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
  w-full bg-[#FEF3E6] pt-20 pb-12 md:pt-28 md:pb-28 font-pretendard
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

const InfoTextWrapper = tw.div`
  flex flex-col
  justify-start
  lg:min-h-[140px]
  md:min-h-[200px]
  min-h-[120px]
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
  const { t, i18n } = useTranslation()
  const language = i18n.language as Language
  const navigate = useCustomNavigate()
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const [openWeChatModal, setOpenWeChatModal] = React.useState(false)

  const handleChatClick = () => {
    if (language === "ko" || language === "en") {
      window.open("https://pf.kakao.com/_dxoiLn", "_blank")
      return
    }

    if (language === "zh") {
      // 중국어 → 위챗 모달 표시
      setOpenWeChatModal(true)
      return
    }

    if (language === "ja") {
      window.open("https://line.me/R/ti/p/@235wfyao", "_blank")
      return
    }

    if (language === "th") {
      window.open(
        "https://www.tiktok.com/@pecheclinic_th?is_from_webapp=1&sender_device=pc",
        "_blank",
      )
      return
    }

    if (language === "zh-TW") {
      window.open("https://line.me/R/ti/p/@683jgqmd", "_blank")
    }
  }

  return (
    <Page hiddenFooter={false} bottomCartExists={false}>
      <CartView isHome>
        <PageContainer>
          {/* 2️⃣ TRUST Section */}
          <SectionTrust>
            <TrustInner>
              <TrustTextBlock>
                <TrustHeadingBlock>
                  <TrustHeading language={language}>
                    {t("intro.trustHeading1")} <br />
                    {t("intro.trustHeading2")} <br />
                    {t("intro.trustHeading3")} <span>{t("intro.trustHeading4")}</span>
                  </TrustHeading>
                </TrustHeadingBlock>

                <TrustParagraphBlock>
                  <TrustParagraph>
                    {t("intro.trustParagraph1")}
                    {"\n"} {"\n"}
                    {t("intro.trustParagraph2")}
                  </TrustParagraph>
                </TrustParagraphBlock>
              </TrustTextBlock>

              <TrustImage src={modelImg} alt="clinic model" />
            </TrustInner>
          </SectionTrust>

          {/* 3️⃣ SYMBOL × TRUST Section */}
          <SectionSymbolTrust>
            <SymbolInner>
              <SymbolTitle>{t("intro.symbolTitle")}</SymbolTitle>
              <SymbolSubTitle>
                {t("intro.symbolSubtitle1")}
                <span tw="font-normal font-time"> {t("intro.symbolSubtitle2")}</span>
              </SymbolSubTitle>
              <SymbolDesc>
                {t("intro.symbolDesc1")}
                <br />
                {t("intro.symbolDesc2")}
                <br /> {t("intro.symbolDesc3")}
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
                  {t("intro.coreTitle1")} <Highlight>{t("intro.coreTitle2")}</Highlight>
                </CoreTitle>

                <CoreGrid>
                  <CoreItem>
                    <CoreImage src={beauty} alt="아름다움" />
                    <CoreTextTitle>{t("intro.coreTextTitle1")}</CoreTextTitle>
                    <CoreTextDesc>{t("intro.coreTextDesc1")}</CoreTextDesc>
                  </CoreItem>

                  <GrayPlusIcon />

                  <CoreItem>
                    <CoreImage src={trust} alt="신뢰" />
                    <CoreTextTitle>{t("intro.coreTextTitle2")}</CoreTextTitle>
                    <CoreTextDesc>{t("intro.coreTextDesc2")}</CoreTextDesc>
                  </CoreItem>

                  <GrayPlusIcon />

                  <CoreItem>
                    <CoreImage src={transparency} alt="투명함" />
                    <CoreTextTitle>{t("intro.coreTextTitle3")}</CoreTextTitle>
                    <CoreTextDesc>{t("intro.coreTextDesc3")}</CoreTextDesc>
                  </CoreItem>
                </CoreGrid>
              </CoreValueContainer>
            </SymbolInner>
          </SectionSymbolTrust>
          <SectionInterior>
            <InteriorTextWrapper>
              {/* 텍스트 */}
              <InteriorLabel tw="font-time">{t("intro.interiorLabel")}</InteriorLabel>
              <InteriorTitle>{t("intro.interiorTitle")}</InteriorTitle>
              <InteriorDesc>
                {t("intro.interiorDesc1")}
                <br />
                {t("intro.interiorDesc2")}
                <br />
                {t("intro.interiorDesc3")}
                <br />
                {t("intro.interiorDesc4")}
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
                      {t("intro.interiorLeft1")}
                      <br />
                      {t("intro.interiorLeft2")}
                      <br />
                      {t("intro.interiorLeft3")}
                      <br />
                      {t("intro.interiorLeft4")}
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
              <SectionTitle>{t("intro.customerTrustSection")}</SectionTitle>

              {/* 1️⃣ 카드 */}
              <CustomerTrustCard>
                <CustomerTrustImage src={trustPic1} alt="언제나 같은, 합리적이고 정직한 가격" />
                <CustomerTrustText>
                  <CustomerTrustHeading>{t("intro.customerTrust1Title")}</CustomerTrustHeading>
                  <CustomerTrustParagraph>
                    {t("intro.customerTrust1Desc1")}
                    <br /> <br />
                    {t("intro.customerTrust1Desc2")}
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
                  <CustomerTrustHeading>{t("intro.customerTrust2Title")}</CustomerTrustHeading>
                  <CustomerTrustParagraph>
                    {t("intro.customerTrust2Desc1")}
                    <br /> <br />
                    {t("intro.customerTrust2Desc2")}
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
                  <CustomerTrustHeading>{t("intro.customerTrust3Title")}</CustomerTrustHeading>
                  <CustomerTrustParagraph>
                    {t("intro.customerTrust3Desc1")}
                    <br /> <br />
                    {t("intro.customerTrust3Desc2")}
                  </CustomerTrustParagraph>
                </CustomerTrustText>
              </CustomerTrustCard>

              {/* 4️⃣ 카드 */}
              <CustomerTrustCard>
                <CustomerTrustImage src={trustPic4} alt="숨기지 않고 투명하게 드러낸 자신감" />
                <CustomerTrustText>
                  <CustomerTrustHeading>{t("intro.customerTrust4Title")}</CustomerTrustHeading>
                  <CustomerTrustParagraph>
                    {t("intro.customerTrust4Desc1")}
                    <br /> <br />
                    {t("intro.customerTrust4Desc2")}
                  </CustomerTrustParagraph>
                </CustomerTrustText>
              </CustomerTrustCard>
            </CustomerTrustInner>
          </SectionCustomerTrust>
          <PeopleSection>
            <PeopleInner>
              <PeopleTag tw="font-time">{t("intro.peopleSection")}</PeopleTag>
              <PeopleTitle>{t("intro.peopleTitle")}</PeopleTitle>
              <PeopleParagraph>
                {t("intro.peopleParagraph1")}
                <br /> <br />
                {t("intro.peopleParagraph2")}
              </PeopleParagraph>

              {/* PEOPLE IMAGE (대체) */}
              <div
                tw="
    w-full 
    flex justify-center
    px-0
  ">
                <img
                  src={crewPicture}
                  alt="Peche Clinic Crew"
                  tw="
      w-full 
      max-w-[600px]
      h-auto 
      object-cover
    "
                />
              </div>
            </PeopleInner>
          </PeopleSection>
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

                    <ButtonGroup>
                      <SolidButton
                        onClick={() => {
                          navigate("/reservation/new")
                        }}>
                        {t("location.leftButton1")}
                      </SolidButton>
                      <SolidButton className="sns-btn-conversion" onClick={handleChatClick}>
                        {t("location.leftButton2")}
                      </SolidButton>
                    </ButtonGroup>
                  </InfoBlock>

                  {/* 오시는 길 */}
                  <InfoBlock>
                    <InfoTextWrapper>
                      <InfoTitle>{t("location.directions")}</InfoTitle>
                      <InfoText>{t("location.address1")}</InfoText>
                      <InfoText>{t("location.address2")}</InfoText>
                      <InfoText tw="text-primary">{t("location.subway")}</InfoText>
                    </InfoTextWrapper>

                    <ButtonGroup>
                      <OutlineButton
                        onClick={() => window.open("https://naver.me/FLe0V59M", "_blank")}>
                        {t("location.rightButton1")}
                      </OutlineButton>
                      <OutlineButton
                        onClick={() => window.open("https://kko.kakao.com/LK40uI5cBA", "_blank")}>
                        {t("location.rightButton2")}
                      </OutlineButton>
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
