import React from "react"
import { useLocation } from "react-router-dom"
import tw, { styled } from "twin.macro"
import AppMaxWidth from "../app-max-width.component"
import { Icon, IconButton } from "@/design-system/components"
import { CloseIcon, GiftIcon, SearchIcon } from "@/assets/icon"
import useResponsive from "@/lib/hooks/use-responsive"
import { useTranslation } from "react-i18next"
import { menuLinks } from "@/routers/links"
import CustomLink from "@/lib/components/custom-link.component"
import { useLogout } from "@/features/auth/hooks/use-auth"
import useIsLoggedIn from "@/features/user/hooks/use-is-logged-in"

const Container = tw.nav`
relative
h-12 lg:h-16

bg-white
lg:bg-point

text-[#333]
lg:text-white
`

const DesktopLinkContainer = tw.div`w-max h-full flex items-center justify-center gap-6 absolute-center`
const TextLink = styled(CustomLink)(
  ({ selected }: { selected: boolean }) => selected && tw`font-bold`,
  tw`p-4 text-md`,
)
const MobileLinkContainer = tw.div`w-full h-full flex items-center justify-center`
const MobileLink = styled(CustomLink)(
  ({ selected }: { selected?: boolean }) => selected && tw`bg-point font-bold text-white`,
  tw`p-4 text-md font-nanumgothic flex-1 h-full text-center flex justify-center items-center`,
)

interface Props {
  setOpenSearch?: (open: boolean) => void
}

const HeaderNavigator = ({ setOpenSearch }: Props) => {
  const { isDesktop } = useResponsive()
  const { logout } = useLogout()
  const isLoggedIn = useIsLoggedIn()
  const { t } = useTranslation()
  const isLocal = process.env.STAGE === "local"

  const location = useLocation()

  const isSelected = (href: string) => {
    const [, path] = href.split("/")
    const [, currentPath] = location.pathname.split("/")
    return path === currentPath
  }

  const mobileLinks = [
    {
      name: (
        <>
          <div tw="mr-1.5 mb-1">
            <Icon
              icon={GiftIcon}
              size={16}
              css={isSelected("/events") ? tw`text-white` : tw`text-point`}
            />
          </div>
          <div>{t("header.event")}</div>
        </>
      ),
      href: "/events",
    },
    {
      name: t("header.price"),
      href: "/products",
    },
    {
      name: t("header.introduction"),
      href: "/intro",
    },
  ]

  return (
    <Container>
      {isDesktop ? (
        <>
          <DesktopLinkContainer>
            {menuLinks.map((link) => (
              <TextLink to={link.href} key={link.name} selected={isSelected(link.href)}>
                <div>{t(link.name)}</div>
              </TextLink>
            ))}
          </DesktopLinkContainer>
          <AppMaxWidth tw="h-full">
            <div tw="h-full flex justify-end items-center -mr-4 gap-2">
              <CustomLink
                to="/events"
                tw="w-36 h-10 rounded-full bg-white text-center flex justify-center items-center gap-1.5 shadow-[0px_4px_12px_0px_#A78153]"
                type="button">
                <Icon icon={GiftIcon} size={16} tw="text-[#AF8B60]" />
                <div tw="text-md font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#AF8B60] to-[#E8B47A] font-nanumgothic">
                  {t("header.event")}
                </div>
              </CustomLink>
              <div>
                <IconButton icon={SearchIcon} onClick={() => setOpenSearch?.(true)} iconSize={32} />
                {isLocal && isLoggedIn ? (
                  <IconButton icon={CloseIcon} onClick={() => logout()} iconSize={16} />
                ) : null}
              </div>
            </div>
          </AppMaxWidth>
        </>
      ) : (
        <MobileLinkContainer>
          {mobileLinks.map(({ name, href }) => (
            <MobileLink to={href} key={href} selected={isSelected(href)}>
              {name}
            </MobileLink>
          ))}
        </MobileLinkContainer>
      )}
    </Container>
  )
}

export default HeaderNavigator
