import React from "react"
import tw, { styled } from "twin.macro"
import searchImage from "@/assets/images/search-image.png"
import searchPrimaryIcon from "@/assets/images/search-primary.png"

const Section = tw.section`
  w-full bg-white py-12 md:py-20 font-pretendard tracking-tight
`

const Inner = tw.div`
  max-w-[1440px] mx-auto flex flex-col md:flex-row items-stretch overflow-hidden rounded-none
`

// ✅ 반응형 height 적용 (모바일: 192px, 데스크탑: 350px)
const ImageBox = styled.div`
  ${tw`w-full md:w-1/2 bg-gray-100`}
  height: 192px;

  @media (min-width: 500px) {
    height: 350px;
  }

  img {
    ${tw`w-full h-full object-cover`}
  }
`

const SearchBox = styled.div`
  ${tw`
    w-full md:w-1/2 flex flex-col justify-center
    bg-[#FFF6EE] px-6 md:px-16 py-6 md:py-0
  `}
  height: 192px;

  @media (min-width: 768px) {
    height: 350px;
  }
`

const Title = styled.h2`
  ${tw`text-[24px] md:text-[30px] font-semibold text-neutralBlack mb-4 md:mb-6`}
  span {
    ${tw`text-primary`}
  }
`

const SearchBar = styled.div`
  ${tw`
    flex items-center w-full bg-white border border-gray-200
    rounded-none px-3 md:px-4 py-2 md:py-3 mb-3 md:mb-4 shadow-sm
  `}
  max-width: 500px;
`

const Input = styled.input`
  ${tw`
    flex-1 text-[14px] md:text-[16px] text-gray-700 placeholder-neutral60
    focus:outline-none
  `}
`

const SearchIcon = tw.img`
  w-4 h-4 md:w-5 md:h-5 ml-2 object-contain
`

const SuggestBox = tw.div`
  flex flex-wrap gap-2 md:gap-3 text-[12px] md:text-[15px] text-gray-600
`

const SuggestTitle = tw.span`
  font-semibold text-black
`

const SuggestKeyword = styled.span`
  ${tw`cursor-pointer hover:text-primary transition`}
`

const keywords = ["볼뉴머", "써마지", "티타늄", "티타늄"]

const SearchSection = () => {
  return (
    <Section>
      <Inner>
        {/* 왼쪽 이미지 */}
        <ImageBox>
          <img src={searchImage} alt="search visual" loading="lazy" />
        </ImageBox>

        {/* 오른쪽 검색 박스 */}
        <SearchBox>
          <Title>
            어떤 <span>시술</span>이 궁금하신가요?
          </Title>

          <SearchBar>
            <Input placeholder="시술명, 효과로 검색해보세요" />
            <SearchIcon src={searchPrimaryIcon} alt="search icon" />
          </SearchBar>

          <SuggestBox>
            <SuggestTitle>추천 검색어</SuggestTitle>
            {keywords.map((kw, idx) => (
              <SuggestKeyword key={idx}>{kw}</SuggestKeyword>
            ))}
          </SuggestBox>
        </SearchBox>
      </Inner>
    </Section>
  )
}

export default SearchSection
