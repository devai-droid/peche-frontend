import tw, { styled } from "twin.macro"
import bannerImg from "@/assets/images/hero-banner-pc.png"
import bannerMobileImg from "@/assets/images/hero-banner-mo.png"
import { ReactComponent as HeroLogo } from "@/assets/images/hero-logo.svg"

const BannerWrapper = styled.section`
  ${tw`w-full relative overflow-hidden bg-white`}
  height: 450px;

  @media (min-width: 1025px) {
    height: 700px;
  }
`

const BannerImageContainer = styled.div`
  ${tw`absolute inset-0 flex justify-center bg-neutral`}
`

const BannerImage = styled.img`
  ${tw`h-full w-auto object-cover`}
  max-width: 3000px;
  width: 100%;
`

const LogoWrapper = styled.div`
  ${tw`absolute`}
  left: 50%;
  transform: translateX(-160px);
  top: 211px;

  svg {
    width: 110px;
    height: 28px;
  }

  @media (min-width: 1025px) {
    left: 50%;
    transform: translateX(-460px);
    top: 312px;

    svg {
      width: 300px;
      height: 76px;
    }
  }
`

const Banner = () => {
  return (
    <BannerWrapper>
      <BannerImageContainer>
        <picture>
          <source media="(max-width: 1024px)" srcSet={bannerMobileImg} />
          <BannerImage src={bannerImg} alt="Pêche Clinic banner" />
        </picture>
      </BannerImageContainer>

      <LogoWrapper>
        <HeroLogo />
      </LogoWrapper>
    </BannerWrapper>
  )
}

export default Banner
