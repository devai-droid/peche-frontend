import React, { useRef } from "react"
import tw from "twin.macro"
import { DrawerProps, Drawer as MuiDrawer } from "@mui/material"
import { Icon, IconButton } from "@/design-system/components"
import CustomLink from "@/lib/components/custom-link.component"
import { CloseIcon, GiftIcon } from "@/assets/icon"
import { useTranslation } from "react-i18next"

import Korea from "@/assets/images/country/ko.jpeg"
import US from "@/assets/images/country/us.jpeg"
import Japan from "@/assets/images/country/jp.jpeg"
import China from "@/assets/images/country/ch.jpeg"
import Thailand from "@/assets/images/country/th.jpg"
import { Language } from "@/lib/locales/i18n.config"
import useRipple from "@/lib/hooks/use-ripple"
import { menuLinks } from "@/routers/links"
import { useLocation, useNavigate } from "react-router-dom"

const Item = tw(
  CustomLink,
)`block py-3 font-nanumgothic text-sm text-[#333] text-center hover:(bg-black bg-opacity-10)`

const countries = [
  {
    key: Language.KOR,
    image: Korea,
  },
  {
    key: Language.ENG,
    image: US,
  },
  {
    key: Language.JPN,
    image: Japan,
  },
  {
    key: Language.CHN,
    image: China,
  },
  {
    key: Language.THA,
    image: Thailand,
  },
]

const Flag = ({ onClick, src }: { onClick: () => void; src: string }) => {
  const internalRef = useRef<HTMLButtonElement>(null)
  const ripples = useRipple(internalRef)

  return (
    <button ref={internalRef} tw="p-2.5 relative overflow-hidden" onClick={onClick}>
      <img tw="w-10" src={src} alt="flag" />
      {ripples}
    </button>
  )
}
const AppDrawer = ({ onClose, ...props }: DrawerProps) => {
  const { t } = useTranslation()
  const location = useLocation()

  const navigate = useNavigate()
  const links = [
    ...menuLinks.map((link) => ({ ...link, name: t(link.name) })),
    {
      name: (
        <div tw="flex justify-center items-center gap-2">
          <Icon icon={GiftIcon} size={16} tw="text-point" /> {t("header.event")}
        </div>
      ),
      href: "/events",
    },
    {
      name: <div tw="flex justify-center items-center gap-2">{t("header.reservationCheck")}</div>,
      href: "/reservation",
    },
  ]

  const close = () => onClose?.({}, "escapeKeyDown")

  return (
    <MuiDrawer {...props} onClose={onClose} classes={{ paper: "w-screen" }}>
      <header tw="flex items-center justify-between px-2 py-4">
        <div tw="flex">
          {countries.map(({ key, image }) => (
            <Flag
              key={key}
              src={image}
              onClick={() => {
                const restPath = location.pathname.split("/").slice(2).join("/")
                navigate({
                  pathname: `/${key}/${restPath}`,
                  search: location.search,
                })
                close()
              }}
            />
          ))}
        </div>
        <IconButton
          onClick={close}
          icon={CloseIcon}
          iconSize={36}
          css={{ "& g": { strokeWidth: 1 } }}
        />
      </header>
      <ul>
        {links.map(({ name, href }) => (
          <li key={href} tw="last-of-type:border-none border-b border-[#EBECEF]">
            <Item onClick={close} to={href}>
              {name}
            </Item>
          </li>
        ))}
      </ul>
    </MuiDrawer>
  )
}

export default AppDrawer
