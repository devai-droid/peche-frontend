import React from "react"
import Header, { HeaderProps } from "./header/header"
import Footer from "./footer/footer"
import AppDrawer from "./drawer.component"

interface Props {
  children?: React.ReactNode
  header?: HeaderProps
  hiddenHeader?: boolean
  hiddenFooter?: boolean
  hideOnScroll?: boolean
  bottomCartExists?: boolean
  clickedKeyword?: string
  setClickedKeyword?: (keyword: string) => void
}

const Page = ({
  children,
  header,
  hiddenHeader = false,
  hiddenFooter = true,
  hideOnScroll = false,
  bottomCartExists = false,
  clickedKeyword,
  setClickedKeyword,
}: Props) => {
  const [openDrawer, setOpenDrawer] = React.useState(false)

  return (
    <div tw="min-h-screen flex flex-col relative">
      <AppDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} />
      {!hiddenHeader && (
        <Header
          {...header}
          hideOnScroll={hideOnScroll}
          onClickDrawer={() => setOpenDrawer(true)}
          clickedKeyword={clickedKeyword}
          setClickedKeyword={setClickedKeyword}
        />
      )}
      <main tw="flex-1 md:min-h-[70rem]">{children}</main>
      {!hiddenFooter && <Footer bottomCartExists={bottomCartExists} />}
    </div>
  )
}

export default Page
