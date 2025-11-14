import React, { useRef } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import tw, { styled } from "twin.macro"
import useResponsive from "@/lib/hooks/use-responsive"
import { useTranslation } from "react-i18next"
import { menuLinks } from "@/routers/links"
import CustomLink from "@/lib/components/custom-link.component"
import AllTreatmentDropdown from "@/pages/treatment/all-treatment-dropdown"
// 나중에 수정
import { dummyTreatments } from "@/pages/treatment/dummyTreatments"

const Container = tw.nav`
relative
h-[55px]
bg-white
text-neutralBlack
`

const DesktopLinkContainer = tw.div`
  w-max h-full flex items-center justify-center
  gap-[4rem]
  absolute-center
`

const TextLink = styled(CustomLink)<{ selected: boolean }>(({ selected }) => [
  tw`p-4 text-[17px] font-medium tracking-[-0.02em] transition-colors duration-200 relative pb-[10px]`,
  selected
    ? tw`text-[#DA7F67] font-semibold border-b-[3px] border-[#DA7F67]`
    : tw`text-neutralBlack border-b-[3px] border-transparent`,
])

const HeaderNavigator = () => {
  const { isDesktop } = useResponsive()
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isOpenAllMenu, setIsOpenAllMenu] = React.useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const urlType = searchParams.get("type")
  // 나중에 수정해야됨. 첫 시술 고르는 부분임
  function getDefaultType() {
    return dummyTreatments[0].children[0].id
  }

  function resolveChildType(type: string | null) {
    if (!type) return getDefaultType()

    // 모든 child를 하나의 array로 펼친 뒤 검색
    const allChildren = dummyTreatments.flatMap((g) => g.children)

    const found = allChildren.find((c) => c.id === type)

    return found ? found.id : getDefaultType()
  }

  const selectedType = resolveChildType(urlType)

  function resolveSelectedGroup(type: string) {
    return (
      dummyTreatments.find((group) => group.children.some((child) => child.id === type))?.id ??
      dummyTreatments[0].id
    )
  }

  const selectedGroupId = resolveSelectedGroup(selectedType)

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
        console.log("1", dropdownRef, isOpenAllMenu)
        return
      }
      if (!isOpenAllMenu) {
        console.log("2", isOpenAllMenu)
        return
      }

      if (!dropdownRef.current.contains(e.target as Node)) {
        console.log("close it!")
        setIsOpenAllMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpenAllMenu])

  const isSelected = (href: string) => {
    const currentPath = location.pathname.replace(/^\/(ko|en|ja|zh|th)/, "")
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

  const handleSelectFromDropdown = (item: any) => {
    customNavigate(`/treatment?type=${item.id}`)
    setIsOpenAllMenu(false)
  }

  const TextButton = styled.button<{ selected: boolean }>(({ selected }) => [
    tw`p-4 text-[17px] font-medium tracking-[-0.02em] transition-colors duration-200 relative pb-[10px]`,
    selected
      ? tw`text-[#DA7F67] font-semibold border-b-[3px] border-[#DA7F67]`
      : tw`text-neutralBlack border-b-[3px] border-transparent`,
  ])

  if (!isDesktop) return null

  return (
    <Container>
      <DesktopLinkContainer>
        {menuLinks.map((link) => {
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
            <TextLink to={link.href} key={link.name} selected={isSelected(link.href)}>
              <div>{t(link.name)}</div>
            </TextLink>
          )
        })}
      </DesktopLinkContainer>

      {isOpenAllMenu && (
        <div ref={dropdownRef}>
          <AllTreatmentDropdown
            onSelect={handleSelectFromDropdown}
            selectedId={selectedType}
            selectedGroupId={selectedGroupId}
          />
        </div>
      )}
    </Container>
  )
}

export default HeaderNavigator
