import { useLocation } from "react-router-dom"
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
  const { t } = useTranslation()
  const location = useLocation()

  const isSelected = (href: string) => {
    const currentPath = location.pathname.replace(/^\/(ko|en|ja|zh|th)/, "")
    return currentPath === href || currentPath.startsWith(`${href}/`)
  }

  if (!isDesktop) return null

  return (
    <Container>
      <DesktopLinkContainer>
        {menuLinks.map((link) => (
          <TextLink to={link.href} key={link.name} selected={isSelected(link.href)}>
            <div>{t(link.name)}</div>
          </TextLink>
        ))}
      </DesktopLinkContainer>
    </Container>
  )
}

export default HeaderNavigator
