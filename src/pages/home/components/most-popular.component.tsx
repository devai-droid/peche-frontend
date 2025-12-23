import React, { useState } from "react"
import tw, { styled } from "twin.macro"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import CustomLink from "@/lib/components/custom-link.component"
import useLanguageValue from "@/lib/hooks/use-language-key"
import { useTranslation } from "react-i18next"
import { useMostPopularCategoryControllerFindAll } from "@/lib/orval/most-popular-categories/most-popular-categories"

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
  bg-primary text-white text-[15px] md:text-[17px] px-[4px]
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
  flex flex-wrap gap-3 text-neutralBlack text-[14px] md:text-[16px] mb-[2px] font-normal
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

  .swiper-button-prev::after,
  .swiper-button-next::after {
    font-size: 14px;
    font-weight: bold;
  }
`

const StyledSwiperSlide = styled(SwiperSlide)`
  width: 321px !important;
  flex-shrink: 0;
`

const CardLabel = styled.div`
  ${tw`absolute bottom-2 right-2 bg-white text-[13px] px-2 py-1`}
  min-width: 40px; /* 또는 60~100px 사이로 네가 원하는 값 */
  white-space: nowrap;
`

// ─────────────────────────────
// 컴포넌트 본체
// ─────────────────────────────
const MostPopular = () => {
  const [openId, setOpenId] = useState<string | null>(null)
  const tv = useLanguageValue()
  const { t, i18n } = useTranslation()

  const { data: categories } = useMostPopularCategoryControllerFindAll()

  React.useEffect(() => {
    if (categories && categories.length > 0 && !openId) {
      setOpenId(categories[0].id)
    }
  }, [categories])

  const ImageCardLink = styled(CustomLink)`
    ${tw`relative overflow-hidden bg-gray-100 cursor-pointer`}
    width: 321px;
    height: 321px;
    margin: 0 auto;
    transform: translateZ(0); /* 레이어 고정 */

    .img-wrap {
      ${tw`w-full h-full overflow-hidden`}
    }
    img {
      ${tw`w-full h-full object-cover transition-transform duration-500`}
      transform: scale(1);
      will-change: transform;
    }

    &:hover img {
      transform: scale(1.05); /* 105% 확대 */
    }
  `

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  if (!categories) return null

  return (
    <Section>
      <Inner>
        <Header>
          <BestBadge>{t("mostPopular.best")}</BestBadge>
          <Title>{t("mostPopular.title")}</Title>
        </Header>

        <Divider />

        {categories.map((category) => (
          <AccordionItem key={category.id}>
            <AccordionHeader
              open={openId === category.id}
              onClick={() => toggleAccordion(category.id)}>
              <div tw="flex flex-wrap items-center gap-3 text-[15px] md:text-[18px]">
                <span tw="font-semibold text-[16px] md:text-[18px]">{tv(category, "name")}</span>

                <KeywordList>
                  {(category.keywords || []).map((kw, idx) => (
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
                  navigation={false}
                  breakpoints={{
                    0: { slidesPerView: "auto", spaceBetween: 8 },
                    768: { slidesPerView: 3, spaceBetween: 8 },
                    1024: { slidesPerView: 4, spaceBetween: 20 },
                  }}>
                  {category.items
                    ?.slice()
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((item) => (
                      <StyledSwiperSlide key={item.id}>
                        <ImageCardLink to={`/products/${item.productDetailPageId}`}>
                          <div className="img-wrap">
                            <img src={item.image?.url} alt="" />
                          </div>
                          <CardLabel>{tv(item, "title")}</CardLabel>
                        </ImageCardLink>
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
