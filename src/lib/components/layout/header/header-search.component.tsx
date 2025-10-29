/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import tw from "twin.macro"
import { CSSTransition } from "react-transition-group"
import AppMaxWidth from "../app-max-width.component"
import { IconButton } from "@/design-system/components"
import { CloseIcon, SearchSmallIcon } from "@/assets/icon"
import CustomLink from "@/lib/components/custom-link.component"
import { useTranslation } from "react-i18next"
import { useSearchKeywordControllerFindMany } from "@/lib/orval/search-keywords/search-keywords"
import { Language } from "@/lib/locales/i18n.config"
import useLanguageValue from "@/lib/hooks/use-language-key"
import { useSearchControllerFindMany } from "@/lib/orval/search/search"

import "./header-search.component.scss"

const Container = tw.div`h-28 relative`
const Between = tw.div`h-full flex items-center justify-between px-6 text-[#1d1d1d]`

const SearchArea = tw.div`w-[34rem]`
const SearchInput = tw.div`w-full border-b-2 border-[#7d7d7d] flex`

const RecommendContainer = tw.div`font-nanumgothic h-10 leading-10 text-[#666] text-sm flex`

interface Props {
  open?: boolean
  setOpen: (open: boolean) => void
  clickedKeyword?: string
  setClickedKeyword?: (keyword: string) => void
}

interface ProductProps {
  name: string
  description: string
  pageId: string
  setOpenSearch: () => void
}
const Product = ({ name, description, pageId, setOpenSearch }: ProductProps) => {
  const { t } = useTranslation()
  const handleLinkClick = () => {
    // 클릭시 검색창 닫기 (이미 해당 페이지에 있으면 안 닫히는 문제 있어서 추가됨)
    setOpenSearch() // Close the search
  }

  return (
    <div tw="p-4 lg:p-6 rounded-lg border border-[#D0D0D0] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] font-nanumgothic">
      <div tw="text-[#333] text-lg font-bold">{name}</div>
      <div tw="mt-5 mb-3">{description}</div>
      <div tw="relative text-right">
        <div tw="md:absolute right-0 bottom-0">
          <CustomLink
            to={`/products/${pageId}`}
            tw="inline-block rounded-full px-3 h-10 leading-10 border border-point text-point text-xs"
            onClick={handleLinkClick}>
            {t("products.detail")}
          </CustomLink>
        </div>
      </div>
    </div>
  )
}

const HeaderSearch = ({ open = false, setOpen, clickedKeyword, setClickedKeyword }: Props) => {
  const { t, i18n } = useTranslation()
  const language = i18n.language as Language
  const tv = useLanguageValue()
  const [searchTerm, setSearchTerm] = useState("")

  // 홈에서 인기 키워드 클릭시 검색어로 설정
  useEffect(() => {
    if (clickedKeyword) {
      setSearchTerm(clickedKeyword)
    }
  }, [clickedKeyword])

  const { data: keywordsList } = useSearchKeywordControllerFindMany({
    page: 1,
    limit: 10,
    languageLocale: language,
  })
  // Use a state variable to track the delayed search term
  const [delayedSearchTerm, setDelayedSearchTerm] = useState("")

  useEffect(() => {
    // Set a timeout to update the delayed search term after a delay
    const timeoutId = setTimeout(() => {
      setDelayedSearchTerm(searchTerm)
    }, 500)

    // Clear the timeout if the search term changes before the delay
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Only call the search API when delayedSearchTerm is not an empty string
  const { data: searchResults } = useSearchControllerFindMany({
    query: delayedSearchTerm !== "" ? delayedSearchTerm : undefined,
  })

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return ""
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
  }

  return (
    <CSSTransition
      in={open}
      timeout={300}
      classNames="header-search-wrapper__content"
      unmountOnExit>
      <div
        tw="bg-white shadow-[0px_5px_5px_0px_rgba(0,0,0,0.21)] overflow-y-auto"
        style={{ height: "calc(100vh - 200px)" }}>
        <AppMaxWidth>
          <Container>
            <div tw="absolute-center">
              <SearchArea>
                <SearchInput>
                  <input
                    tw="text-lg border-none outline-none flex-1 px-4"
                    placeholder={t("header.searchSurgery")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <IconButton icon={SearchSmallIcon} iconSize={20} tw="!text-[#7d7d7d]" />
                </SearchInput>
                <RecommendContainer>
                  <div tw="mx-2">{t("header.recommendKeyword")}:</div>
                  {keywordsList &&
                    keywordsList.items.map((recommend, index) => {
                      return (
                        <button
                          key={index}
                          tw="cursor-pointer px-2"
                          onClick={() => setSearchTerm(recommend.keyword)}>
                          {recommend.keyword}
                        </button>
                      )
                    })}
                </RecommendContainer>
              </SearchArea>
            </div>
            <Between>
              <div tw="font-inter text-xl">SEARCH</div>
              <IconButton
                icon={CloseIcon}
                onClick={() => {
                  setOpen?.(false)
                  setClickedKeyword?.("")
                }}
              />
            </Between>
            {/* 여기에 검색 결과 보여주기. */}
            {searchResults && delayedSearchTerm && (
              <div>
                {searchResults.events
                  .filter((event) => {
                    // Filter for language-specific visibility
                    const isVisible =
                      (language === "ko" && event.visible) ||
                      (language === "en" && event.visibleEN) ||
                      (language === "ja" && event.visibleJA) ||
                      (language === "zh" && event.visibleZH) ||
                      (language === "th" && event.visibleTH)
                    return isVisible
                  })
                  .filter((event, index, self) => {
                    // Remove duplicates based on unique event name
                    const eventName = tv(event, "name")?.trim().toLowerCase()
                    return (
                      self.findIndex((e) => tv(e, "name")?.trim().toLowerCase() === eventName) ===
                      index
                    )
                  })
                  .map((event) => (
                    <Product
                      key={event.id}
                      pageId={event.detailPage ? event.detailPage.id : event.id}
                      name={tv(event, "name")}
                      description={truncateText(tv(event, "description"), 60)}
                      setOpenSearch={() => setOpen?.(false)}
                    />
                    // Adjust the property name based on your actual API response structure
                  ))}
                {searchResults.products.map((product) => (
                  <Product
                    key={product.id}
                    pageId={product.detailPage ? product.detailPage.id : product.id}
                    name={tv(product, "name")}
                    description={truncateText(tv(product, "description"), 60)}
                    setOpenSearch={() => setOpen?.(false)}
                  />
                ))}
              </div>
            )}
          </Container>
        </AppMaxWidth>
      </div>
    </CSSTransition>
  )
}

export default HeaderSearch
