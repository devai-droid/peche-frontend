import React from "react"
import Header, { HeaderProps } from "./header/header"
import Footer from "./footer/footer"
import AppDrawer from "./drawer.component"

interface Props {
  children?: React.ReactNode
  header?: HeaderProps
  hiddenFooter?: boolean
  bottomCartExists?: boolean
  clickedKeyword?: string
  setClickedKeyword?: (keyword: string) => void
}

const Page = ({
  children,
  header,
  hiddenFooter = true,
  bottomCartExists = false,
  clickedKeyword,
  setClickedKeyword,
}: Props) => {
  const [openDrawer, setOpenDrawer] = React.useState(false)

  return (
    <div tw="min-h-screen flex flex-col relative">
      <AppDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} />
      <Header
        {...header}
        onClickDrawer={() => setOpenDrawer(true)}
        clickedKeyword={clickedKeyword}
        setClickedKeyword={setClickedKeyword}
      />
      <main tw="flex-1 md:min-h-[70rem]">{children}</main>
      {!hiddenFooter && <Footer bottomCartExists={bottomCartExists} />}
    </div>
  )
}

export default Page
