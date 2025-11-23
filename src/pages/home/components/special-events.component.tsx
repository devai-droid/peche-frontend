import React from "react"
import tw, { styled } from "twin.macro"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import leftArrow from "@/assets/images/left-arrow.png"
import rightArrow from "@/assets/images/right-arrow.png"
import { useNavigate } from "react-router-dom"
import CustomLink from "@/lib/components/custom-link.component"
import { useEventCategoryControllerFindManyWithPaginationQuery } from "@/lib/orval/event-categories/event-categories"
import { useEventBundleControllerFindVisible } from "@/lib/orval/event-bundle/event-bundle"
import useLanguageQuery from "@/lib/hooks/use-language-query"
import useLanguageValue from "@/lib/hooks/use-language-key"

const Section = tw.section`
  w-full bg-white py-12 md:py-20 tracking-tight leading-[140%] font-pretendard
`

const Inner = tw.div`
  max-w-[1440px] mx-auto px-6 md:px-10
`

const Header = tw.div`
  flex items-center justify-between mb-8 md:mb-12
`

const TitleBox = tw.div`
  flex items-center gap-2
`

const NewBadge = tw.span`
  bg-primary text-white text-[10px] md:text-[12px] px-2
`

const Title = tw.h2`
  text-[24px] md:text-[30px] font-semibold text-neutralBlack
`

const MoreButton = tw.button`
  border border-primary text-primary text-[13px] md:text-[15px] px-2 py-2 rounded hover:bg-primary hover:text-white transition
`

const StyledSwiperWrapper = styled.div`
  position: relative;

  .nav-button {
    ${tw`
      hidden md:flex items-center justify-center
      absolute top-1/2 transform -translate-y-1/2
      w-[40px] h-[40px] bg-[#f5f5f5] rounded-none
      shadow-sm hover:bg-[#eaeaea] transition
      cursor-pointer z-10
    `}
  }

  .nav-prev {
    top: 39%;
    left: 0px;
  }

  .nav-next {
    top: 39%;
    right: 0px;
  }

  .nav-button img {
    width: 14px;
    height: 14px;
  }
`

const StyledSwiperSlide = styled(SwiperSlide)`
  width: 215px !important;
  @media (min-width: 768px) {
    width: 295px !important;
  }
`

const Card = styled.div`
  ${tw`bg-white flex flex-col items-center justify-start cursor-pointer`}
  width: 215px;
  height: 285px;

  @media (min-width: 768px) {
    width: 295px;
    height: 390px;
  }
`

const ImageBox = styled.div`
  ${tw`rounded overflow-hidden mb-2 bg-gray-100`}
  width: 212px;
  height: 212px;
  @media (min-width: 768px) {
    width: 292px;
    height: 292px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const EventTitle = tw.div`
  text-left font-semibold text-neutralBlack text-[16px] md:text-[18px] ml-4 mb-1 w-full
`

const EventPrice = tw.div`
  text-left text-[16px] md:text-[18px] font-semibold text-neutralBlack w-full ml-4
`

const Discount = tw.span`
  text-primary text-[13px] md:text-[14px] font-semibold mr-1
`

const SpecialEventSection = () => {
  const nav = useNavigate()
  const langQuery = useLanguageQuery()
  const tv = useLanguageValue()

  const { data: categories } = useEventCategoryControllerFindManyWithPaginationQuery({
    status: "ACTIVE",
    sortBy: ["order"],
    sortOrder: ["ASC"],
    limit: 200,
    ...langQuery,
  })

  const { data: visibleBundles } = useEventBundleControllerFindVisible()

  // ⚠️ bundle이 없으면 페이지 이동 불가능 → 섹션 자체 숨김
  if (!visibleBundles || visibleBundles.length === 0) return null
  const firstBundleId = visibleBundles[0].id

  // ⭐ 이미지 있는 대분류만 표시
  const imageCategories = categories?.items?.filter((cat) => !!cat.image?.url) ?? []

  if (imageCategories.length === 0) return null

  const handleClick = (categoryId: string) => {
    nav(`/events?category=${categoryId}&bundle=${firstBundleId}`)
  }

  return (
    <Section>
      <Inner>
        <Header>
          <TitleBox>
            <NewBadge>New</NewBadge>
            <Title>최신 이벤트 소식</Title>
          </TitleBox>
          <CustomLink to="/events" style={{ textDecoration: "none" }}>
            <MoreButton as="div">전체 이벤트 보기</MoreButton>
          </CustomLink>
        </Header>

        <StyledSwiperWrapper>
          <div className="nav-button nav-prev">
            <img src={leftArrow} alt="prev" />
          </div>
          <div className="nav-button nav-next">
            <img src={rightArrow} alt="next" />
          </div>

          <Swiper
            modules={[Navigation]}
            navigation={{ prevEl: ".nav-prev", nextEl: ".nav-next" }}
            breakpoints={{
              0: { slidesPerView: "auto", spaceBetween: 0 },
              768: { slidesPerView: "auto", spaceBetween: 0 },
              1024: { slidesPerView: "auto", spaceBetween: 0 },
            }}>
            {imageCategories.map((cat) => (
              <StyledSwiperSlide key={cat.id}>
                <CustomLink
                  to={`/events?category=${cat.id}&bundle=${firstBundleId}`}
                  style={{ textDecoration: "none" }}>
                  <Card>
                    <ImageBox>
                      <img src={cat.image.url} alt={tv(cat, "name")} />
                    </ImageBox>

                    <EventTitle>{tv(cat, "name")}</EventTitle>

                    <EventPrice>
                      {cat.discountPercent && <Discount>~ {cat.discountPercent}%</Discount>}
                      {cat.minPrice ? `${cat.minPrice.toLocaleString()}원부터` : ""}
                    </EventPrice>
                  </Card>
                </CustomLink>
              </StyledSwiperSlide>
            ))}
          </Swiper>
        </StyledSwiperWrapper>
      </Inner>
    </Section>
  )
}

export default SpecialEventSection
