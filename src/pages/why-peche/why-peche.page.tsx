import React from "react"
import tw, { styled } from "twin.macro"
import Page from "@/lib/components/layout/page.component"
import { useTranslation } from "react-i18next"
import KakaoMap from "@/lib/components/kakao-map/kakao-map.component"
import GoogleMapComponent from "@/lib/components/google-map/google-map.component"
import { useJsApiLoader } from "@react-google-maps/api"
import { Language } from "@/lib/locales/i18n.config"
import Modal from "@/lib/components/modal/modal.component"

import whyPeche01 from "@/assets/images/why-peche-01.png"
import whyPeche02 from "@/assets/images/why-peche-02.png"
import whyPeche03 from "@/assets/images/why-peche-03.png"
import whyPeche04 from "@/assets/images/why-peche-04.png"
import whyPeche05 from "@/assets/images/why-peche-05.png"
import whyPeche06 from "@/assets/images/why-peche-06.png"
import whyPeche07 from "@/assets/images/why-peche-07.png"
import useGoogleReviews from "./use-google-reviews"

import KakaoHelp from "@/assets/images/sns/icon_kakao_help.png"
import WhatsAppHelp from "@/assets/images/sns/icon_WhatsApp_help.png"
import LineHelp from "@/assets/images/sns/icon_LINE_help.png"
import WeChatHelp from "@/assets/images/sns/icon_WeChat_help.png"
import wechatQrImg from "@/assets/images/wechat-qr.jpg"

const PageContainer = tw.div`w-full flex flex-col items-center bg-white`

const ContentContainer = styled.div`
  ${tw`w-full flex flex-col items-center`}
  gap: 160px;
  padding-bottom: 160px;

  @media (max-width: 767px) {
    gap: 80px;
    padding-bottom: 80px;
  }
`

/* ── Section 1: 히어로 ── */
const HeroWrapper = tw.section`
  w-full flex flex-col items-center
`
const HeroImage = styled.img`
  ${tw`w-full object-cover`}
  height: 600px;

  @media (max-width: 767px) {
    height: 300px;
  }
`
const HeroTextSection = styled.div`
  ${tw`w-full flex flex-col justify-center items-center bg-tertiary`}
  gap: 16px;
  padding: 48px 16px;

  @media (min-width: 768px) {
    padding: 64px 120px 96px;
  }
`
const HeroTitle = tw.h2`
  text-[22px] md:text-[30px] font-pretendard font-semibold text-neutralBlack tracking-tight leading-[1.4] text-center
`
const HeroBody = tw.p`
  text-[14px] md:text-[16px] font-pretendard font-medium text-neutral70 tracking-tight leading-[1.5] text-center whitespace-pre-line
`

/* ── Section 2: Why Pêche Clinic? ── */
const WhyTitleSection = styled.section`
  ${tw`w-full max-w-[1440px] flex flex-col items-center`}
  gap: 64px;
  padding: 0 16px;

  @media (min-width: 768px) {
    padding: 0 120px;
  }
`
const WhyTitleBlock = styled.div`
  ${tw`flex flex-col items-center`}
  gap: 16px;
`
const WhyTitle = tw.h2`
  text-[24px] md:text-[30px] font-pretendard font-semibold text-neutralBlack tracking-tight leading-[1.4] text-center
`
const WhySubtitle = tw.p`
  text-[14px] md:text-[16px] font-pretendard font-medium text-neutral70 tracking-tight leading-[1.5] text-center
`
const PillRow = styled.div`
  ${tw`flex flex-row flex-wrap justify-center items-center`}
  gap: 30px;

  @media (max-width: 767px) {
    gap: 16px;
  }
`
const PillCircle = styled.div`
  ${tw`flex flex-col items-center justify-center`}
  width: 160px;
  height: 160px;
  border: 1.5px solid #fce3cb;
  border-radius: 999px;
  background: white;
  gap: 4px;

  @media (min-width: 768px) {
    width: 200px;
    height: 200px;
  }
`
const PillTitle = tw.span`
  text-[24px] md:text-[30px] font-pretendard font-semibold text-primary tracking-tight leading-[1.4]
`
const PillSubtitle = tw.span`
  text-[14px] md:text-[18px] font-time font-normal text-neutral60 tracking-tight leading-[1.4]
`

