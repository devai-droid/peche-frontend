import React from "react"
import tw, { styled } from "twin.macro"
import introImg from "@/assets/images/introduction.png"
import { ChevronRightIcon } from "@/assets/icon"
import CustomLink from "@/lib/components/custom-link.component"
import { useTranslation } from "react-i18next"

const Section = styled.section`
  ${tw`relative w-full font-pretendard`}
  height: 540px;
  background: url(${introImg}) center center / cover no-repeat;
`

const Inner = tw.div`
  w-full max-w-[1440px] mx-auto relative h-full
`

// 텍스트 박스 (배경 위에 겹침)
const TextBox = styled.div`
  ${tw`
    absolute bg-[#FDF4EB] flex flex-col justify-center tracking-tight leading-[140%]
    text-left md:text-left
  `}
  width: calc(100% - 48px);
  left: 50%;
  transform: translateX(-50%);
  bottom: 24px;
  padding: 24px;
  border-radius: 0;

  @media (min-width: 768px) {
    width: 540px;
    padding: 48px;

    left: auto;
    right: 10%;
    top: 50%;
    bottom: auto;
    transform: translateY(-50%);
  }
`

const Title = tw.h2`
  text-[24px] md:text-[30px] font-bold text-neutralBlack mb-4
`

const Description = tw.p`
  text-[14px] md:text-[16px] leading-[150%] text-neutral70 mt-2 mb-6
`

const LinkButton = styled.button`
  ${tw`flex items-center gap-2 text-primary text-[15px] md:text-[17px] font-semibold`}
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease; /* 텍스트 색상만 부드럽게 */

  &:hover {
    color: #ab6655;
  }

  svg {
    transition: none;
  }
`

const IntroductionSection = () => {
  const { t } = useTranslation()

  return (
    <Section>
      <Inner>
        <TextBox>
          <Title>{t("introduction.title")}</Title>
          <Description>{t("introduction.intro")}</Description>
          <CustomLink to="/intro">
            <LinkButton>
              {t("introduction.goTo")}
              <ChevronRightIcon width={16} height={16} stroke="currentColor" />
            </LinkButton>
          </CustomLink>
        </TextBox>
      </Inner>
    </Section>
  )
}

export default IntroductionSection
