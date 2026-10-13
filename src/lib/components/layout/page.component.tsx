import React from "react"
import tw from "twin.macro"
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
  /** 본문 영역에 큰 최소 높이(md:70rem)를 줄지 여부. 내용이 짧은 페이지는 false로 두어 푸터 위 빈 공간을 없앤다. */
  tallMain?: boolean
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
  tallMain = true,
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
      <main css={[tw`flex-1`, tallMain && tw`md:min-h-[70rem]`]}>{children}</main>
      {!hiddenFooter && <Footer bottomCartExists={bottomCartExists} />}
    </div>
  )
}

export default Page
