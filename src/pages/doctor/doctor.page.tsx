import tw, { styled } from "twin.macro"
import Page from "@/lib/components/layout/page.component"
import { useTranslation } from "react-i18next"

import doctorAhnProfile from "@/assets/images/doctor-ahn-profile.jpg"
import doctorChoiProfile from "@/assets/images/doctor-choi-profile.jpg"
import doctorShinProfile from "@/assets/images/doctor-shin-profile.jpg"
import doctorParkProfile from "@/assets/images/doctor-park-profile.jpg"
import doctorChoProfile from "@/assets/images/doctor-cho-profile.jpg"
import doctorHongProfile from "@/assets/images/doctor-hong-profile.jpg"
import principleSkill1 from "@/assets/images/principle-skill-1.jpg"
import principleSkill2 from "@/assets/images/principle-skill-2.jpg"
import principleService1 from "@/assets/images/principle-service-1.jpg"
import principleService2 from "@/assets/images/principle-service-2.jpg"

const PageContainer = tw.div`w-full flex flex-col items-center bg-white`

/* PC: column, center, gap=160, padding=160 0
   MO: gap=64, padding=64 0 */
const ContentContainer = styled.div`
  ${tw`w-full flex flex-col items-center`}
  padding-top: 128px;
`

/* ── Section 1: 소개 ──
   제목·리드문은 가운데 정렬, 그 아래 진료 기준 3단계를 카드로 나열한다.
   PC: padding=0 120, MO: padding=0 16 */
const Section1 = styled.section`
  ${tw`w-full max-w-[1440px] mx-auto flex flex-col items-center`}
  padding: 0 16px;

  @media (min-width: 768px) {
    padding: 0 120px;
  }
`
const IntroTextBlock = tw.div`
  w-full flex flex-col items-center text-center
`
const IntroTitle = styled.h2`
  ${tw`text-[28px] md:text-[40px] font-semibold leading-[1.4] font-pretendard text-neutralBlack tracking-tight whitespace-pre-line`}
`
const IntroParagraphBlock = styled.div`
  ${tw`flex flex-col items-center`}
  margin-top: 16px;
  gap: 8px;

  @media (min-width: 768px) {
    margin-top: 24px;
    gap: 16px;
  }
`
/* 모바일은 지정한 위치에서 줄을 나누고, PC는 한 줄로 흘린다 */
const IntroBody = tw.p`
  text-[16px] md:text-[18px] leading-[1.6] text-neutral70 tracking-tight
  font-pretendard whitespace-pre-line md:whitespace-normal
`
/* 진료 기준 3단계 — PC 3열, 모바일 1열 */
const StandardGrid = styled.div`
  ${tw`w-full grid grid-cols-1 md:grid-cols-3 items-stretch`}
  gap: 16px;
  margin-top: 40px;

  @media (min-width: 768px) {
    gap: 20px;
    margin-top: 64px;
  }
`
/* 테두리만 메인 컬러, 배경은 흰색 */
const StandardCard = styled.div`
  ${tw`flex flex-col border border-primary bg-white`}
  gap: 10px;
  padding: 28px 24px 30px;

  @media (min-width: 768px) {
    gap: 12px;
    padding: 36px 32px 40px;
  }
`
const StandardCardStep = tw.span`
  text-[18px] md:text-[20px] font-pretendard font-bold text-primary tracking-tight leading-none
`
/* 카드 제목: 검은색, 강조는 테두리 색으로만 준다 */
const StandardCardTitle = tw.h3`
  text-[18px] md:text-[20px] font-pretendard font-semibold text-neutralBlack tracking-tight leading-[1.45]
`
const StandardCardBody = tw.p`
  text-[14px] md:text-[16px] font-pretendard font-normal text-neutral70 tracking-tight leading-[1.6]
`

/* ── Section 3: 의료진 카드 ──
   PC: padding=0 120, gap=40  MO: padding=0 16, gap=24 */
