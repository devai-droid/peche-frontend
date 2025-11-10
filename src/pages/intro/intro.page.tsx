import React from "react"
import tw, { styled } from "twin.macro"
import Page from "@/lib/components/layout/page.component"
import KakaoMap from "@/lib/components/kakao-map/kakao-map.component"
import GoogleMapComponent from "@/lib/components/google-map/google-map.component"

// 이미지 import
import introBg from "@/assets/images/intro-object.jpg"
import modelImg from "@/assets/images/intro-model.jpg"
import peche1 from "@/assets/images/peche1.jpg"
import peche2 from "@/assets/images/peche2.jpg"
import peche3 from "@/assets/images/peche3.jpg"
import peche1Mobile from "@/assets/images/peche1-mobile.jpg"
import peche2Mobile from "@/assets/images/peche2-mobile.jpg"
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

/* ──────────────────────────────
 * 1️⃣ Hero Section (배경 위 텍스트)
 * ────────────────────────────── */
const SectionIntro = styled.section`
  ${tw`relative w-full h-[500px] md:h-[650px] bg-center bg-cover flex items-center`}
  background-image: url(${introBg});
`
const IntroTextWrapper = tw.div`
  absolute left-[8vw] bottom-[8vh]
  text-neutralBlack
`
const IntroTitle = tw.h1`
  text-[40px] md:text-[52px] font-medium leading-tight mb-2 font-time
`
const IntroSubtitle = tw.p`
  text-[16px] md:text-[18px] text-neutralBlack font-pretendard
`

/* ──────────────────────────────
 * 2️⃣ TRUST Section
 * ────────────────────────────── */
/* 2️⃣ TRUST Section */
/* 2️⃣ TRUST Section */
const SectionTrust = tw.section`
  w-full bg-white text-neutralBlack py-20 md:py-32
`
const TrustInner = tw.div`
  max-w-[1440px] mx-auto px-6 md:px-10
  flex flex-col md:flex-row items-center justify-between
`

const TrustTextBlock = tw.div`md:w-1/2 w-full mb-10 md:mb-0`
const TrustHeading = styled.h2`
  ${tw`text-[28px] md:text-[36px] font-bold leading-[1.4] mb-6 font-pretendard`}
  span {
    ${tw`text-primary`}
  }
`
const TrustParagraph = tw.p`
  text-[15px] md:text-[16px] leading-relaxed text-[#555]
  font-pretendard whitespace-pre-line
`
const TrustImage = styled.img`
  ${tw`md:w-[480px] w-full md:h-auto h-[400px] object-cover rounded-none`}
`

/* ──────────────────────────────
 * 3️⃣ SYMBOL × TRUST Section
 * ────────────────────────────── */
const SectionSymbolTrust = tw.section`
  w-full bg-[#FFF7EE] py-20 md:py-28
`
const SymbolInner = tw.div`
  max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col items-center
`

const SymbolTitle = tw.h3`
  text-center text-[#C18067] text-[16px] md:text-[18px] tracking-[0.1em] mb-3 font-medium
`
const SymbolSubTitle = tw.h2`
  text-center text-neutralBlack text-[28px] md:text-[32px] font-bold mb-4
`
const SymbolDesc = tw.p`
  text-center text-[#555] text-[15px] md:text-[16px] leading-relaxed mb-10 max-w-[700px]
`

// ✅ 이미지 그리드 수정됨
const ImageGrid = styled.div`
  ${tw`flex justify-center items-center gap-4 w-full overflow-hidden`}
  flex-wrap: nowrap; /* ✅ 줄바꿈 방지 */
  @media (max-width: 767px) {
    ${tw`grid grid-cols-2 gap-2`}
    flex-wrap: initial;
  }
`

// ✅ 개별 이미지
const SymbolImage = styled.img<{ index?: number }>`
  ${tw`object-cover`}
  height: 438px;
  flex-shrink: 0; /* ✅ 줄바꿈 방지 핵심 */

  @media (min-width: 1024px) {
    ${({ index }) => (index === 0 ? tw`w-[584px]` : tw`w-[300px]`)}
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    /* ✅ 태블릿 구간: 비율 맞추기 */
    ${({ index }) => (index === 0 ? tw`w-[45%]` : tw`w-[27%]`)}
    height: auto;
  }

  @media (max-width: 767px) {
    ${tw`w-full h-auto`}
  }
`

