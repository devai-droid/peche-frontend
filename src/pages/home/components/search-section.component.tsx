import React from "react"
import tw, { styled } from "twin.macro"
import searchImage from "@/assets/images/search-image.png"
import { SearchPrimaryIcon } from "@/assets/icon"
import SearchModal from "./search-modal.component"
import { useSearchKeywordControllerFindMany } from "@/lib/orval/search-keywords/search-keywords"
import { useTranslation } from "react-i18next"
import { Language } from "@/lib/locales/i18n.config"

// Layout
const Section = tw.section`
  w-full bg-white py-12 md:py-20 font-pretendard tracking-tight
`

const Inner = styled.div`
  ${tw`max-w-[1440px] mx-auto px-0 flex flex-col items-stretch overflow-hidden rounded-none`}

  @media (min-width: 1025px) {
    ${tw`px-10 flex-row`}
  }
`

const ImageBox = styled.div`
  ${tw`w-full bg-gray-100`}
  height: 192px;

  @media (min-width: 500px) {
    height: 350px;
  }

  @media (min-width: 1025px) {
    ${tw`w-1/2`}
  }

  img {
    ${tw`w-full h-full object-cover`}
  }
`

const SearchBox = styled.div`
  ${tw`
    w-full flex flex-col justify-center
    bg-[#FFF6EE] px-6 py-6
  `}
  height: 192px;

  @media (min-width: 1025px) {
    ${tw`w-1/2 px-16 py-0`}
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
    flex items-center w-full bg-white border-b border-neutral20
    rounded-none px-3 md:px-4 py-2 md:py-3 mb-3 md:mb-4 shadow-sm h-[50px]
  `}
  max-width: 500px;
`

const Input = styled.input`
  ${tw`
    flex-1 text-[14px] md:text-[16px] text-gray-700 placeholder-neutral60
    focus:outline-none
  `}
`

const SearchIcon = styled(SearchPrimaryIcon)`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-left: 8px; /* ml-2 동일 */
`

const SuggestBox = tw.div`
  flex flex-wrap gap-2 md:gap-3 text-[13px] md:text-[14px] text-neutral70
`

const SuggestTitle = tw.span`
  font-semibold text-neutralBlack 
`

const SuggestKeyword = styled.span`
  ${tw`cursor-pointer hover:text-primary transition`}
`

const SearchSection = () => {
  const { t, i18n } = useTranslation()
  const language = i18n.language as Language
  const [openSearchModal, setOpenSearchModal] = React.useState(false)

  // 추천 검색어 불러오기
  const { data: keywordsList } = useSearchKeywordControllerFindMany({
    page: 1,
    limit: 10,
    languageLocale: language,
  })

  const keywords = keywordsList?.items ?? []

  const renderTitle = () => {
    if (language === "ko") {
      return (
        <>
          {t("search.titlePrefix")} <span tw="text-primary">{t("search.highlight")}</span>
          {t("search.titleSuffix")}
        </>
      )
    }
    // 나머지 언어는 색상 강조 없이 전체 문장 그대로
    return <>{t("search.full")}</>
  }

  return (
    <Section>
      <Inner>
        {/* 왼쪽 이미지 */}
        <ImageBox>
          <img src={searchImage} alt="search visual" loading="lazy" />
        </ImageBox>

        {/* 오른쪽 검색 박스 */}
        <SearchBox>
          <Title>{renderTitle()}</Title>
          <SearchBar onClick={() => setOpenSearchModal(true)}>
            <Input
              placeholder={t("search.placeholder")}
              readOnly
              onFocus={(e) => e.target.blur()}
            />
            <SearchIcon />
          </SearchBar>

          <SuggestBox>
            <SuggestTitle>{t("search.suggestion")}</SuggestTitle>
            {keywords.map((kw) => (
              <SuggestKeyword key={kw.id}>{kw.keyword}</SuggestKeyword>
            ))}
          </SuggestBox>
        </SearchBox>
      </Inner>
      <SearchModal open={openSearchModal} onClose={() => setOpenSearchModal(false)} />
    </Section>
  )
}

export default SearchSection