/* 배경은 화면 가로 전체(full-bleed), 내용은 1440 컨테이너로 제한 */
const Section3 = styled.section`
  ${tw`w-full flex flex-col items-center`}
  background-color: #fff7ee;
  padding: 96px 0;
  margin-top: 96px;

  @media (min-width: 768px) {
    margin-top: 140px;
  }
`
const Section3Inner = styled.div`
  ${tw`w-full max-w-[1440px] flex flex-col items-center`}
  gap: 24px;
  padding: 0 16px;

  @media (min-width: 768px) {
    gap: 40px;
    padding: 0 120px;
  }
`
/* PC: 600/30px  MO: 600/24px, center, #121212 */
const Section3Title = tw.h2`
  text-[24px] md:text-[30px] font-pretendard font-semibold text-neutralBlack tracking-tight leading-[1.4] text-center
`
/* 대표·총괄원장: 2명, 아랫줄과 같은 폭으로 중앙 정렬 */
const DoctorCardRowLead = styled.div`
  ${tw`flex justify-center items-start w-full`}
  gap: 20px;
`
/* 나머지 원장: PC 한 줄에 4명, 모바일 2명 (세로형 사진) */
const DoctorCardRowRest = styled.div`
  ${tw`grid grid-cols-2 md:grid-cols-4 items-start w-full`}
  gap: 20px;
  margin-top: 20px;
`
const DoctorCard = styled.div`
  ${tw`flex flex-col items-center w-full`}
  gap: 12px;

  @media (min-width: 768px) {
    gap: 20px;
  }
`
/* 대표·총괄 카드: 아랫줄 한 칸과 동일 폭(모바일 2열·PC 4열 기준)으로 고정 */
const DoctorCardLead = styled.div`
  ${tw`flex flex-col items-center`}
  gap: 12px;
  width: calc((100% - 20px) / 2);

  @media (min-width: 768px) {
    gap: 20px;
    width: calc((100% - 60px) / 4);
  }
`
/* 컨테이너 가로 폭을 꽉 채우고 원본 비율 유지 */
/* 모든 원장 사진을 동일한 세로(3:4) 프레임으로 통일. 가로형 원본은 세로로 crop된다. */
const DoctorCardImage = styled.img`
  ${tw`w-full block object-cover`}
  aspect-ratio: 570 / 760;
`
const DoctorCardName = tw.p`
  text-[16px] md:text-[18px] font-pretendard font-semibold text-neutral80 tracking-tight leading-[1.4] text-center
`

/* ── Section 3.5: 예약 전 고민 ──
   말풍선 3개(좌·우·좌)로 고민을 꺼내고, 아래 한 문장으로 답한다.
   바탕은 가운데만 은은하게 물들여 위아래 섹션과 경계를 남긴다. */
