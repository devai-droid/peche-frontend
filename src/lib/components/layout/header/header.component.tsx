/* eslint-disable react/no-unused-prop-types */
import React, { useEffect, useState } from "react"
import tw from "twin.macro"
import {
  CloseIcon,
  HamburgerIcon,
  SearchIcon,
  ShoppingIcon,
  NaverBlogIcon,
  InstaLogoIcon,
  TiktokIcon,
  NaverPlaceIcon,
  KakaoFriendsIcon,
  WechatIcon,
  XIcon,
  FacebookIcon,
  LineIcon,
  WhatsappIcon,
} from "@/assets/icon"
import wechatQrImg from "@/assets/images/wechat-qr.png"
import { IconButton, Logo, MobileLogo } from "@/design-system/components"
import AppMaxWidth from "../app-max-width.component"
import useResponsive from "@/lib/hooks/use-responsive"
import HeaderLanguage from "./header-language.component"
import SearchModal from "@/pages/home/components/search-modal.component"
import MobileMenu from "./mobile-menu.component"
import useCustomNavigate from "@/lib/hooks/use-custom-navigate"
import { useTranslation } from "react-i18next"
import useLanguageValue from "@/lib/hooks/use-language-key"
import { Language } from "@/lib/locales/i18n.config"
import { useSearchControllerFindMany } from "@/lib/orval/search/search"
import CustomLink from "../../custom-link.component"
import Modal from "@/lib/components/modal/modal.component"
import useCart from "@/features/product/hooks/use-cart"

const HeaderContainer = tw.header`h-16 lg:h-20 relative bg-neutral`

interface MenuProps {
  isDesktop?: boolean
  setOpenSearch?: (open: boolean) => void
  onClickDrawer?: () => void
  clickedKeyword?: string
  setClickedKeyword?: (keyword: string) => void
  isMenuOpen?: boolean
  setIsMenuOpen?: (open: boolean) => void
}

interface SocialLinkItem {
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  url: string
  type?: undefined
  modalKey?: undefined
}

interface SocialModalItem {
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  type: "modal"
  modalKey: string
  url?: undefined
}

type SocialItem = SocialLinkItem | SocialModalItem

// 언어별 소셜 링크 & 아이콘 매핑
const SOCIAL_LINKS: Record<Language, SocialItem[]> = {
  ko: [
    { icon: NaverPlaceIcon, url: "https://naver.me/FLe0V59M" },
    { icon: NaverBlogIcon, url: "https://blog.naver.com/pecheclinic" },
    { icon: KakaoFriendsIcon, url: "http://pf.kakao.com/_dxoiLn" },
    { icon: InstaLogoIcon, url: "https://www.instagram.com/peche_clinic/" },
  ],
  en: [
    { icon: WhatsappIcon, url: "https://wa.me/821025326285" },
    { icon: InstaLogoIcon, url: "https://www.instagram.com/pecheclinic.en/" },
    { icon: TiktokIcon, url: "https://www.tiktok.com/@pecheclinic_eng?lang=ko-KR" },
  ],
  zh: [
    { icon: InstaLogoIcon, url: "https://www.instagram.com/pecheclinic.cn/" },
    // { icon: XiaoIcon, url: "" },
    { icon: WechatIcon, type: "modal", modalKey: "wechat" }, // QR 모달 표시
  ],
  "zh-TW": [
    { icon: InstaLogoIcon, url: "https://www.instagram.com/pecheclinic_tw/" },
    { icon: FacebookIcon, url: "https://www.facebook.com/profile.php?id=61582363886175" },
    { icon: LineIcon, url: "https://line.me/R/ti/p/@683jgqmd" },
  ],
  ja: [
    { icon: InstaLogoIcon, url: "https://www.instagram.com/pecheclinic.jp/" },
    { icon: LineIcon, url: "https://line.me/R/ti/p/@235wfyao" },
    {
      icon: TiktokIcon,
      url: "https://www.tiktok.com/@pecheclinic_jp?is_from_webapp=1&sender_device=pc",
    },
    { icon: XIcon, url: "https://x.com/pecheclinic_jp" },
  ],
  th: [
    { icon: InstaLogoIcon, url: "https://www.instagram.com/pecheclinic_th/" },
    { icon: FacebookIcon, url: "https://www.facebook.com/profile.php?id=61582230961269" },
    { icon: LineIcon, url: "https://line.me/R/ti/p/@892druai" },
    {
      icon: TiktokIcon,
      url: "https://www.tiktok.com/@pecheclinic_th?is_from_webapp=1&sender_device=pc",
    },
  ],
}

const LeftMenu = ({
  isDesktop,
  openWeChatModal,
}: {
  isDesktop?: boolean
  openWeChatModal?: () => void
}) => {
  const { i18n } = useTranslation()
  const language = i18n.language as Language

  if (!isDesktop) {
    return (
      <div tw="flex items-center gap-4">
        <MobileLogo />
      </div>
    )
  }

  const socialLinks = SOCIAL_LINKS[language] ?? SOCIAL_LINKS.ko

  return (
    <div tw="flex items-center gap-[7px]">
      {socialLinks.map((item, idx) => {
        const Icon = item.icon

        if (item.type === "modal") {
          return (
            <button
              key={idx}
              onClick={openWeChatModal}
              className="sns-btn-conversion"
              tw="flex items-center justify-center hover:opacity-80">
              <Icon width={24} height={24} />
            </button>
          )
        }

        return (
          <a
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            tw="flex items-center justify-center hover:opacity-80">
            <Icon width={24} height={24} />
          </a>
        )
      })}
    </div>
  )
}

