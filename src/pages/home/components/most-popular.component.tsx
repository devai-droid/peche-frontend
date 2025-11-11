import React, { useState } from "react"
import tw, { styled } from "twin.macro"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"

// example 이미지
import example1 from "@/assets/images/example1.jpg"
import example2 from "@/assets/images/example2.jpg"
import example3 from "@/assets/images/example3.jpg"
import example4 from "@/assets/images/example4.jpg"

// ─────────────────────────────
// Layout
// ─────────────────────────────
const Section = tw.section`
  w-full bg-white py-12 md:py-20 font-pretendard tracking-tight leading-[140%]
`

const Inner = tw.div`
  max-w-[1440px] mx-auto px-6 md:px-10
`

const Header = tw.div`
  flex items-center gap-2
`

const BestBadge = tw.span`
  bg-primary text-white text-[10px] md:text-[12px] px-2
`

const Title = tw.h2`
  text-[24px] md:text-[30px] font-semibold text-neutralBlack ml-1
`

const Divider = tw.hr`
  border-t border-[#ddd] mt-6
`

// ─────────────────────────────
// Accordion
// ─────────────────────────────
const AccordionItem = styled.div`
  ${tw`border-b border-[#ddd]`}
`

const AccordionHeader = styled.div<{ open: boolean }>`
  ${tw`flex items-center justify-between py-4 cursor-pointer`}
  font-weight: 600;

  svg {
    ${tw`w-4 h-4 transition-transform`}
    transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0deg)")};
    stroke: #9b9b9b;
  }
`

const AccordionContent = styled.div<{ open: boolean }>`
  ${tw`overflow-hidden transition-all duration-300 ease-in-out`}
  max-height: ${({ open }) => (open ? "600px" : "0")};
`

const KeywordList = tw.div`
  flex flex-wrap gap-3 text-neutralBlack text-[13px] md:text-[14px] mb-[2px]
`

const Keyword = tw.span`
  text-neutral70
`

// ─────────────────────────────
// Swiper 내부 카드
// ─────────────────────────────
const StyledSwiperWrapper = styled.div`
  position: relative;
  padding-bottom: 24px;

  .swiper-button-prev,
  .swiper-button-next {
    ${tw`hidden md:flex items-center justify-center absolute top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-[#f5f5f5] rounded-none text-black shadow-sm hover:bg-[#eaeaea] transition`}
  }

  .nav-button {
    ${tw`
      hidden
    `}
  }

  .swiper-button-prev::after,
  .swiper-button-next::after {
    font-size: 14px;
    font-weight: bold;
  }
`

const StyledSwiperSlide = styled(SwiperSlide)`
  width: 296px !important; /* 모바일 기본 */
`

// ✅ 고정 크기 296x296
const ImageCard = styled.div`
  ${tw`relative overflow-hidden bg-gray-100 cursor-pointer`}
  width: 296px;
  height: 296px;
  margin: 0 auto;

  img {
    ${tw`w-full h-full object-cover`}
  }
`

const CardLabel = styled.div`
  ${tw`absolute bottom-2 right-2 bg-white text-[13px] px-2 py-1`}
`

// ─────────────────────────────
// 더미 데이터
// ─────────────────────────────
const categories = [
  {
    id: 1,
    title: "탄력/리프팅",
    keywords: ["동안피부", "주름완화", "콜라겐"],
    items: [example1, example2, example3, example4],
  },
  {
    id: 2,
    title: "효과 카테고리",
    keywords: ["키워드", "키워드", "키워드"],
    items: [example1, example2, example3, example4],
  },
  {
    id: 3,
    title: "효과 카테고리",
    keywords: ["키워드", "키워드", "키워드"],
    items: [example1, example2, example3, example4],
  },
  {
    id: 4,
    title: "효과 카테고리",
    keywords: ["키워드", "키워드", "키워드"],
    items: [example1, example2, example3, example4],
  },
]

// ─────────────────────────────
// 컴포넌트 본체
// ─────────────────────────────
const MostPopular = () => {
  const [openId, setOpenId] = useState<number | null>(1)

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <Section>
      <Inner>
        <Header>
          <BestBadge>Best</BestBadge>
          <Title>가장 많이 찾는 시술</Title>
        </Header>

        <Divider />

        {categories.map((category) => (
          <AccordionItem key={category.id}>
            <AccordionHeader
              open={openId === category.id}
              onClick={() => toggleAccordion(category.id)}>
              <div tw="flex flex-wrap items-center gap-3 text-[15px] md:text-[18px]">
                <span tw="font-semibold text-[15px] md:text-[17px]">{category.title}</span>
                <KeywordList>
                  {category.keywords.map((kw, idx) => (
                    <Keyword key={idx}>#{kw}</Keyword>
                  ))}
                </KeywordList>
              </div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </AccordionHeader>

            <AccordionContent open={openId === category.id}>
              <StyledSwiperWrapper>
                <Swiper
                  modules={[Navigation]}
                  breakpoints={{
                    0: { slidesPerView: 2, spaceBetween: 2 },
                    768: { slidesPerView: 3, spaceBetween: 2 },
                    1024: { slidesPerView: 4, spaceBetween: 4 },
                  }}>
                  {category.items.map((img, idx) => (
                    <StyledSwiperSlide key={idx}>
                      <ImageCard>
                        <img src={img} alt={`시술 ${idx + 1}`} />
                        <CardLabel>시술명</CardLabel>
                      </ImageCard>
                    </StyledSwiperSlide>
                  ))}
                </Swiper>
              </StyledSwiperWrapper>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Inner>
    </Section>
  )
}

export default MostPopular
