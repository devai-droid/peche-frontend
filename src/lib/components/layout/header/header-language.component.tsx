import React, { useEffect } from "react"
import tw from "twin.macro"
import { Dropdown, DropdownItem, Icon } from "@/design-system/components"
import { useTranslation } from "react-i18next"
import useResponsive from "@/lib/hooks/use-responsive"
import { GlobeIcon } from "@/assets/icon"
import { Language } from "@/lib/locales/i18n.config"
import { useLocation, useNavigate } from "react-router-dom"

const displayLanguages = [
  {
    key: Language.KOR,
    value: "KOR",
    mobileValue: "KOR",
  },
  {
    key: Language.JPN,
    value: "JPN",
    mobileValue: "JPN",
  },
  {
    key: Language.CHN,
    value: "CHN",
    mobileValue: "CHN",
  },
  {
    key: Language.ENG,
    value: "ENG",
    mobileValue: "ENG",
  },
  {
    key: Language.THA,
    value: "THA",
    mobileValue: "THA",
  },
  {
    key: Language.TWN,
    value: "TWN",
    mobileValue: "TWN",
  },
]

const HeaderLanguage = () => {
  const { i18n } = useTranslation()
  const { isDesktop } = useResponsive()
  const navigate = useNavigate()
  const location = useLocation()

  const urlValue = location.pathname.split("/")[1]

  useEffect(() => {
    Object.values(Language).forEach((lang) => {
      if (urlValue === lang && i18n.language !== lang) {
        i18n.changeLanguage(lang)
      }
    })
  }, [urlValue])

  const language = displayLanguages.find((lang) => lang.key === i18n.language)
  return (
    <Dropdown
      element={({ openDropdown, open }) => (
        <button onClick={openDropdown} tw="flex items-center">
          {isDesktop ? (
            <div tw="font-pretendard mr-2">{language?.value}</div>
          ) : (
            <Icon icon={GlobeIcon} tw="mr-3" />
          )}
        </button>
      )}>
      {(closeDropdown) =>
        displayLanguages.map((lang) => (
          <DropdownItem
            key={lang.key}
            tw="md:text-[15px] text-[13px] font-medium"
            onClick={() => {
              closeDropdown()
              const restPath = location.pathname.split("/").slice(2).join("/")
              navigate({
                pathname: `/${lang.key}/${restPath}`,
                search: location.search,
              })
            }}
            selected={lang.key === language?.key}>
            {isDesktop ? lang.value : lang.mobileValue}
          </DropdownItem>
        ))
      }
    </Dropdown>
  )
}

export default HeaderLanguage