const WorrySection = styled.section`
  ${tw`relative w-full flex flex-col items-center bg-white overflow-hidden`}
  padding: 96px 16px;

  @media (min-width: 768px) {
    padding: 96px 120px;
  }
`
/* 다른 섹션 제목과 같은 크기·굵기 */
const WorryTitle = styled.h2`
  ${tw`relative text-[24px] md:text-[30px] font-pretendard font-semibold text-neutralBlack tracking-tight leading-[1.4] text-center whitespace-pre-line`}
  margin-bottom: 56px;

  @media (min-width: 768px) {
    /* PC에서는 줄바꿈을 공백으로 흘려 한 줄로 둔다 */
    ${tw`whitespace-normal`}
    margin-bottom: 72px;
  }
`
const WorryInner = styled.div`
  ${tw`relative w-full flex flex-col items-center`}
  max-width: 620px;
`
const PillStack = styled.div`
  ${tw`w-full flex flex-col`}
  gap: 10px;
`
const PillRow = styled.div`
  ${tw`flex`}
`
const PillRowRight = styled(PillRow)`
  ${tw`justify-end`}
`
/* 알약 모양 말풍선 + 아래쪽 꼬리 */
const Pill = styled.span`
  ${tw`relative font-pretendard font-bold`}
  padding: 14px 20px;
  border-radius: 999px;
  font-size: 16px;
  line-height: 1.4;
  letter-spacing: -0.02em;

  &::after {
    content: "";
    position: absolute;
    bottom: -7px;
    left: 22px;
    width: 18px;
    height: 15px;
    background: inherit;
    clip-path: polygon(0 0, 100% 0, 8% 100%);
  }

  @media (min-width: 768px) {
    padding: 18px 30px;
    font-size: 20px;
    white-space: nowrap;

    &::after {
      bottom: -9px;
      left: 30px;
      width: 22px;
      height: 18px;
    }
  }
`
const PillDark = styled(Pill)`
  ${tw`bg-neutralBlack text-white`}
`
const PillPlain = styled(Pill)`
  ${tw`bg-tertiary text-neutralBlack`}

  &::after {
    left: auto;
    right: 22px;
    clip-path: polygon(0 0, 100% 0, 92% 100%);
  }

  @media (min-width: 768px) {
    &::after {
      right: 30px;
    }
  }
`
const PillBrand = styled(Pill)`
  ${tw`bg-primary text-white`}
`
/* 제목 아래 여백과 같은 값으로 맞춘다 */
const WorryAnswer = styled.div`
  ${tw`flex flex-col items-center text-center`}
  gap: 14px;
  margin-top: 56px;

  @media (min-width: 768px) {
    gap: 16px;
    margin-top: 72px;
  }
`
const WorryAnswerTitle = tw.h2`
  text-[24px] md:text-[30px] font-pretendard font-bold text-neutralBlack
  tracking-tight leading-[1.4]
`
const WorryAnswerAccent = tw.span`
  text-primary
`

/* ── Section 4: 시술 원칙 ──
   배경은 화면 가로 전체(full-bleed), 내용은 1440 컨테이너로 제한 */
const Section4 = styled.section`
  ${tw`w-full flex flex-col items-center`}
  background-color: #fafafa;
  padding: 80px 0 96px;

  @media (min-width: 768px) {
    padding: 96px 0 120px;
  }
`
const Section4Inner = styled.div`
  ${tw`w-full max-w-[1440px] flex flex-col items-stretch`}
  gap: 48px;

  @media (min-width: 768px) {
    gap: 72px;
  }
`
/* PC: padding=0 120, gap=16  MO: padding=0 16, gap=12 */
const Section4TitleBlock = styled.div`
  ${tw`text-center flex flex-col`}
  gap: 16px;
  padding: 0 16px;

  @media (min-width: 768px) {
    gap: 24px;
    padding: 0 120px;
  }
`
/* PC: 600/30px  MO: 600/24px, center, #121212 */
/* 줄바꿈 위치가 PC와 모바일이 달라 두 벌로 나눈다 */
const Section4Title = tw.h2`
  hidden md:block
  text-[30px] font-pretendard font-semibold text-neutralBlack tracking-tight leading-[1.4]
`
const Section4TitleMobile = tw.h2`
  block md:hidden
  text-[24px] font-pretendard font-semibold text-neutralBlack tracking-tight leading-[1.4] whitespace-pre-line
`
/* PC: 400/16px  MO: 400/14px, center, #666666 */
/* 줄바꿈 위치가 PC와 모바일이 달라 두 벌로 나눈다 */
const Section4Desc = tw.p`
  hidden md:block
  text-[14px] md:text-[16px] font-pretendard font-normal text-neutral70 tracking-tight leading-[1.5] whitespace-pre-line
`
const Section4DescMobile = tw.p`
  block md:hidden
  text-[14px] font-pretendard font-normal text-neutral70 tracking-tight leading-[1.5] whitespace-pre-line
`
/* 네 항목을 한 격자에 — PC 2열, 모바일 1열 */
const PrincipleGrid = styled.div`
  ${tw`grid grid-cols-1 md:grid-cols-2 items-start`}
  gap: 48px 20px;
  padding: 0 16px;

  @media (min-width: 768px) {
    gap: 64px 20px;
    padding: 0 120px;
  }
`
/* 제목 앞 번호 — 제목과 같은 크기 */
const PrincipleNo = tw.span`
  text-[17px] md:text-[19px] font-pretendard font-bold text-primary tracking-tight leading-[1.45]
`
const PrincipleItem = styled.div`
  ${tw`flex flex-col`}
  gap: 10px;
`
/* 감싸개가 590x333 비율을 갖고, 이미지는 그 안을 채운다 */
const PrincipleImageWrap = styled.div`
  ${tw`relative w-full overflow-hidden`}
  aspect-ratio: 590 / 333;
`
const PrincipleImage = tw.img`
  absolute inset-0 w-full h-full object-cover bg-neutral20
`
/* 분류 배지 — 사진 우측 하단 모서리에 붙인다. 모서리는 각지게 */
const PrincipleBadge = styled.span`
  ${tw`absolute bottom-0 right-0 inline-flex items-center justify-center bg-neutralBlack text-white font-pretendard font-semibold tracking-tight`}
  height: 30px;
  min-width: 82px;
  padding: 0 10px;
  font-size: 11px;
  line-height: 30px;

  @media (min-width: 768px) {
    height: 40px;
    min-width: 100px;
    padding: 0 12px;
    font-size: 13px;
    line-height: 40px;
  }
`
/* 모바일: 번호는 왼쪽 열, 제목과 결과는 오른쪽 열에 위아래로 놓아 시작점을 맞춘다
   PC: 번호·제목·결과를 한 줄로 흘린다 */
