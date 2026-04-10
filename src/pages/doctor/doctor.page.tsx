import tw, { styled } from "twin.macro"
import Page from "@/lib/components/layout/page.component"

import doctorIntro from "@/assets/images/doctor-intro.png"
import doctorExperience from "@/assets/images/doctor-experience.png"
import doctorAhnProfile from "@/assets/images/doctor-ahn-profile.png"
import doctorChoiProfile from "@/assets/images/doctor-choi-profile.png"
import doctorShinProfile from "@/assets/images/doctor-shin-profile.png"
import doctorDataBased from "@/assets/images/doctor-data-based.png"
import doctorCommunication from "@/assets/images/doctor-communication.png"
import doctorAhnSign from "@/assets/images/doctor-ahn-sign.png"

const PageContainer = tw.div`w-full flex flex-col items-center bg-white`

/* PC: column, center, gap=160, padding=160 0
   MO: gap=64, padding=64 0 */
const ContentContainer = styled.div`
  ${tw`w-full flex flex-col items-center`}
  gap: 64px;
  padding: 64px 0;

  @media (min-width: 768px) {
    gap: 160px;
    padding: 80px 0 160px;
  }
`

/* ── Section 1: 소개 ──
   PC: row, center, padding=0 120, gap=64
   MO: row wrap, padding=0 16, gap=48 */
const Section1 = styled.section`
  ${tw`w-full max-w-[1440px] flex flex-row flex-wrap justify-center items-center`}
  gap: 48px;
  padding: 0 16px;

  @media (min-width: 768px) {
    ${tw`flex-nowrap`}
    gap: 64px;
    padding: 0 120px;
  }
`
/* PC: 568x568  MO: 328x328 */
const IntroImage = styled.img`
  ${tw`flex-shrink-0 object-cover`}
  width: 328px;
  height: 328px;

  @media (min-width: 768px) {
    width: 568px;
    height: 568px;
  }
`
/* PC: column, gap=32  MO: column, gap=16 */
const IntroTextBlock = styled.div`
  ${tw`flex flex-col justify-center`}
  gap: 16px;
  width: 328px;

  @media (min-width: 768px) {
    gap: 32px;
    width: auto;
  }
`
/* PC: column, gap=16  MO: column, gap=12 */
const IntroTextGroup = styled.div`
  ${tw`flex flex-col`}
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`
/* PC: 600/40px  MO: 600/32px, #DA7F67 */
const IntroTitle = tw.h2`
  text-[32px] md:text-[40px] font-pretendard font-semibold text-primary tracking-tight leading-[1.4] whitespace-pre-line
`
/* PC: column, gap=16  MO: column, gap=8 */
const IntroBodyGroup = styled.div`
  ${tw`flex flex-col`}
  gap: 8px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`
/* PC: 500/18px  MO: 500/16px, #666666 */
const IntroBody = tw.p`
  text-[16px] md:text-[18px] font-pretendard font-medium text-neutral70 tracking-tight leading-[1.5] whitespace-pre-line
`
/* PC: row, gap=12  MO: row, gap=8 */
const DoctorSignBlock = styled.div`
  ${tw`flex items-center`}
  gap: 8px;

  @media (min-width: 768px) {
    gap: 12px;
  }
`
/* PC: 600/18px  MO: 600/16px, #121212 */
const DoctorSignName = tw.span`
  text-[16px] md:text-[18px] font-pretendard font-semibold text-neutralBlack tracking-tight leading-[1.4]
`
/* 100x50 */
const DoctorSignImage = tw.img`
  w-[100px] h-[50px] object-contain
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
/* PC: row, gap=64  MO: row wrap, gap=24 */
const DoctorCardRow = styled.div`
  ${tw`flex flex-row flex-wrap justify-center items-center`}
  gap: 24px;

  @media (min-width: 768px) {
    gap: 64px;
  }
`
/* PC: column, gap=20  MO: column, gap=12 */
const DoctorCard = styled.div`
  ${tw`flex flex-col items-center cursor-pointer`}
  gap: 12px;

  @media (min-width: 768px) {
    gap: 20px;
  }
`
/* PC: 300x307  MO: 240x246 */
const DoctorCardImage = styled.img`
  ${tw`object-cover`}
  width: 240px;
  height: 246px;

  @media (min-width: 768px) {
    width: 300px;
    height: 307px;
  }
