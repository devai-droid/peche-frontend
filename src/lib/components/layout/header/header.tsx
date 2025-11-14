/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react"
import tw from "twin.macro"
import HeaderNavigator from "./header-navigator.component"
import HeaderComponent from "./header.component"
import HeaderSearch from "./header-search.component"
import { AppBar } from "@mui/material"
import useResponsive from "@/lib/hooks/use-responsive"

const DropShadow = tw.div`w-full h-full bg-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.15)] lg:drop-shadow-[0px_4px_8px_rgba(0,0,0,0.35)]`

interface HeaderProps {
  hideNavigator?: boolean
  onClickDrawer?: () => void
  clickedKeyword?: string
  setClickedKeyword?: (keyword: string) => void
}

const Header = ({
  hideNavigator,
  onClickDrawer,
  clickedKeyword,
  setClickedKeyword,
}: HeaderProps) => {
  const { isDesktop } = useResponsive()

  useEffect(() => {
    if (clickedKeyword) {
      setOpenSearch(true)
    }
  }, [clickedKeyword])
  const [openSearch, setOpenSearch] = React.useState(false)

  return (
    <>
      <AppBar sx={{ background: "transparent", boxShadow: "none", color: "black" }}>
        {/* 모바일 */}
        <DropShadow>
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
      {isDesktop && <div id="header-height" tw="h-28" />}
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
