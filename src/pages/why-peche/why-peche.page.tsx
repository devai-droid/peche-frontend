import React from "react"
import tw, { styled } from "twin.macro"
import Page from "@/lib/components/layout/page.component"
import { useTranslation } from "react-i18next"
import KakaoMap from "@/lib/components/kakao-map/kakao-map.component"
import GoogleMapComponent from "@/lib/components/google-map/google-map.component"
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
  text-[18px] md:text-[22px] font-pretendard font-semibold text-primary tracking-tight leading-[1.4]
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
  const { t, i18n } = useTranslation()
  const language = i18n.language as Language
  const [openWeChatModal, setOpenWeChatModal] = React.useState(false)

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
              <HeroTitle>{t("whyPeche.heroTitle")}</HeroTitle>
              <HeroBody>{t("whyPeche.heroBody")}</HeroBody>
            </HeroTextSection>
          </HeroWrapper>

          {/* Section 2: Why Pêche Clinic? */}
          <WhyTitleSection>
            <WhyTitleBlock>
              <WhyTitle>{t("whyPeche.whyTitle")}</WhyTitle>
              <WhySubtitle>{t("whyPeche.whySubtitle")}</WhySubtitle>
            </WhyTitleBlock>
            <PillRow>
              <PillCircle>
                <PillTitle>{t("whyPeche.pill1")}</PillTitle>
              </PillCircle>
              <PillCircle>
                <PillTitle>{t("whyPeche.pill2")}</PillTitle>
              </PillCircle>
              <PillCircle>
                <PillTitle>{t("whyPeche.pill3")}</PillTitle>
              </PillCircle>
            </PillRow>
          </WhyTitleSection>

          {/* Section 3: 이유 카드 5개 */}
          <CardsSection>
            <CardRow>
              <CardImage src={whyPeche02} alt="내외국인 동일 정가제" />
              <CardContent>
                <CardTitle>{t("whyPeche.card1Title")}</CardTitle>
                <CardBody>{t("whyPeche.card1Body")}</CardBody>
              </CardContent>
            </CardRow>
            <CardRow>
              <CardImage src={whyPeche03} alt={t("whyPeche.card2Title")} />
              <CardContent>
                <CardTitle>{t("whyPeche.card2Title")}</CardTitle>
                <CardBody>{t("whyPeche.card2Body")}</CardBody>
              </CardContent>
            </CardRow>
            <CardRow>
              <CardImage src={whyPeche04} alt={t("whyPeche.card3Title")} />
              <CardContent>
                <CardTitle>{t("whyPeche.card3Title")}</CardTitle>
                <CardBody>{t("whyPeche.card3Body")}</CardBody>
              </CardContent>
            </CardRow>
            <CardRow>
              <CardImage src={whyPeche05} alt={t("whyPeche.card4Title")} />
              <CardContent>
                <CardTitle>{t("whyPeche.card4Title")}</CardTitle>
                <CardBody>{t("whyPeche.card4Body")}</CardBody>
              </CardContent>
            </CardRow>
            <CardRow>
              <CardImage src={whyPeche06} alt={t("whyPeche.card5Title")} />
              <CardContent>
                <CardTitle>{t("whyPeche.card5Title")}</CardTitle>
                <CardBody>{t("whyPeche.card5Body")}</CardBody>
              </CardContent>
            </CardRow>
          </CardsSection>

          {/* Section 4: 단체사진 + 신뢰 */}
          <TrustSection>
            <TrustImage src={whyPeche07} alt="페슈의원 팀" />
            <TrustTextBlock>
              <TrustTitle>{t("whyPeche.trustTitle")}</TrustTitle>
              <TrustBodyGroup>
                <TrustBody>{t("whyPeche.trustBody1")}</TrustBody>
                <TrustBody>{t("whyPeche.trustBody2")}</TrustBody>
              </TrustBodyGroup>
            </TrustTextBlock>
          </TrustSection>

          {/* Section 5: Global Review */}
          <ReviewSection>
            <div tw="flex flex-col items-center gap-2">
              <ReviewTitle>{t("whyPeche.reviewTitle")}</ReviewTitle>
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
            <CtaTitle>{t("whyPeche.ctaTitle")}</CtaTitle>
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
        <div tw="-mx-10 -my-8">
          <div tw="bg-[#F3F3F3] w-full relative">
            <div tw="px-4 pb-3 pt-12">
              <div tw="text-[24px] font-time text-neutral90">Peche clinic</div>
            </div>
            <button
              tw="absolute top-3 right-4"
              onClick={() => setOpenWeChatModal(false)}
            >
              ✕
            </button>
          </div>
          <div tw="p-6 flex justify-center bg-white">
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
