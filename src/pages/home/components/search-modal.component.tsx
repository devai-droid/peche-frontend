/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react"
import tw, { styled } from "twin.macro"
import { CSSTransition } from "react-transition-group"
import { useTranslation } from "react-i18next"
import { Language } from "@/lib/locales/i18n.config"
import { IconButton } from "@/design-system/components"
import { CloseIcon, SearchSmallIcon, SearchPrimaryIcon } from "@/assets/icon"
import CustomLink from "@/lib/components/custom-link.component"

import { useSearchKeywordControllerFindMany } from "@/lib/orval/search-keywords/search-keywords"
import { useSearchControllerFindMany } from "@/lib/orval/search/search"
import useLanguageValue from "@/lib/hooks/use-language-key"

const Overlay = tw.div`
  fixed inset-0 bg-black bg-opacity-40 z-[500]
  flex justify-center items-start overflow-auto
`

const ModalOuter = tw.div`
  w-full md:w-[900px] mt-[4rem] md:mt-[9rem]
  bg-[#FEF5EA] rounded-t-none shadow-xl
`

// 내부 박스 (화이트 영역)
const ModalInner = tw.div`
  bg-white w-full rounded-none py-2 px-[24px] md:px-10 md:min-h-[400px] min-h-[250px]
`

const HeaderArea = tw.div`
  flex justify-end mb-3
`

const Title = styled.h2`
  ${tw`text-[22px] md:text-[28px] font-semibold text-neutralBlack mb-6 text-center`}
  span {
    ${tw`text-primary`}
  }
`

// 검색 UI
const SearchBar = tw.div`
  flex items-center bg-white border-b-[1.6px] border-neutral20
  rounded-none px-4 py-3 shadow-sm max-w-[600px] sm:mx-auto mb-4 mx-[24px]
`

const Input = tw.input`
  flex-1 text-[16px] text-gray-700 placeholder-neutral60 focus:outline-none
`

// 추천 검색어
const SuggestBox = tw.div`
  flex flex-wrap gap-3 text-[14px] md:text-[16px] text-neutral70
  max-w-[600px] sm:mx-auto mx-[24px]
  mb-6
`

const SuggestTitle = tw.span`font-semibold text-neutralBlack mr-2`
const SuggestKeyword = tw.span`cursor-pointer hover:text-primary transition`

// 검색 결과
const ResultContainer = tw.div`
  max-w-[900px] mx-auto bg-white
  px-0 pt-0 pb-6
`

const ProductCard = tw.div`
  border-b border-gray-200 py-5 cursor-pointer
`

const ProductTitle = tw.div`
  text-[16px] md:text-[18px] font-semibold text-neutralBlack mb-2
`

const ProductDesc = tw.div`
  text-[14px] text-neutral70 leading-[140%]
`

const NoResult = tw.div`
  w-full flex justify-center items-center py-10
  text-neutral90 text-[13px] md:text-[14px]
`

interface Props {
  open: boolean
  onClose: () => void
}

const SearchModal = ({ open, onClose }: Props) => {
  const { t, i18n } = useTranslation()
  const tv = useLanguageValue()
  const language = i18n.language as Language

  const [searchTerm, setSearchTerm] = useState("")
  const [delayedSearchTerm, setDelayedSearchTerm] = useState("")

  // 디바운스
  useEffect(() => {
    const timer = setTimeout(() => setDelayedSearchTerm(searchTerm), 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // 추천 키워드
  const { data: keywordsList } = useSearchKeywordControllerFindMany({
    page: 1,
    limit: 10,
    languageLocale: language,
  })

  // 검색 결과 API
  const { data: searchResults } = useSearchControllerFindMany({
    query: delayedSearchTerm || undefined,
  })

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const truncate = (t: string, len: number) => (t?.length > len ? `${t.slice(0, len)}...` : t)

  // 검색어와 일치하는 부분만 primary 색상으로 하이라이트
  const highlight = (text: string, keyword: string) => {
    if (!text || !keyword) return text

    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // 정규식 특수문자 처리
    const regex = new RegExp(`(${escaped})`, "gi")

    return text.replace(regex, `<span style="color:#DA7F67;">$1</span>`)
  }

  return (
    <CSSTransition in={open} timeout={200} classNames="fade" unmountOnExit>
      <Overlay>
        <ModalOuter>
          <HeaderArea>
            <IconButton icon={CloseIcon} onClick={onClose} />
          </HeaderArea>

          <Title>
            어떤 <span>시술</span>이 궁금하신가요?
          </Title>

          <SearchBar>
            <Input
              placeholder="시술명, 효과로 검색해보세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton icon={SearchPrimaryIcon} iconSize={20} tw="w-5 h-5 ml-2" />
          </SearchBar>

          <SuggestBox>
            <SuggestTitle>추천 검색어</SuggestTitle>
            {keywordsList?.items.map((kw) => (
              <SuggestKeyword key={kw.id} onClick={() => setSearchTerm(kw.keyword)}>
                {kw.keyword}
              </SuggestKeyword>
            ))}
          </SuggestBox>

          {/* 아래는 흰색 검색결과 영역 */}
          <ModalInner>
            <ResultContainer>
              {delayedSearchTerm && searchResults && (
                <>
                  {searchResults.events.length === 0 && searchResults.products.length === 0 ? (
                    <NoResult>검색 결과가 없습니다</NoResult>
                  ) : (
                    <>
                      {/* 이벤트 검색결과 */}
                      {searchResults.events
                        .filter((event) => {
                          return (
                            (language === "ko" && event.visible) ||
                            (language === "en" && event.visibleEN) ||
                            (language === "ja" && event.visibleJA) ||
                            (language === "zh" && event.visibleZH) ||
                            (language === "th" && event.visibleTH)
                          )
                        })
                        .map((ev) => (
                          <CustomLink
                            to={`/products/${ev.detailPage?.id}`}
                            key={ev.id}
                            onClick={onClose}>
                            <ProductCard>
                              <ProductTitle
                                dangerouslySetInnerHTML={{
                                  __html: highlight(tv(ev, "name"), delayedSearchTerm),
                                }}
                              />
                              <ProductDesc
                                dangerouslySetInnerHTML={{
                                  __html: highlight(
                                    truncate(tv(ev, "description"), 80),
                                    delayedSearchTerm,
                                  ),
                                }}
                              />
                            </ProductCard>
                          </CustomLink>
                        ))}

                      {/* 상품 검색결과 */}
                      {searchResults.products.map((pd) => (
                        <CustomLink
                          to={`/products/${pd.detailPage?.id}`}
                          key={pd.id}
                          onClick={onClose}>
                          <ProductCard>
                            <ProductTitle
                              dangerouslySetInnerHTML={{
                                __html: highlight(tv(pd, "name"), delayedSearchTerm),
                              }}
                            />
                            <ProductDesc
                              dangerouslySetInnerHTML={{
                                __html: highlight(
                                  truncate(tv(pd, "description"), 80),
                                  delayedSearchTerm,
                                ),
                              }}
                            />
                          </ProductCard>
                        </CustomLink>
                      ))}
                    </>
                  )}
                </>
              )}
            </ResultContainer>
          </ModalInner>
        </ModalOuter>
      </Overlay>
    </CSSTransition>
  )
}

export default SearchModal
