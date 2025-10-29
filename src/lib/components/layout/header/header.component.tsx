/* eslint-disable react/no-unused-prop-types */
import { useEffect, useState } from "react"
import tw from "twin.macro"
import { CalendarIcon, CloseIcon, HamburgerIcon, SearchThinIcon, ShoppingIcon } from "@/assets/icon"
import { IconButton, Logo } from "@/design-system/components"
import AppMaxWidth from "../app-max-width.component"
import useResponsive from "@/lib/hooks/use-responsive"
import HeaderLanguage from "./header-language.component"
import useCustomNavigate from "@/lib/hooks/use-custom-navigate"
import { useTranslation } from "react-i18next"
import useLanguageValue from "@/lib/hooks/use-language-key"
import { Language } from "@/lib/locales/i18n.config"
import { useSearchControllerFindMany } from "@/lib/orval/search/search"
import CustomLink from "../../custom-link.component"

const HeaderContainer = tw.header`h-20 lg:h-24 relative`

interface MenuProps {
  isDesktop?: boolean
  setOpenSearch?: (open: boolean) => void
  onClickDrawer?: () => void
  clickedKeyword?: string
  setClickedKeyword?: (keyword: string) => void
}

const LeftMenu = ({ isDesktop, onClickDrawer }: MenuProps) =>
  !isDesktop ? (
    <div tw="flex items-center gap-4">
      <IconButton icon={HamburgerIcon} iconSize={24} onClick={onClickDrawer} />
      <HeaderLanguage />
    </div>
  ) : (
    <div />
  )

const RightMenu = ({ isDesktop, setOpenSearch }: MenuProps) => {
  const navigate = useCustomNavigate()
  return (
    <div tw="flex items-center">
      <IconButton icon={ShoppingIcon} onClick={() => navigate("/reservation/new")} />
      {!isDesktop && <IconButton icon={SearchThinIcon} onClick={() => setOpenSearch?.(true)} />}
      {isDesktop && <IconButton icon={CalendarIcon} onClick={() => navigate("/reservation")} />}
      {isDesktop && (
        <>
          <div tw="w-3" />
          <HeaderLanguage />
        </>
      )}
    </div>
  )
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

const Search = ({ setOpenSearch, clickedKeyword, setClickedKeyword }: MenuProps) => {
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

  // Use a state variable to track the delayed search term
  const [delayedSearchTerm, setDelayedSearchTerm] = useState("")

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDelayedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const { data: searchResults } = useSearchControllerFindMany({
    query: delayedSearchTerm !== "" ? delayedSearchTerm : undefined,
  })

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return ""
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
  }

  return (
    <div tw="h-full flex items-center mx-4">
      <div tw="w-full border-b border-black flex items-center mr-4">
        <form
          tw="contents"
          onSubmit={(e) => {
            e.preventDefault()
          }}>
          <IconButton icon={SearchThinIcon} tw="-ml-2" type="submit" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("header.searchSurgery")}
            tw="w-full p-2 text-sm outline-none"
          />
        </form>
      </div>
      <IconButton
        icon={CloseIcon}
        onClick={() => {
          setOpenSearch?.(false)
          setClickedKeyword?.("")
        }}
      />
      {/* 여기에 검색 결과 보여주기. */}
      {searchResults && delayedSearchTerm && (
        <div
          tw="absolute left-0 mt-2 top-20 bg-white z-10 overflow-y-auto"
          style={{
            maxHeight: "calc(100vh - 90px)",
            width: "100%",
          }}>
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
                self.findIndex((e) => tv(e, "name")?.trim().toLowerCase() === eventName) === index
              )
            })
            .map((event) => (
              <Product
                key={event.id}
                pageId={event.detailPage ? event.detailPage.id : event.id}
                name={tv(event, "name")}
                description={truncateText(tv(event, "description"), 60)}
                setOpenSearch={() => setOpenSearch?.(false)}
              />
            ))}
          {searchResults.products.map((product) => (
            <Product
              key={product.id}
              pageId={product.detailPage ? product.detailPage.id : product.id}
              name={tv(product, "name")}
              description={truncateText(tv(product, "description"), 60)}
              setOpenSearch={() => setOpenSearch?.(false)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface Props {
  onClickDrawer?: () => void
  clickedKeyword?: string
  setClickedKeyword?: (keyword: string) => void
}

const HeaderComponent = ({ onClickDrawer, clickedKeyword, setClickedKeyword }: Props) => {
  const { isDesktop } = useResponsive()
  const [openSearch, setOpenSearch] = useState(false)

  useEffect(() => {
    if (clickedKeyword && !isDesktop) {
      setOpenSearch(true)
    }
  }, [clickedKeyword])

  return (
    <HeaderContainer>
      {openSearch ? (
        <Search
          setOpenSearch={setOpenSearch}
          clickedKeyword={clickedKeyword}
          setClickedKeyword={setClickedKeyword}
        />
      ) : (
        <>
          <div tw="w-24 lg:w-36 absolute-center">
            <Logo />
          </div>
          <AppMaxWidth tw="h-full flex justify-between items-center">
            <LeftMenu isDesktop={isDesktop} onClickDrawer={onClickDrawer} />
            <RightMenu isDesktop={isDesktop} setOpenSearch={setOpenSearch} />
          </AppMaxWidth>
        </>
      )}
    </HeaderContainer>
  )
}

export default HeaderComponent
