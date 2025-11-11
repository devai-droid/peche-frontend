import { useTranslation } from "react-i18next"
import tw, { styled } from "twin.macro"
import bannerImg from "@/assets/images/landing-page/landing.jpeg"
import bannerMobileImg from "@/assets/images/landing-page/mobile-landing.jpeg"
import bannerLogo from "@/assets/images/landing-page/banner-logo.png"

const BannerWrapper = styled.section`
  ${tw`w-full relative overflow-hidden bg-white`}
  height: 600px;

  @media (min-width: 768px) {
    height: 700px;
  }
`

// ✅ 이미지 중앙에 고정 + max-width 제한
const BannerImageContainer = styled.div`
  ${tw`absolute inset-0 flex justify-center bg-neutral`}
`

const BannerImage = styled.img`
  ${tw`h-full w-auto object-cover`}
  max-width: 1440px;
  width: 100%;
`

// ✅ 이 컨테이너가 로고 포함 (1440px 제한)
const BannerContentWrapper = styled.div`
  ${tw`
    absolute inset-0 flex flex-col justify-center
    text-black px-6 md:px-16
  `}
`

const BannerContent = styled.div`
  ${tw`
    flex justify-start
  `}
  max-width: 1440px;
  padding-left: 5%; /* 이미지 안에서 얼굴 기준 여백 조절 */

  @media (max-width: 768px) {
    padding-left: 0;
  }
`

const BannerLogo = styled.img`
  ${tw`w-[100px] md:w-[210px] h-[25px] md:h-[54px]`}
`

const Banner = () => {
  const { i18n } = useTranslation()

  return (
    <BannerWrapper>
      <BannerImageContainer>
        <picture>
          <source media="(max-width: 450px)" srcSet={bannerMobileImg} />
          <BannerImage src={bannerImg} alt="Pêche Clinic banner" />
        </picture>
      </BannerImageContainer>

      {/* ✅ max-width:1440px 컨테이너 내부에 로고 고정 */}
      <BannerContentWrapper>
        <BannerContent>
          <BannerLogo src={bannerLogo} alt="Pêche Logo" loading="lazy" />
        </BannerContent>
      </BannerContentWrapper>
    </BannerWrapper>
  )
}

export default Banner
