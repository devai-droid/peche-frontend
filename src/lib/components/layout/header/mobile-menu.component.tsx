import React from "react"
import tw from "twin.macro"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"
import { menuLinks } from "@/routers/links"

const Container = tw.nav`w-full bg-white border-t border-[#EBECEF]`
const MenuItem = tw.button`
  w-full text-left px-6 py-4 text-[16px] font-semibold text-neutralBlack font-pretendard
  border-b border-[#EBECEF]
  transition-colors duration-200
  hover:(bg-gray-100)
`

const MobileMenu = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // 데스크탑 header와 동일한 언어 prefix + query 유지 이동 함수
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

  return (
    <Container>
      {menuLinks.map((link) => (
        <MenuItem key={link.name} onClick={() => customNavigate(link.href)}>
          {t(link.name)}
        </MenuItem>
      ))}
    </Container>
  )
}

export default MobileMenu