/* ── Section 3: 이유 카드 5개 ── */
const CardsSection = styled.section`
  ${tw`w-full max-w-[1440px] flex flex-col items-center`}
  gap: 64px;
  padding: 0 16px;

  @media (min-width: 768px) {
    padding: 0 120px;
  }
`
const CardRow = styled.div`
  ${tw`w-full flex flex-col md:flex-row justify-center items-start`}
  gap: 24px;

  @media (min-width: 768px) {
    gap: 40px;
  }
`
const CardImage = styled.img`
  ${tw`w-full object-cover flex-shrink-0`}
  height: 200px;

  @media (min-width: 768px) {
    width: 580px;
    height: 326px;
  }
`
const CardContent = styled.div`
  ${tw`flex flex-col w-full md:w-[580px]`}
  gap: 16px;
`
const CardTitle = tw.h3`
  text-[18px] md:text-[22px] font-pretendard font-semibold text-primary tracking-tight leading-[1.4]
`
const CardBody = tw.p`
  text-[14px] md:text-[16px] font-pretendard font-normal text-neutral70 tracking-tight leading-[1.5]
`

/* ── Section 4: 단체사진 + 신뢰 ── */
const TrustSection = styled.section`
  ${tw`w-full max-w-[1440px] flex flex-col md:flex-row justify-center items-center`}
  gap: 48px;
  padding: 0 16px;

  @media (min-width: 768px) {
    gap: 64px;
    padding: 0 120px;
  }
`
const TrustImage = styled.img`
  ${tw`w-full object-cover flex-shrink-0`}
  height: 300px;

  @media (min-width: 768px) {
    width: 568px;
    height: 426px;
  }
`
const TrustTextBlock = styled.div`
  ${tw`flex flex-col justify-center`}
  gap: 16px;
  width: 100%;

  @media (min-width: 768px) {
    width: 568px;
  }
`
const TrustTitle = tw.h2`
  text-[24px] md:text-[30px] font-pretendard font-semibold text-neutralBlack tracking-tight leading-[1.4]
`
const TrustBodyGroup = styled.div`
  ${tw`flex flex-col`}
  gap: 16px;
`
const TrustBody = tw.p`
  text-[14px] md:text-[16px] font-pretendard font-medium text-neutral70 tracking-tight leading-[1.5] whitespace-pre-line
`

/* ── Section 5: Global Review ── */
const ReviewSection = styled.section`
  ${tw`w-full flex flex-col justify-center items-center bg-tertiary`}
  gap: 64px;
  padding: 96px 16px;

  @media (min-width: 768px) {
    padding: 96px 120px;
  }
`
const ReviewTitle = tw.h2`
  text-[24px] md:text-[30px] font-pretendard font-semibold text-neutralBlack tracking-tight leading-[1.4] text-center
`
const ReviewCardRow = styled.div`
  ${tw`flex flex-col md:flex-row items-stretch justify-center`}
  gap: 24px;
  max-width: 1200px;
  width: 100%;
`
const ReviewCard = styled.div`
  ${tw`flex flex-col bg-white rounded-lg`}
  padding: 24px;
  gap: 16px;
  flex: 1;
  min-width: 0;
`
const ReviewHeader = styled.div`
  ${tw`flex items-center`}
  gap: 12px;
`
const ReviewAvatar = tw.img`
  w-10 h-10 rounded-full object-cover
`
const ReviewAuthorBlock = tw.div`
  flex flex-col
`
const ReviewAuthor = tw.span`
  text-[14px] font-pretendard font-semibold text-neutralBlack tracking-tight
`
const ReviewTime = tw.span`
  text-[12px] font-pretendard font-normal text-neutral50 tracking-tight
`
const ReviewStars = tw.div`
  flex items-center gap-0.5
`
const ReviewText = tw.p`
  text-[14px] font-pretendard font-normal text-neutral70 tracking-tight leading-[1.5] line-clamp-4
`
const ReviewMeta = styled.div`
  ${tw`flex items-center justify-center`}
  gap: 8px;
`
const ReviewRating = tw.span`
  text-[18px] font-pretendard font-semibold text-neutralBlack
`
const ReviewCount = tw.span`
  text-[14px] font-pretendard font-normal text-neutral50
`

