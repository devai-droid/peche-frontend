import React, { useRef } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import tw, { styled } from "twin.macro"
import useResponsive from "@/lib/hooks/use-responsive"
import { useTranslation } from "react-i18next"
import { menuLinks } from "@/routers/links"
import CustomLink from "@/lib/components/custom-link.component"

const Container = tw.nav`
relative
h-[55px]
bg-white
text-neutralBlack
`

const DesktopLinkContainer = tw.div`
  w-max h-full flex items-center justify-center
  gap-[2rem]
  absolute-center
`

const TextLink = styled(CustomLink)<{ selected: boolean }>(({ selected }) => [
  tw`p-4 text-[17px] font-medium tracking-[-0.02em] transition-colors duration-200 relative pb-[10px] hover:text-[#DA7F67]`,
  selected
    ? tw`text-[#DA7F67] font-semibold border-b-[3px] border-[#DA7F67]`
    : tw`text-neutralBlack border-b-[3px] border-transparent`,
])

const DotWrapper = styled.div<{ hasDot?: boolean }>(({ hasDot }) => [
  tw`relative inline-flex items-end`,

  hasDot &&
    tw`
      after:(content-[''] absolute top-[17px] right-[6px]
      w-[8px] h-[8px] bg-[#DA7F67] rounded-full)
    `,
])

const HeaderNavigator = () => {
  const { isDesktop } = useResponsive()
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isOpenAllMenu, setIsOpenAllMenu] = React.useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 페이지 변경될 때 전체 시술 페이지면 드롭다운 자동 오픈
  React.useEffect(() => {
    const isAllPage = location.pathname.includes("/treatment")
    if (isAllPage) {
      setIsOpenAllMenu(true)
    }
  }, [location.pathname])

  // 공백 마우스 클릭 시 드랍다운 메뉴 OFF
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!dropdownRef.current) {
        return
      }
      if (!isOpenAllMenu) {
        return
      }

      if (!dropdownRef.current.contains(e.target as Node)) {
        setIsOpenAllMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpenAllMenu])

  const isSelected = (href: string) => {
    const currentPath = location.pathname.replace(/^\/(ko|en|ja|zh-TW|zh|tw|th)/, "")
    return currentPath === href || currentPath.startsWith(`${href}/`)
  }

  const customNavigate = (to: string) => {
    const lang = i18n.language
    const langPrefix = to.startsWith("/") ? `/${lang}` : ""

    const path = searchParams.get("path_visit")
    const detail = searchParams.get("detail_visit")
    const search = `path_visit=${path}&detail_visit=${detail}`

    if (path === null) {
      navigate(`${langPrefix}${to}`)
      return
    }

    const searchString = to.includes("?") ? `&${search}` : `?${search}`
    navigate(`${langPrefix}${to}${searchString}`)
  }

  const handleClickAll = () => {
    const isAllPage = location.pathname.includes("/treatment")

    setIsOpenAllMenu((prev) => !prev)

    if (!isAllPage) {
      customNavigate("/treatment")
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const handleSelectFromDropdown = (item: any) => {
    customNavigate(`/treatment?type=${item.id}`)
    setIsOpenAllMenu(false)
  }

  const TextButton = styled.button<{ selected: boolean }>(({ selected }) => [
    tw`p-4 text-[17px] font-medium tracking-[-0.02em] transition-colors duration-200 relative pb-[10px] font-pretendard`,
    selected
      ? tw`text-[#DA7F67] font-semibold border-b-[3px] border-[#DA7F67]`
      : tw`text-neutralBlack border-b-[3px] border-transparent`,
  ])

  if (!isDesktop) return null

  return (
    <Container>
      <DesktopLinkContainer>
        {menuLinks
          .filter((link) => !link.excludeLanguages?.includes(i18n.language))
          .map((link) => {
          const isAll = link.name === "header.treatmentList"

          if (isAll) {
            return (
              <TextButton
                key={link.name}
                selected={isSelected("/treatment")}
                onClick={handleClickAll}>
                {t(link.name)}
              </TextButton>
            )
          }

          return (
            <DotWrapper key={link.name} hasDot={link.name === "header.event"}>
              <TextLink to={link.href} selected={isSelected(link.href)}>
                <div tw="font-pretendard">{t(link.name)}</div>
              </TextLink>
            </DotWrapper>
          )
        })}
      </DesktopLinkContainer>

      {/* {isOpenAllMenu && (
        <div ref={dropdownRef}>
          <AllTreatmentDropdown
            onSelect={handleSelectFromDropdown}
            selectedId={selectedType}
            selectedGroupId={selectedGroupId}
          />
        </div>
      )} */}
    </Container>
  )
}

export default HeaderNavigator
