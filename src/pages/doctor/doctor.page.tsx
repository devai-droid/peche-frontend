import tw, { styled } from "twin.macro"
import Page from "@/lib/components/layout/page.component"
import { useTranslation } from "react-i18next"

import doctorIntro from "@/assets/images/doctor-intro.png"
import doctorExperience from "@/assets/images/doctor-experience.png"
import doctorAhnProfile from "@/assets/images/doctor-ahn-profile.jpg"
import doctorChoiProfile from "@/assets/images/doctor-choi-profile.jpg"
import doctorShinProfile from "@/assets/images/doctor-shin-profile.jpg"
import doctorParkProfile from "@/assets/images/doctor-park-profile.jpg"
import doctorChoProfile from "@/assets/images/doctor-cho-profile.jpg"
import doctorHongProfile from "@/assets/images/doctor-hong-profile.jpg"
import doctorDataBased from "@/assets/images/doctor-data-based.png"
import doctorCommunication from "@/assets/images/doctor-communication.png"

const PageContainer = tw.div`w-full flex flex-col items-center bg-white`

/* PC: column, center, gap=160, padding=160 0
   MO: gap=64, padding=64 0 */
const ContentContainer = styled.div`
  ${tw`w-full flex flex-col items-center`}
  gap: 64px;
  padding: 128px 0 64px;

  @media (min-width: 768px) {
    gap: 160px;
    padding: 128px 0 160px;
  }
`

/* ── Section 1: 소개 (페슈의원 소개와 동일 구조) ── */
const Section1 = tw.section`
  w-full max-w-[1440px] mx-auto px-6 md:px-10
  flex flex-col lg:flex-row justify-between
  gap-8 lg:gap-20 xl:gap-28
`
const IntroTextBlock = tw.div`
  w-full lg:w-1/2 flex flex-col
  justify-center
  lg:h-[520px]
`
const IntroTitle = styled.h2`
  ${tw`text-[32px] md:text-[40px] font-semibold leading-[1.4] font-pretendard tracking-tight whitespace-pre-line`}
`
const IntroParagraphBlock = styled.div`
  ${tw`flex flex-col`}
  margin-top: 16px;
  gap: 8px;

  @media (min-width: 768px) {
    margin-top: 24px;
    gap: 16px;
  }
`
const IntroBody = tw.p`
  text-[16px] md:text-[18px] leading-[1.5] text-neutral70 tracking-tight
  font-pretendard whitespace-pre-line
`
const IntroImage = styled.img`
  ${tw`
    w-full lg:w-[520px] xl:w-[520px]
    aspect-square
    object-cover rounded-none
  `}
`
/* row, gap=14, items center (가운데 정렬) */
const DoctorNameBlock = styled.div`
  ${tw`flex flex-row items-center`}
  gap: 14px;
  margin-top: 24px;

  @media (min-width: 768px) {
    margin-top: 32px;
  }
`
/* Pretendard 700 30px, ls=+2%, #121212 */
const DoctorName = styled.span`
  ${tw`text-[24px] md:text-[30px] font-pretendard font-bold text-neutralBlack tracking-[0.02em]`}
  line-height: 1;
`
/* Pretendard 400 18px, ls=+2%, #121212 */
const DoctorPosition = styled.span`
  ${tw`text-[16px] md:text-[18px] font-pretendard font-normal text-neutralBlack tracking-[0.02em]`}
  line-height: 1;
  transform: translateY(3px);

  @media (min-width: 768px) {
    transform: translateY(5px);
  }
`

/* ── Section 2: 이미지 + 텍스트 ──
   PC/MO: column, align-stretch, width=fill */
