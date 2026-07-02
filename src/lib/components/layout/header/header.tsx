/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react"
import tw from "twin.macro"
import HeaderNavigator from "./header-navigator.component"
import HeaderComponent from "./header.component"
import HeaderSearch from "./header-search.component"
import { AppBar, Slide, useScrollTrigger } from "@mui/material"
import useResponsive from "@/lib/hooks/use-responsive"

const DropShadow = tw.div`w-full h-full bg-white border-b border-neutral20`

interface HeaderProps {
  hideNavigator?: boolean
  hideOnScroll?: boolean
  onClickDrawer?: () => void
  clickedKeyword?: string
  setClickedKeyword?: (keyword: string) => void
}

const Header = ({
  hideNavigator,
  hideOnScroll,
  onClickDrawer,
  clickedKeyword,
  setClickedKeyword,
}: HeaderProps) => {
  const { isDesktop } = useResponsive()
  const scrollTrigger = useScrollTrigger()

  useEffect(() => {
    if (clickedKeyword) {
      setOpenSearch(true)
    }
  }, [clickedKeyword])
  const [openSearch, setOpenSearch] = React.useState(false)

  const appBar = (
    <AppBar sx={{ background: "transparent", boxShadow: "none", color: "black" }}>
      {/* 모바일 */}
      {/* id: 장바구니 sticky 패널이 헤더 높이를 재서 top 오프셋으로 사용 (cart-view) */}
      <DropShadow id="header-height">
        <HeaderComponent
          onClickDrawer={onClickDrawer}
          clickedKeyword={clickedKeyword}
          setClickedKeyword={setClickedKeyword}
        />
        {!hideNavigator && <HeaderNavigator />}
      </DropShadow>
      {/* 데탑 */}
      {isDesktop && (
        <HeaderSearch
          open={openSearch}
          setOpen={setOpenSearch}
          clickedKeyword={clickedKeyword}
          setClickedKeyword={setClickedKeyword}
        />
      )}
    </AppBar>
  )

  return (
    <>
      {hideOnScroll ? (
        <Slide appear={false} direction="down" in={!scrollTrigger}>
          {appBar}
        </Slide>
      ) : (
        appBar
      )}
      <div tw="hidden lg:block lg:h-28" />
    </>
  )
}

const Headers = {
  Header,
  HeaderNavigator,
  HeaderComponent,
}

export default Header
export { Headers }
export type { HeaderProps }
