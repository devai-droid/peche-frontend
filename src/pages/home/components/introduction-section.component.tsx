import React from "react"
import tw, { styled } from "twin.macro"
import introImg from "@/assets/images/introduction.png"

const Section = styled.section`
  ${tw`relative w-full font-pretendard`}
  height: 540px;
  background: url(${introImg}) center center / cover no-repeat;
`

// ✅ 텍스트 박스 (배경 위에 겹침)
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
  max-width: 1440px;

  @media (min-width: 768px) {
    width: 540px;
    right: 10%;
    left: auto;
    transform: none;
    bottom: auto;
    top: 50%;
    transform: translateY(-50%);
    padding: 48px;
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

  &:after {
    content: "›";
    font-size: 16px;
    transition: transform 0.2s ease;
  }

  &:hover:after {
    transform: translateX(3px);
  }
`

const IntroductionSection = () => {
  return (
    <Section>
      <TextBox>
        <Title>페슈의원</Title>
        <Description>
          페슈의원은 고객이 경험하는 모든 순간에서 신뢰를 만들기 위해 오랜 시간 깊은 고민과 노력을
          쌓아 만들어졌습니다. 처음 만나는 순간부터 치료를 마치고 병원을 나서는 순간까지,
          페슈의원에서의 모든 경험은 언제나 투명하고 정직합니다.
        </Description>
        <LinkButton>소개 보러가기</LinkButton>
      </TextBox>
    </Section>
  )
}

export default IntroductionSection