const Section2Wrapper = tw.section`
  w-full flex flex-col items-stretch
`
/* PC: height=540  MO: height=400 */
const Section2Image = styled.img`
  ${tw`w-full object-cover`}
  height: 400px;

  @media (min-width: 768px) {
    height: 540px;
  }
`
/* PC: padding=64 120 96, gap=16  MO: padding=48 16, gap=12 */
const Section2TextSection = styled.div`
  ${tw`w-full flex flex-col justify-center items-center bg-tertiary`}
  gap: 12px;
  padding: 48px 16px;

  @media (min-width: 768px) {
    gap: 16px;
    padding: 64px 120px 96px;
  }
`
/* PC: 600/30px  MO: 600/24px, #121212, center */
const Section2Title = tw.h2`
  text-[24px] md:text-[30px] font-pretendard font-semibold text-neutralBlack tracking-tight leading-[1.4] text-center
`
/* PC: column, gap=16  MO: column, gap=8(from body group) */
const Section2BodyGroup = styled.div`
  ${tw`flex flex-col`}
  gap: 8px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`
/* PC: 500/16px  MO: 500/14px, #666666, center */
const Section2Body = tw.p`
  text-[14px] md:text-[16px] font-pretendard font-medium text-neutral70 tracking-tight leading-[1.5] text-center whitespace-pre-line
`

/* ── Section 3: 의료진 카드 ──
   PC: padding=0 120, gap=40  MO: padding=0 16, gap=24 */
const Section3 = styled.section`
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
const DoctorCardImage = styled.img`
  ${tw`w-full h-auto block object-cover`}
`

/* ── Section 4: 시술 원칙 ──
   PC: column, gap=64  MO: column, gap=48 */
const Section4 = styled.section`
  ${tw`w-full max-w-[1440px] flex flex-col items-stretch`}
  gap: 48px;

  @media (min-width: 768px) {
    gap: 64px;
  }
`
/* PC: padding=0 120, gap=16  MO: padding=0 16, gap=12 */
const Section4TitleBlock = styled.div`
  ${tw`text-center flex flex-col`}
  gap: 12px;
  padding: 0 16px;

  @media (min-width: 768px) {
    gap: 16px;
    padding: 0 120px;
  }
`
/* PC: 600/30px  MO: 600/24px, center, #121212 */
const Section4Title = tw.h2`
  text-[24px] md:text-[30px] font-pretendard font-semibold text-neutralBlack tracking-tight leading-[1.4]
`
/* PC: 400/16px  MO: 400/14px, center, #666666 */
const Section4Desc = tw.p`
  text-[14px] md:text-[16px] font-pretendard font-normal text-neutral70 tracking-tight leading-[1.5] whitespace-pre-line
`
/* PC: row, padding=0 120, gap=64  MO: row wrap, padding=0 16, gap=48 */
const PrincipleRow = styled.div`
  ${tw`flex flex-row flex-wrap justify-center`}
  gap: 48px;
  padding: 0 16px;

  @media (min-width: 768px) {
    gap: 64px;
    padding: 0 120px;
  }
`
/* PC: column, gap=40, width=568  MO: column, gap=24, padding=0 16 */
const PrincipleCard = styled.div`
  ${tw`flex flex-col`}
  gap: 24px;
  padding: 0 16px;

  @media (min-width: 768px) {
    gap: 40px;
    width: 568px;
    padding: 0;
  }
`
/* PC: 568x320  MO: 328x185 */
const PrincipleImage = styled.img`
  ${tw`w-full object-cover`}
  height: 185px;

  @media (min-width: 768px) {
    height: 320px;
  }
`
/* PC: column, gap=16  MO: column, gap=12(from textGroup) */
const PrincipleContentBlock = styled.div`
  ${tw`flex flex-col`}
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`
/* PC: 600/22px  MO: 600/18px, #DA7F67 */
const PrincipleTitle = tw.h3`
  text-[18px] md:text-[22px] font-pretendard font-semibold text-primary tracking-tight leading-[1.4]