`
/* PC: 600/18px  MO: 600/16px, center, #4D4D4D */
const DoctorCardName = tw.p`
  text-[16px] md:text-[18px] font-pretendard font-semibold text-neutral80 tracking-tight leading-[1.4] text-center
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
  return (
    <Page hiddenFooter={false} bottomCartExists={false}>
      <PageContainer>
        <ContentContainer>
          {/* Section 1: 소개 */}
          <Section1>
            <IntroImage src={doctorIntro} alt="안태언 대표원장" />
            <IntroTextBlock>
              <IntroTextGroup>
                <IntroTitle>{"신뢰할 수 있는\n페슈의원 의료진"}</IntroTitle>
                <IntroBodyGroup>
                  <IntroBody>
                    {
                      "페슈의원의 의료진은 6만 건 이상의 임상 노하우를 바탕으로\n개별 특성을 파악해 최상의 결과를 만드는 전문성을 가지고 신중하게 진료합니다."
                    }
                  </IntroBody>
                  <IntroBody>
                    더불어 진심 어린 소통과 세심한 배려 속에 신뢰의 가치를
                    지켜나갑니다.
                  </IntroBody>
                </IntroBodyGroup>
              </IntroTextGroup>
              <DoctorSignBlock>
                <DoctorSignName>안태언 대표원장</DoctorSignName>
                <DoctorSignImage src={doctorAhnSign} alt="안태언 서명" />
              </DoctorSignBlock>
            </IntroTextBlock>
          </Section1>

          {/* Section 2: 이미지 + 텍스트 */}
          <Section2Wrapper>
            <Section2Image src={doctorExperience} alt="시술 경험" />
            <Section2TextSection>
              <Section2Title>
                6만 건 이상의 시술 경험에 기반한 &apos;예측 가능함&apos;
              </Section2Title>
              <Section2BodyGroup>
                <Section2Body>
                  {
                    "6만 건이 넘는 임상 경험을 데이터화하여\n모든 의료진이 최고의 시술 퀄리티를 유지하도록 매뉴얼화했습니다."
                  }
                </Section2Body>
                <Section2Body>
                  {
                    "매주 진행되는 전 의료진, 간호, 상담 팀의 교육을 통해\n개인별 피부 상태의 정교한 판별 능력과 섬세한 손기술을 심화합니다."
                  }
                </Section2Body>
                <Section2Body>
                  페슈의원 의료진은 개인의 가장 자연스럽고 확실한 변화를
                  추구합니다.
                </Section2Body>
              </Section2BodyGroup>
            </Section2TextSection>
          </Section2Wrapper>

          {/* Section 3: 의료진 카드 */}
          <Section3>
            <Section3Title>의료진</Section3Title>
            <DoctorCardRow>
              <DoctorCard>
                <DoctorCardImage
                  src={doctorAhnProfile}
                  alt="안태언 대표원장"
                />
                <DoctorCardName>안태언 대표원장</DoctorCardName>
              </DoctorCard>
              <DoctorCard>
                <DoctorCardImage
                  src={doctorChoiProfile}
                  alt="최재형 총괄원장"
                />
                <DoctorCardName>최재형 총괄원장</DoctorCardName>
              </DoctorCard>
              <DoctorCard>
                <DoctorCardImage
                  src={doctorShinProfile}
                  alt="신동민 원장"
                />
                <DoctorCardName>신동민 원장</DoctorCardName>
              </DoctorCard>
            </DoctorCardRow>
          </Section3>

          {/* Section 4: 시술 원칙 */}
          <Section4>
            <Section4TitleBlock>
              <Section4Title>최상의 결과만을 추구하는 시술 원칙</Section4Title>
              <Section4Desc>
                {
                  "페슈의원의 의료진은 대표원장이 원하는 시술 퀄리티를\n만족시켜야 시술 자격을 얻을 수 있습니다.\n\n6만 건 이상의 경험을 분석해 만든 체계적인 프로토콜을 공유하기에,\n어떤 의료진을 만나도 최상의 시술 결과를 경험하실 수 있습니다."
                }
              </Section4Desc>
            </Section4TitleBlock>
            <PrincipleRow>
              <PrincipleCard>
                <PrincipleImage
                  src={doctorDataBased}
                  alt="데이터 기반 진료"
                />
                <PrincipleContentBlock>
                  <PrincipleTitle>감이 아닌 데이터 기반 진료</PrincipleTitle>
                  <PrincipleBody>
                    {
                      "3D 메타뷰 진단을 통해 개인의 피부 상태를 시각적으로 보여드립니다. 시술의 필요성과 기대 효과를 상세히 알려드리며 최적의 시술 효과를 만들어냅니다."
                    }
                  </PrincipleBody>
                </PrincipleContentBlock>
              </PrincipleCard>
              <PrincipleCard>
                <PrincipleImage
                  src={doctorCommunication}
                  alt="시술 중 소통"
                />
                <PrincipleContentBlock>
                  <PrincipleTitle>
                    시술 중 통증 및 감각에 대한 소통
                  </PrincipleTitle>
                  <PrincipleBody>
                    {
                      "말없이 진행되는 시술이 주는 막연한 두려움을 잘 알기에, 현재 진행 단계, 남은 시간, 예상되는 통증의 크기를 끊임없이 공유하며 개인에 따라 시술의 강도, 용량 등을 조절하여 최대 시술 효과를 얻을 수 있도록 합니다."
                    }
                  </PrincipleBody>
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