const PrincipleTitleBlock = styled.div`
  ${tw`grid items-start`}
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 8px;
  row-gap: 4px;
  margin-top: 8px;

  @media (min-width: 768px) {
    ${tw`flex flex-row flex-wrap items-center`}
    gap: 8px;
    margin-top: 14px;
  }
`
/* 무엇을 훈련하는가 — 검은색 */
const PrincipleTitle = tw.h3`
  text-[17px] md:text-[19px] font-pretendard font-bold text-neutralBlack tracking-tight leading-[1.45]
`
/* 환자가 무엇을 얻는가 — 메인 컬러 */
const PrincipleResult = styled.span`
  ${tw`inline-flex items-center text-[17px] md:text-[19px] font-pretendard font-semibold text-primary tracking-tight leading-[1.45]`}
  gap: 8px;
  grid-column: 2;

  @media (min-width: 768px) {
    grid-column: auto;
  }
`
/* 오른쪽 화살표 — 끝을 각지게 처리한다 */
const ResultArrow = styled.svg`
  ${tw`flex-none text-primary`}
  width: 18px;
  height: 18px;
`
const PrincipleBody = tw.p`
  text-[14px] md:text-[16px] font-pretendard font-normal text-neutral70 tracking-tight leading-[1.6]
`

/* ── Doctor Page ── */
const DoctorPage = () => {
  const { t } = useTranslation()

  return (
    <Page hiddenFooter={false} bottomCartExists={false}>
      <PageContainer>
        <ContentContainer>
          {/* Section 1: 소개 */}
          <Section1>
            <IntroTextBlock>
              <IntroTitle>
                {t("doctor.introTitlePrefix")}
                {t("doctor.introTitleHighlight")}
                {t("doctor.introTitleSuffix")}
              </IntroTitle>

              <IntroParagraphBlock>
                <IntroBody>{t("doctor.introLead")}</IntroBody>
              </IntroParagraphBlock>
            </IntroTextBlock>

            {/* 진료 기준 3단계: 문서화 → 자격 부여 → 주간 교육 */}
            <StandardGrid>
              <StandardCard>
                <StandardCardStep>01</StandardCardStep>
                <StandardCardTitle>{t("doctor.standard1Title")}</StandardCardTitle>
                <StandardCardBody>{t("doctor.standard1Body")}</StandardCardBody>
              </StandardCard>
              <StandardCard>
                <StandardCardStep>02</StandardCardStep>
                <StandardCardTitle>{t("doctor.standard2Title")}</StandardCardTitle>
                <StandardCardBody>{t("doctor.standard2Body")}</StandardCardBody>
              </StandardCard>
              <StandardCard>
                <StandardCardStep>03</StandardCardStep>
                <StandardCardTitle>{t("doctor.standard3Title")}</StandardCardTitle>
                <StandardCardBody>{t("doctor.standard3Body")}</StandardCardBody>
              </StandardCard>
            </StandardGrid>
          </Section1>

          {/* Section 3: 의료진 카드 */}
          <Section3>
            <Section3Inner>
              <Section3Title>{t("doctor.teamTitle")}</Section3Title>
              {/* 대표·총괄원장 — 2명, 아랫줄과 같은 폭으로 중앙 정렬 */}
              <DoctorCardRowLead>
                <DoctorCardLead>
                  <DoctorCardImage src={doctorAhnProfile} alt="안태언 대표원장" />
                  <DoctorCardName>{t("doctor.doctorAhn")}</DoctorCardName>
                </DoctorCardLead>
                <DoctorCardLead>
                  <DoctorCardImage src={doctorChoiProfile} alt="최재형 총괄원장" />
                  <DoctorCardName>{t("doctor.doctorChoi")}</DoctorCardName>
                </DoctorCardLead>
              </DoctorCardRowLead>
              {/* 나머지 원장 — 한 줄 4명(모바일 2명): 신동민·박해권·조진형·홍채민 */}
              <DoctorCardRowRest>
                <DoctorCard>
                  <DoctorCardImage src={doctorShinProfile} alt="신동민 원장" />
                  <DoctorCardName>{t("doctor.doctorShin")}</DoctorCardName>
                </DoctorCard>
                <DoctorCard>
                  <DoctorCardImage src={doctorParkProfile} alt="박해권 원장" />
                  <DoctorCardName>{t("doctor.doctorPark")}</DoctorCardName>
                </DoctorCard>
                <DoctorCard>
                  <DoctorCardImage src={doctorChoProfile} alt="조진형 원장" />
                  <DoctorCardName>{t("doctor.doctorCho")}</DoctorCardName>
                </DoctorCard>
                <DoctorCard>
                  <DoctorCardImage src={doctorHongProfile} alt="홍채민 원장" />
                  <DoctorCardName>{t("doctor.doctorHong")}</DoctorCardName>
                </DoctorCard>
              </DoctorCardRowRest>
            </Section3Inner>
          </Section3>

          {/* Section 3.5: 예약 전 고민 */}
          <WorrySection>
            <WorryTitle>{t("doctor.worryTitle")}</WorryTitle>
            <WorryInner>
              <PillStack>
                <PillRow>
                  <PillDark>{t("doctor.worry1")}</PillDark>
                </PillRow>
                <PillRowRight>
                  <PillPlain>{t("doctor.worry2")}</PillPlain>
                </PillRowRight>
                <PillRow>
                  <PillBrand>{t("doctor.worry3")}</PillBrand>
                </PillRow>
              </PillStack>

              <WorryAnswer>
                <WorryAnswerTitle>
                  {t("doctor.worryAnswerLine1")}
                  <br />
                  <WorryAnswerAccent>{t("doctor.worryAnswerLine2")}</WorryAnswerAccent>
                </WorryAnswerTitle>
              </WorryAnswer>
            </WorryInner>
          </WorrySection>

          {/* Section 4: 시술 원칙 */}
          <Section4>
            <Section4Inner>
              <Section4TitleBlock>
                <Section4Title>{t("doctor.principleTitle")}</Section4Title>
                <Section4TitleMobile>{t("doctor.principleTitleMobile")}</Section4TitleMobile>
                <Section4Desc>{t("doctor.principleDesc")}</Section4Desc>
                <Section4DescMobile>{t("doctor.principleDescMobile")}</Section4DescMobile>
              </Section4TitleBlock>

              <PrincipleGrid>
                <PrincipleItem>
                  <PrincipleImageWrap>
                    <PrincipleImage src={principleSkill1} alt="정확하게 진단하는 눈과 손기술" />
                    <PrincipleBadge>{t("doctor.principleGroup1")}</PrincipleBadge>
                  </PrincipleImageWrap>
                  <PrincipleTitleBlock>
                    <PrincipleNo>01</PrincipleNo>
                    <PrincipleTitle>{t("doctor.principle1Title")}</PrincipleTitle>
                    <PrincipleResult>
                      <ResultArrow viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path
                          d="M1 9h14"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="square"
                        />
                        <path
                          d="m10.5 4.5 4.5 4.5-4.5 4.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                        />
                      </ResultArrow>
                      {t("doctor.principle1Result")}
                    </PrincipleResult>
                  </PrincipleTitleBlock>
                  <PrincipleBody>{t("doctor.principle1Body")}</PrincipleBody>
                </PrincipleItem>
                <PrincipleItem>
                  <PrincipleImageWrap>
                    <PrincipleImage src={principleSkill2} alt="조직 손상을 줄이는 스킬" />
                    <PrincipleBadge>{t("doctor.principleGroup1")}</PrincipleBadge>
                  </PrincipleImageWrap>
                  <PrincipleTitleBlock>
                    <PrincipleNo>02</PrincipleNo>
                    <PrincipleTitle>{t("doctor.principle2Title")}</PrincipleTitle>
                    <PrincipleResult>
                      <ResultArrow viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path
                          d="M1 9h14"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="square"
                        />
                        <path
                          d="m10.5 4.5 4.5 4.5-4.5 4.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                        />
                      </ResultArrow>
                      {t("doctor.principle2Result")}
                    </PrincipleResult>
                  </PrincipleTitleBlock>
                  <PrincipleBody>{t("doctor.principle2Body")}</PrincipleBody>
                </PrincipleItem>
                <PrincipleItem>
                  <PrincipleImageWrap>
                    <PrincipleImage src={principleService1} alt="소통을 통한 에너지 및 용량 조절" />
                    <PrincipleBadge>{t("doctor.principleGroup2")}</PrincipleBadge>
                  </PrincipleImageWrap>
                  <PrincipleTitleBlock>
                    <PrincipleNo>03</PrincipleNo>
                    <PrincipleTitle>{t("doctor.principle3Title")}</PrincipleTitle>
                    <PrincipleResult>
                      <ResultArrow viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path
                          d="M1 9h14"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="square"
                        />
                        <path
                          d="m10.5 4.5 4.5 4.5-4.5 4.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                        />
                      </ResultArrow>
                      {t("doctor.principle3Result")}
                    </PrincipleResult>
                  </PrincipleTitleBlock>
                  <PrincipleBody>{t("doctor.principle3Body")}</PrincipleBody>
                </PrincipleItem>
                <PrincipleItem>
                  <PrincipleImageWrap>
                    <PrincipleImage src={principleService2} alt="개인별 진료 차트 필수 숙지" />
                    <PrincipleBadge>{t("doctor.principleGroup2")}</PrincipleBadge>
                  </PrincipleImageWrap>
                  <PrincipleTitleBlock>
                    <PrincipleNo>04</PrincipleNo>
                    <PrincipleTitle>{t("doctor.principle4Title")}</PrincipleTitle>
                    <PrincipleResult>
                      <ResultArrow viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path
                          d="M1 9h14"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="square"
                        />
                        <path
                          d="m10.5 4.5 4.5 4.5-4.5 4.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                        />
                      </ResultArrow>
                      {t("doctor.principle4Result")}
                    </PrincipleResult>
                  </PrincipleTitleBlock>
                  <PrincipleBody>{t("doctor.principle4Body")}</PrincipleBody>
                </PrincipleItem>
              </PrincipleGrid>
            </Section4Inner>
          </Section4>
        </ContentContainer>
      </PageContainer>
    </Page>
  )
}

export default DoctorPage