`
/* PC: 400/16px  MO: 400/14px, #666666 */
const PrincipleBody = tw.p`
  text-[14px] md:text-[16px] font-pretendard font-normal text-neutral70 tracking-tight leading-[1.5]
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
            <IntroImage src={doctorIntro} alt="안태언 대표원장" />

            <IntroTextBlock>
              <IntroTitle>
                {t("doctor.introTitlePrefix")}
                <span tw="text-primary">{t("doctor.introTitleHighlight")}</span>
                {t("doctor.introTitleSuffix")}
              </IntroTitle>

              <IntroParagraphBlock>
                <IntroBody>{t("doctor.introBody1")}</IntroBody>
                <IntroBody>{t("doctor.introBody2")}</IntroBody>
              </IntroParagraphBlock>

              <DoctorNameBlock>
                <DoctorName>{t("doctor.introSignName")}</DoctorName>
                <DoctorPosition>{t("doctor.introSignPosition")}</DoctorPosition>
              </DoctorNameBlock>
            </IntroTextBlock>
          </Section1>

          {/* Section 2: 이미지 + 텍스트 */}
          <Section2Wrapper>
            <Section2Image src={doctorExperience} alt="시술 경험" />
            <Section2TextSection>
              <Section2Title>{t("doctor.section2Title")}</Section2Title>
              <Section2BodyGroup>
                <Section2Body>{t("doctor.section2Body1")}</Section2Body>
                <Section2Body>{t("doctor.section2Body2")}</Section2Body>
                <Section2Body>{t("doctor.section2Body3")}</Section2Body>
              </Section2BodyGroup>
            </Section2TextSection>
          </Section2Wrapper>

          {/* Section 3: 의료진 카드 */}
          <Section3>
            <Section3Title>{t("doctor.teamTitle")}</Section3Title>
            {/* 대표·총괄원장 — 2명, 아랫줄과 같은 폭으로 중앙 정렬 */}
            <DoctorCardRowLead>
              <DoctorCardLead>
                <DoctorCardImage src={doctorAhnProfile} alt="안태언 대표원장" />
              </DoctorCardLead>
              <DoctorCardLead>
                <DoctorCardImage src={doctorChoiProfile} alt="최재형 총괄원장" />
              </DoctorCardLead>
            </DoctorCardRowLead>
            {/* 나머지 원장 — 한 줄 4명(모바일 2명): 신동민·박해권·조진형·홍채민 */}
            <DoctorCardRowRest>
              <DoctorCard>
                <DoctorCardImage src={doctorShinProfile} alt="신동민 원장" />
              </DoctorCard>
              <DoctorCard>
                <DoctorCardImage src={doctorParkProfile} alt="박해권 원장" />
              </DoctorCard>
              <DoctorCard>
                <DoctorCardImage src={doctorChoProfile} alt="조진형 원장" />
              </DoctorCard>
              <DoctorCard>
                <DoctorCardImage src={doctorHongProfile} alt="홍채민 원장" />
              </DoctorCard>
            </DoctorCardRowRest>
          </Section3>

          {/* Section 4: 시술 원칙 */}
          <Section4>
            <Section4TitleBlock>
              <Section4Title>{t("doctor.principleTitle")}</Section4Title>
              <Section4Desc>{t("doctor.principleDesc")}</Section4Desc>
            </Section4TitleBlock>
            <PrincipleRow>
              <PrincipleCard>
                <PrincipleImage
                  src={doctorDataBased}
                  alt="데이터 기반 진료"
                />
                <PrincipleContentBlock>
                  <PrincipleTitle>{t("doctor.principle1Title")}</PrincipleTitle>
                  <PrincipleBody>{t("doctor.principle1Body")}</PrincipleBody>
                </PrincipleContentBlock>
              </PrincipleCard>
              <PrincipleCard>
                <PrincipleImage
                  src={doctorCommunication}
                  alt="시술 중 소통"
                />
                <PrincipleContentBlock>
                  <PrincipleTitle>{t("doctor.principle2Title")}</PrincipleTitle>
                  <PrincipleBody>{t("doctor.principle2Body")}</PrincipleBody>
                </PrincipleContentBlock>
              </PrincipleCard>
            </PrincipleRow>
          </Section4>
        </ContentContainer>
      </PageContainer>
    </Page>
  )
}

export default DoctorPage
