import React from "react"
import tw, { styled } from "twin.macro"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import leftArrow from "@/assets/images/left-arrow.png"
import rightArrow from "@/assets/images/right-arrow.png"

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

// ✅ Swiper Wrapper + 커스텀 네비게이션 버튼
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
  width: 215px !important; /* 모바일 기본 */
  @media (min-width: 768px) {
    width: 295px !important; /* 데스크탑 카드와 동일 */
  }
`

// ✅ 카드 사이즈 고정
const Card = styled.div`
  ${tw`
    bg-white flex flex-col items-center justify-start cursor-pointer
  `}
  width: 215px;
  height: 285px;
  margin: 0 auto;

  @media (min-width: 768px) {
    width: 295px;
    height: 390px;
  }
`

// ✅ 이미지 placeholder
const ImagePlaceholder = styled.div`
  ${tw`bg-gray-100 rounded overflow-hidden mb-2`}
  width: 212px;
  height: 212px;

  @media (min-width: 768px) {
    width: 292px;
    height: 292px;
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

// 더미 데이터
const events = [
  { id: 1, title: "복숭복숭 할인 이벤트", discount: "~ 49%", price: "99,000원부터" },
  { id: 2, title: "피부 탄력 UP 이벤트", discount: "~ 35%", price: "120,000원부터" },
  { id: 3, title: "가을 리프팅 시즌", discount: "~ 42%", price: "150,000원부터" },
  { id: 4, title: "NEW 레이저 런칭 프로모션", discount: "~ 50%", price: "89,000원부터" },
  { id: 5, title: "기미 잡티 집중관리", discount: "~ 30%", price: "110,000원부터" },
]

const SpecialEventSection = () => {
  return (
    <Section>
      <Inner>
        <Header>
          <TitleBox>
            <NewBadge>New</NewBadge>
            <Title>최신 이벤트 소식</Title>
          </TitleBox>
          <MoreButton>전체 이벤트 보기</MoreButton>
        </Header>

        <StyledSwiperWrapper>
          {/* ✅ 커스텀 화살표 버튼 */}
          <div className="nav-button nav-prev">
            <img src={leftArrow} alt="이전" />
          </div>
          <div className="nav-button nav-next">
            <img src={rightArrow} alt="다음" />
          </div>

          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: ".nav-prev",
              nextEl: ".nav-next",
            }}
            breakpoints={{
              0: { slidesPerView: "auto", spaceBetween: 0 },
              768: { slidesPerView: "auto", spaceBetween: 0 },
              1024: { slidesPerView: "auto", spaceBetween: 0 },
            }}>
            {events.map((event) => (
              <StyledSwiperSlide key={event.id}>
                <Card>
                  <ImagePlaceholder />
                  <EventTitle>{event.title}</EventTitle>
                  <EventPrice>
                    <Discount>{event.discount}</Discount>
                    {event.price}
                  </EventPrice>
                </Card>
              </StyledSwiperSlide>
            ))}
          </Swiper>
        </StyledSwiperWrapper>
      </Inner>
    </Section>
  )
}

export default SpecialEventSection
