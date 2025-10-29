import React, { useEffect } from "react"
import tw from "twin.macro"
import { Dropdown, DropdownItem, Icon } from "@/design-system/components"
import { useTranslation } from "react-i18next"
import useResponsive from "@/lib/hooks/use-responsive"
import { DropDownIcon } from "@/assets/icon"
import { Language } from "@/lib/locales/i18n.config"
import { useLocation, useNavigate } from "react-router-dom"

const displayLanguages = [
  {
    key: Language.KOR,
    value: "KOR",
    mobileValue: "KR",
  },
  {
    key: Language.ENG,
    value: "ENG",
    mobileValue: "EN",
  },
  {
    key: Language.CHN,
    value: "CHN",
    mobileValue: "CN",
  },
  {
    key: Language.JPN,
    value: "JPN",
    mobileValue: "JP",
  },
  {
    key: Language.THA,
    value: "THA",
    mobileValue: "TH",
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
        <button onClick={openDropdown} tw="flex items-center border-b border-black pb-1 pt-1.5">
          <div tw="text-md font-bold font-nanumgothic mr-2">
            {isDesktop ? language?.value : language?.mobileValue}
          </div>
          <Icon
            icon={DropDownIcon}
            tw="text-[#838383] -mr-2"
            css={open ? tw`transform rotate-180` : tw`transform rotate-0`}
          />
        </button>
      )}>
      {(closeDropdown) =>
        displayLanguages.map((lang) => (
          <DropdownItem
            key={lang.key}
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