const RightMenu = ({ isDesktop, isMenuOpen, setIsMenuOpen }: MenuProps) => {
  const { t } = useTranslation()
  const navigate = useCustomNavigate()
  const [openSearchModal, setOpenSearchModal] = React.useState(false)
  const { cart } = useCart()

  const totalCount = cart.reduce((acc, item) => acc + item.count, 0)

  return (
    <div tw="flex items-center">
      {/* 데스크탑 */}
      {isDesktop ? (
        <>
          <button
            tw="cursor-pointer flex items-center gap-1 text-[13px] md:text-[15px] font-normal"
            onClick={() => setOpenSearchModal(true)}>
            {t("header.search")}
          </button>
          <div tw="ml-6" />
          <button
            tw="ml-2 cursor-pointer flex items-center gap-1 text-[13px] md:text-[15px] leading-[150%] font-normal"
            onClick={() => navigate("/reservation/new")}>
            {t("header.shoppingCart")}
            <span tw="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#BD7B60] text-white text-[11px] font-medium">
              {totalCount}
            </span>
          </button>

          <div tw="ml-8" />
          <button tw="cursor-pointer" onClick={() => navigate("/reservation")}>
            {t("header.checkReservation")}
          </button>

          <div tw="w-3 ml-8" />
          <HeaderLanguage />
          <SearchModal open={openSearchModal} onClose={() => setOpenSearchModal(false)} />
        </>
      ) : (
        <>
          {/* 모바일: 메뉴 닫힘 상태 */}
          {!isMenuOpen && (
            <>
              <div tw="relative inline-flex">
                <IconButton
                  tw="p-2"
                  icon={ShoppingIcon}
                  onClick={() => navigate("/reservation/new")}
                />
                <span tw="absolute top-0.5 -right-0.5 flex items-center justify-center w-[16px] h-[16px] rounded-full bg-[#DA7F67] text-white text-[10px] font-medium">
                  {totalCount}
                </span>
              </div>
              <IconButton tw="p-2" icon={SearchIcon} onClick={() => setOpenSearchModal(true)} />
              <IconButton
                tw="p-2"
                icon={HamburgerIcon}
                iconSize={24}
                onClick={() => setIsMenuOpen?.(true)}
              />
              <SearchModal open={openSearchModal} onClose={() => setOpenSearchModal(false)} />
            </>
          )}

          {/* 모바일: 메뉴 열림 상태 */}
          {isMenuOpen && (
            <>
              <button
                tw="text-[14px] text-primary font-semibold mr-4 border-b border-primary"
                onClick={() => navigate("/reservation")}>
                {t("header.checkReservation")}
              </button>
              <HeaderLanguage />
              <IconButton
                tw="p-2"
                icon={CloseIcon}
                iconSize={24}
                onClick={() => setIsMenuOpen?.(false)}
              />
            </>
          )}
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
    <div tw="p-4 lg:p-6 rounded-lg border border-[#D0D0D0] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] font-pretendard">
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
          <IconButton icon={SearchIcon} tw="-ml-2" type="submit" />
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
                (language === "zh-TW" && event.visibleZHTW) ||
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openWeChatModal, setOpenWeChatModal] = useState(false)

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
          <div tw="absolute-center">{isDesktop && <Logo />}</div>
          <AppMaxWidth tw="h-full flex justify-between items-center font-pretendard md:text-[15px] text-[13px]">
            <LeftMenu isDesktop={isDesktop} openWeChatModal={() => setOpenWeChatModal(true)} />
            <RightMenu
              isDesktop={isDesktop}
              setOpenSearch={setOpenSearch}
              onClickDrawer={onClickDrawer}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
            />
          </AppMaxWidth>
          {!isDesktop && isMenuOpen && <MobileMenu />}
          <Modal open={openWeChatModal} onClose={() => setOpenWeChatModal(false)} width="max-w-md">
            <div tw="-mx-10 -my-8">
              {/* 상단 회색 영역 */}
              <div tw="bg-[#F3F3F3] w-full relative">
                <div tw="px-4 pb-3 pt-12">
                  <div tw="text-[24px] font-time text-neutral90">Peche clinic</div>
                </div>

                <button tw="absolute top-3 right-4" onClick={() => setOpenWeChatModal(false)}>
                  <CloseIcon width={22} height={22} />
                </button>
              </div>

              {/* QR 영역 */}
              <div tw="p-6 flex justify-center bg-white">
                <img src={wechatQrImg} alt="" tw="w-[240px] h-[240px] object-contain" />
              </div>
            </div>
          </Modal>
        </>
      )}
    </HeaderContainer>
  )
}

export default HeaderComponent