/* ── Section 6: CTA ── */
const CtaSection = styled.section`
  ${tw`w-full max-w-[1440px] flex flex-col justify-center items-center`}
  gap: 40px;
  padding: 0 16px;

  @media (min-width: 768px) {
    padding: 0 120px;
  }
`
const CtaTitle = tw.h2`
  text-[22px] md:text-[30px] font-pretendard font-semibold text-neutralBlack tracking-tight leading-[1.4] text-center
`
const MapContainer = tw.div`
  w-full max-w-[660px] h-[320px] md:h-[480px]
`

/* 상담 버튼 매핑 (기존 패턴) */
const HELP_ICONS: Record<string, string> = {
  ko: KakaoHelp,
  en: WhatsAppHelp,
  zh: WeChatHelp,
  ja: LineHelp,
  "zh-TW": LineHelp,
  th: LineHelp,
}

const HELP_LINKS: Record<string, string> = {
  ko: "https://pf.kakao.com/_dxoiLn",
  en: "https://wa.me/message/4Y5JC2HX6OH5H1",
  ja: "https://line.me/R/ti/p/@235wfyao",
  th: "https://line.me/R/ti/p/@892druai",
  "zh-TW": "https://line.me/R/ti/p/@683jgqmd",
}

/* ── Why Pêche Page ── */
const WhyPechePage = () => {
  const { i18n } = useTranslation()
  const language = i18n.language as Language
  const [openWeChatModal, setOpenWeChatModal] = React.useState(false)

  // Places 라이브러리 포함해서 Google Maps 로드 (리뷰 가져오기용)
  useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBnCzoLh8deDtFObswdeXMO_orKxEaGMp0",
    libraries: ["places"] as ("places")[],
    language: "en",
  })

  const { reviews, placeRating, totalReviews, loading } = useGoogleReviews(3)

  const helpIcon = HELP_ICONS[language] || WhatsAppHelp
  const helpLink = HELP_LINKS[language]

  const handleHelpClick = () => {
    if (language === Language.CHN) {
      setOpenWeChatModal(true)
      return
    }
    if (helpLink) {
      window.open(helpLink, "_blank")
    }
  }

  return (
    <Page hiddenFooter={false} bottomCartExists={false}>
      <PageContainer>
        <ContentContainer>
          {/* Section 1: 히어로 */}
          <HeroWrapper>
            <HeroImage src={whyPeche01} alt="Pêche Clinic Interior" />
            <HeroTextSection>
              <HeroTitle>
                Global Standard in Gangnam, Pêche Clinic
              </HeroTitle>
              <HeroBody>
                {
                  "6만 건의 시술 경험이 증명하는 결과\n국적과 언어를 넘어 신뢰를 전하는 프리미엄 케어를 경험하세요."
                }
              </HeroBody>
            </HeroTextSection>
          </HeroWrapper>

          {/* Section 2: Why Pêche Clinic? */}
          <WhyTitleSection>
            <WhyTitleBlock>
              <WhyTitle>Why Pêche Clinic?</WhyTitle>
              <WhySubtitle>
                페슈의원의 신뢰는 정직, 전문, 편의입니다.
              </WhySubtitle>
            </WhyTitleBlock>
            <PillRow>
              <PillCircle>
                <PillTitle>정직</PillTitle>
                <PillSubtitle>Honesty</PillSubtitle>
              </PillCircle>
              <PillCircle>
                <PillTitle>전문</PillTitle>
                <PillSubtitle>Expertise</PillSubtitle>
              </PillCircle>
              <PillCircle>
                <PillTitle>편의</PillTitle>
                <PillSubtitle>Convenience</PillSubtitle>
              </PillCircle>
            </PillRow>
          </WhyTitleSection>

          {/* Section 3: 이유 카드 5개 */}
          <CardsSection>
            <CardRow>
              <CardImage src={whyPeche02} alt="내외국인 동일 정가제" />
              <CardContent>
                <CardTitle>내외국인 동일 정가제</CardTitle>
                <CardBody>
                  해외 환자가 타국에서 의료 서비스를 선택할 때 가장 중요하게
                  고려하는 기준은 비용의 신뢰성입니다. 페슈의원은 국적에 따른
                  차등 가격을 책정하지 않고, 모든 환자에게 내국인과 동일한 정가
                  정책을 적용하고 있습니다. 이를 통해 환자는 비용에 대한
                  불필요한 염려 없이 진료에 집중할 수 있으며, 누구에게나
                  공정하고 일관된 프리미엄 서비스를 제공받을 수 있습니다.
                </CardBody>
              </CardContent>
            </CardRow>
            <CardRow>
              <CardImage src={whyPeche03} alt="유리창으로 오픈된 시술준비실" />
              <CardContent>
                <CardTitle>유리창으로 오픈된 시술준비실</CardTitle>
                <CardBody>
                  시술 시 정품 의약품을 사용하는지, 약속된 정량을 정확히
                  지키는지에 대한 의구심은 당연히 들 수 있습니다. 페슈의원은
                  시술준비실을 투명한 유리창으로 공개하여 약품 조제 과정을
                  환자가 직접 눈으로 확인할 수 있도록 함으로써, 정직한 진료
                  원칙을 시각적으로 증명합니다.
                </CardBody>
              </CardContent>
            </CardRow>
            <CardRow>
              <CardImage src={whyPeche04} alt="60,000+ 시술 케이스" />
              <CardContent>
                <CardTitle>60,000+ 시술 케이스</CardTitle>
                <CardBody>
                  의료진의 주관적인 감에만 의존하는 진료는 시술 결과의 편차를
                  발생시킬 위험이 있습니다. 페슈의원은 6만 건 이상의 임상
                  데이터를 바탕으로 환자 개개인의 피부 타입에 최적화된 시술
                  효과를 사전에 예측하여 집도하며, 이를 통해 결과의 오차를
                  최소화하고 각 환자에게 가장 효과적인 의료 서비스를
                  제공합니다.
                </CardBody>
              </CardContent>
            </CardRow>
            <CardRow>
              <CardImage src={whyPeche05} alt="전담 외국어 응대" />
              <CardContent>
                <CardTitle>전담 외국어 응대</CardTitle>
                <CardBody>
                  의료 용어의 복잡성과 언어 장벽은 타국에서 진료를 받는
                  환자에게 심리적 위축과 오해를 불러일으킬 수 있습니다.
                  페슈의원은 영어, 중국어, 일어 전문 상담원이 상주하여 진료
                  상담부터 시술 중의 상황 설명, 시술 후 관리까지 환자의
                  언어로 직접 소통함으로써 소통 부재로 인한 불안을 없애고
                  안심하실 수 있도록 합니다.
                </CardBody>
              </CardContent>
            </CardRow>
            <CardRow>
              <CardImage src={whyPeche06} alt="강남역 초역세권" />
              <CardContent>
                <CardTitle>강남역 초역세권</CardTitle>
                <CardBody>
                  해외 환자에게는 한정된 여행 시간 내에서 이동 동선의 효율성을
                  확보하는 것은 굉장히 중요합니다. 페슈의원은 서울 교통의
                  중심인 강남역 4번 출구 바로 앞에 위치하여 이동 시간을
                  최소화해주며, 관광 및 쇼핑 동선과 연결성이 우수하여 해외
                  환자의 방문 편의성을 극대화할 수 있는 최적의 입지 조건을
                  갖고 있습니다.
                </CardBody>
              </CardContent>
            </CardRow>
          </CardsSection>

          {/* Section 4: 단체사진 + 신뢰 */}
          <TrustSection>
            <TrustImage src={whyPeche07} alt="페슈의원 팀" />
            <TrustTextBlock>
              <TrustTitle>결국, 신뢰는 사람으로 완성됩니다</TrustTitle>
              <TrustBodyGroup>
                <TrustBody>
                  페슈의원의 의료진과 직원들은 정직한 설명으로 환자가 올바른
                  선택을 할 수 있도록 돕습니다.
                </TrustBody>
                <TrustBody>
                  {
                    "개인에게 가장 효과적인 시술을 고민하고, 전문성을 바탕으로 신중하게 진료합니다. 또한 진심 어린 응대와 세심한 배려 속에서도, 때로는 단호하게 신뢰의 가치를 지켜나갑니다."
                  }
                </TrustBody>
              </TrustBodyGroup>
            </TrustTextBlock>
          </TrustSection>

          {/* Section 5: Global Review */}
          <ReviewSection>
            <div tw="flex flex-col items-center gap-2">
              <ReviewTitle>Global Review</ReviewTitle>
              {!loading && placeRating > 0 && (
                <ReviewMeta>
                  <ReviewStars>
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        tw="text-[20px]"
                        style={{
                          color: i < Math.round(placeRating) ? "#F5A623" : "#C8C8C8",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </ReviewStars>
                  <ReviewRating>{placeRating.toFixed(1)}</ReviewRating>
                  <ReviewCount>({totalReviews.toLocaleString()})</ReviewCount>
                </ReviewMeta>
              )}
            </div>
            {loading ? (
              <p tw="text-neutral50 text-[14px]">리뷰를 불러오는 중...</p>
            ) : reviews.length > 0 ? (
              <ReviewCardRow>
                {reviews.map((review, idx) => (
                  <ReviewCard key={idx}>
                    <ReviewHeader>
                      <ReviewAvatar
                        src={review.profile_photo_url}
                        alt={review.author_name}
                      />
                      <ReviewAuthorBlock>
                        <ReviewAuthor>{review.author_name}</ReviewAuthor>
                        <ReviewTime>
                          {review.relative_time_description}
                        </ReviewTime>
                      </ReviewAuthorBlock>
                    </ReviewHeader>
                    <ReviewStars>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          tw="text-[16px]"
                          style={{
                            color: i < review.rating ? "#F5A623" : "#C8C8C8",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </ReviewStars>
                    <ReviewText>{review.text}</ReviewText>
                  </ReviewCard>
                ))}
              </ReviewCardRow>
            ) : (
              <p tw="text-neutral50 text-[14px]">리뷰가 없습니다.</p>
            )}
          </ReviewSection>

          {/* Section 6: CTA (기존 상담 버튼 패턴) */}
          <CtaSection>
            <CtaTitle>언어 장벽 없는 실시간 무료 상담을 시작하세요</CtaTitle>
            <button
              tw="flex items-center gap-2"
              className="sns-btn-conversion"
              onClick={handleHelpClick}
            >
              <img src={helpIcon} alt="상담하기" tw="h-[38px]" />
            </button>
            <MapContainer>
              {language === "ko" ? <KakaoMap /> : <GoogleMapComponent />}
            </MapContainer>
          </CtaSection>
        </ContentContainer>
      </PageContainer>

      {/* WeChat QR 모달 */}
      <Modal
        open={openWeChatModal}
        onClose={() => setOpenWeChatModal(false)}
        width="max-w-md"
      >
        <div tw="flex flex-col items-center bg-white rounded-xl overflow-hidden">
          <div tw="w-full bg-neutral20 py-3 px-4 flex justify-between items-center">
            <span tw="text-neutralBlack font-semibold">Peche clinic</span>
            <button onClick={() => setOpenWeChatModal(false)}>✕</button>
          </div>
          <div tw="p-8">
            <img
              src={wechatQrImg}
              alt="wechat qr"
              tw="w-[240px] h-[240px] object-contain"
            />
          </div>
        </div>
      </Modal>
    </Page>
  )
}

export default WhyPechePage