/* Core Value */
const CoreValueContainer = tw.div`
  w-full bg-white rounded-none mt-20 py-14 md:py-20 flex flex-col items-center
`
const CoreTitle = tw.h3`
  text-center text-[22px] md:text-[26px] font-semibold text-neutralBlack mb-12 font-pretendard
`
const Highlight = tw.span`text-primary ml-2 font-medium`
const CoreGrid = tw.div`
  flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20
`
const CoreItem = tw.div`flex flex-col items-center text-center max-w-[250px]`
const CoreImage = styled.img`
  ${tw`w-[100px] h-[100px] object-contain mb-4`}
`
const CoreTextTitle = tw.h4`text-[18px] font-bold mb-2 text-neutralBlack`
const CoreTextDesc = tw.p`text-[#666] text-[15px] leading-relaxed`

/* ──────────────────────────────
 * 4️⃣ INTERIOR × TRUST Section (상단)
 * ────────────────────────────── */
const SectionInterior = tw.section`
  w-full bg-white py-20 md:py-28 overflow-x-hidden
`

const InteriorInner = tw.div`
  max-w-[1440px] mx-auto px-[20px] md:px-[30px]
  flex flex-col items-center
`

// 🧡 텍스트 블록
const InteriorLabel = tw.h3`
  text-primary text-[15px] md:text-[16px] tracking-[0.1em] mb-3 font-medium self-start
`
const InteriorTitle = tw.h2`
  text-[26px] md:text-[32px] font-bold text-neutralBlack mb-6 self-start leading-tight
`
const InteriorDesc = tw.p`
  text-[15px] md:text-[16px] leading-relaxed text-[#555] font-pretendard mb-10 self-start
  whitespace-pre-line
`

// ✅ 풀블리드 이미지 섹션 (뷰포트 기준 확장)
const FullWidthImageRow = styled.div`
  ${tw`w-screen flex flex-col md:flex-row gap-0`}
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow: hidden;

  img {
    ${tw`w-full object-cover`}
    height: auto;
    @media (min-width: 768px) {
      height: 460px;
    }
  }
`

// 🧡 상단 이미지 (2장, 1440px 컨테이너 내부 / 높이 351px 고정)
const TopImageRow = styled.div`
  ${tw`w-full flex flex-col md:flex-row items-center justify-center mb-20 md:mb-28`} /* ✅ 여백 추가 */
  gap: 0;

  img {
    ${tw`w-full object-cover`}
    height: 351px; /* ✅ 최대 높이 고정 */
  }

  @media (max-width: 767px) {
    img {
      height: auto; /* ✅ 모바일은 자동 높이 (비율 유지) */
    }
  }

  img + img {
    margin-left: 0;
  }
`

// 🧡 하단 이미지 섹션
const BottomImageRow = styled.div`
  ${tw`flex flex-col md:flex-row w-full justify-between items-start`}
  align-items: flex-start;
  gap: 0;
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
  ${tw`text-[15px] md:text-[16px] leading-relaxed text-[#555] font-pretendard`}
  margin-bottom: 12px; /* ✅ 모바일용 좁은 여백 */

  @media (min-width: 768px) {
    margin-bottom: 32px; /* ✅ 데스크탑 여유 */
  }
`

const LeftImage = styled.img`
  ${tw`w-full object-cover`}
  height: 292px; /* ✅ 고정 */
  @media (max-width: 767px) {
    height: auto;
  }
`

const RightImage = styled.img`
  ${tw`md:w-[48%] w-full object-cover`}
  height: 584px; /* ✅ 오른쪽 기준 높이 */
  @media (max-width: 767px) {
    height: auto;
  }
`

/* ──────────────────────────────
 * 5️⃣ CUSTOMER × TRUST Section
 * ────────────────────────────── */
const SectionCustomerTrust = tw.section`
  w-full bg-white py-20 md:py-28
`

const CustomerTrustInner = tw.div`
  max-w-[1440px] mx-auto px-[20px] md:px-[30px]
`

// 🧡 섹션 제목
const SectionTitle = tw.h2`
  text-[22px] md:text-[28px] font-bold text-neutralBlack mb-12
`

// 🧡 카드 래퍼
const CustomerTrustCard = styled.div`
  ${tw`
    flex flex-col md:flex-row 
    items-center md:items-start justify-between 
    gap-6 md:gap-10 mb-8
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
  text-[16px] md:text-[18px] font-semibold text-[#D47A5A] mb-3
`

const CustomerTrustParagraph = tw.p`
  text-[15px] md:text-[16px] leading-relaxed text-[#555]
`

/* ──────────────────────────────
 * PEOPLE × TRUST SECTION
 * ────────────────────────────── */
const PeopleSection = tw.section`
  w-full bg-[#FEF3E6] py-20 md:py-28
`

const PeopleInner = tw.div`
  max-w-[1440px] mx-auto px-[20px] md:px-[30px] text-center
`

// 🧡 텍스트 영역 (이름 변경됨)
const PeopleTag = tw.p`
  text-[13px] md:text-[14px] text-[#C56A4B] mb-3 tracking-wide
`
const PeopleTitle = tw.h2`
  text-[22px] md:text-[28px] font-bold text-neutralBlack mb-4
`
const PeopleParagraph = tw.p`
  text-[15px] md:text-[16px] text-[#444] leading-relaxed max-w-[700px] mx-auto mb-14
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
  ${tw`max-w-[1440px] mx-auto flex flex-col md:flex-row gap-10 md:gap-[40px] px-[20px] md:px-[40px] items-stretch`}
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
  text-[17px] font-semibold text-[#C56A4B] mb-2
`

const InfoText = tw.p`
  leading-[150%] mb-1
`

/* Buttons */
const ButtonGroup = tw.div`
  flex flex-row md:flex-col gap-3 mt-6
`

const SolidButton = tw.button`
  flex-1 bg-[#C56A4B] text-white py-2 md:py-2 text-[15px] font-medium hover:opacity-90 transition
`

const OutlineButton = tw.button`
  flex-1 border border-[#C56A4B] text-[#C56A4B] py-2 md:py-2 text-[15px] font-medium hover:bg-[#C56A4B]/10 transition
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

  const topImages = isMobile
    ? [peche1Mobile, peche2Mobile] // ✅ 모바일에서는 2장만 표시
    : [peche1, peche2, peche3] // ✅ 데스크탑에서는 3장

  const people = [person1, person2, person3, person4, person5, person6, person7, person8]

  return (
    <Page hiddenFooter={false}>
      <PageContainer>
        {/* 1️⃣ Hero Section */}
        <SectionIntro>
          <IntroTextWrapper>
            <IntroTitle>Pêche Introduction</IntroTitle>
            <IntroSubtitle>페슈의원 소개</IntroSubtitle>
          </IntroTextWrapper>
        </SectionIntro>

        {/* 2️⃣ TRUST Section */}
        <SectionTrust>
          <TrustInner>
            <TrustTextBlock>
              <TrustHeading>
                아름다움의 시작과 <br />
                끝을 완성하는 <br />
                페슈의원의 <span>‘TRUST’</span>
              </TrustHeading>
              <TrustParagraph>
                페슈의원은 고객이 경험하는 모든 순간에서 신뢰를 만들기 위해 오랜 시간 깊은 고민과
                노력을 쌓아 만들어졌습니다.
                {"\n\n"}
                처음 만나는 순간부터 치료를 마치고 병원을 나서는 순간까지, 페슈의원에서의 모든
                경험은 언제나 투명하고 정직합니다.
              </TrustParagraph>
            </TrustTextBlock>
            <TrustImage src={modelImg} alt="clinic model" />
          </TrustInner>
        </SectionTrust>

        {/* 3️⃣ SYMBOL × TRUST Section */}
        <SectionSymbolTrust>
          <SymbolInner>
            <SymbolTitle>SYMBOL × TRUST</SymbolTitle>
            <SymbolSubTitle>복숭아 [pêche]</SymbolSubTitle>
            <SymbolDesc>
              페슈(Pêche)는 프랑스어로 ‘복숭아’를 뜻합니다.
              <br />
              화사함과 생기를 불러일으키는 복숭아의 이미지는 피부과가 추구하는 아름다움의 본질과도
              맞닿아 있습니다.
              <br />이 의미는 브랜드 심볼로 이어지고 그 안에 페슈의원의 철학을 담았습니다.
            </SymbolDesc>

            <ImageGrid>
              {topImages.map((img, i) => (
                <SymbolImage key={i} src={img} index={i} alt={`pêche ${i + 1}`} />
              ))}
            </ImageGrid>

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
                    페슈의원의 심볼은 복숭아의 단면에서 시작되었습니다.
                    <br />
                    껍질을 넘어.
                  </CoreTextDesc>
                </CoreItem>

                <GrayPlusIcon />

                <CoreItem>
                  <CoreImage src={trust} alt="신뢰" />
                  <CoreTextTitle>신뢰</CoreTextTitle>
                  <CoreTextDesc>
                    페슈의원의 심볼은 복숭아의 단면에서 시작되었습니다.
                    <br />
                    껍질을 넘어.
                  </CoreTextDesc>
                </CoreItem>

                <GrayPlusIcon />

                <CoreItem>
                  <CoreImage src={transparency} alt="투명함" />
                  <CoreTextTitle>투명함</CoreTextTitle>
                  <CoreTextDesc>
                    페슈의원의 심볼은 복숭아의 단면에서 시작되었습니다.
                    <br />
                    껍질을 넘어.
                  </CoreTextDesc>
                </CoreItem>
              </CoreGrid>
            </CoreValueContainer>
          </SymbolInner>
        </SectionSymbolTrust>
        <SectionInterior>
          <InteriorInner>
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

            {/* 이미지 2장 (1440px 안, gap 없음) */}
            <TopImageRow>
              <img src={interior1} alt="대기실 인테리어" />
              <img src={interior2} alt="진료실 인테리어" />
            </TopImageRow>

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
          </InteriorInner>
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
                  고수하며, 불필요한 거품을 뺀 합리적인 가격만을 제시합니다. 최저가 경쟁은 아니지만,
                  누구나 납득할 수 있는 수준에서 공정하고 투명하게 지켜갑니다.
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
                  권유는 덜어내고, 꼭 필요한 정보와 진심 어린 설명을 전달합니다. 진정한 신뢰는
                  친절함과 진심에서 비롯된다고 믿습니다.
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
                  환자가 직접 확인할 수 있도록 오픈되어 있습니다. 이는 단순한 인테리어가 아니라,
                  우리의 자신감을 보여주는 방식입니다.
                </CustomerTrustParagraph>
              </CustomerTrustText>
            </CustomerTrustCard>
          </CustomerTrustInner>
        </SectionCustomerTrust>
        <PeopleSection>
          <PeopleInner>
            <PeopleTag>PEOPLE × TRUST</PeopleTag>
            <PeopleTitle>결국, 신뢰는 사람으로 완성됩니다</PeopleTitle>
            <PeopleParagraph>
              페슈의원의 의료진과 직원들은 정직한 설명으로 환자가 올바른 선택을 할 수 있도록
              돕습니다. 개인에게 가장 효과적인 시술을 고민하고, 전문성을 바탕으로 신중하게
              진료합니다. 또한 진심 어린 응대와 세심한 배려 속에서도, 때로는 단호하게 신뢰의 가치를
              지켜나갑니다.
            </PeopleParagraph>

            <PeopleGrid>
              {people.map((src, i) => (
                <PersonCard key={i}>
                  <PersonImage src={src} alt={`person${i + 1}`} />
                </PersonCard>
              ))}
            </PeopleGrid>
          </PeopleInner>
        </PeopleSection>
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
                    <SolidButton tw="bg-[#B15E47]">카카오톡 상담하기</SolidButton>
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
      </PageContainer>
    </Page>
  )
}

export default Intro
