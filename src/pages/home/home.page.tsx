import Page from "@/lib/components/layout/page.component"
import EventModal from "./components/event-modal.component"
import Banner from "./components/banner.component"
import MostPopular from "./components/most-popular.component"
import TodayKeywords from "./components/today-keywords.component"
import SpecialEventSection from "./components/special-events.component"
import Location from "./components/location.component"
import { ScrollRestoration } from "react-router-dom"
import { useMainPopupControllerFindMany } from "@/lib/orval/main-popup/main-popup"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { LocalStorageKeys } from "@/lib/constants/local-storage-key.constant"
import { LocalStorage } from "@/lib/service/local-storage.service"
import CartView from "@/features/product/components/cart-view.component"

// 팝업 열림/닫힘 상태를 관리하기 위한 타입
type OpenModals = { [key: string]: boolean }

const DATE_FORMAT = "YYYY-MM-DD"
type ExpireDate = string
interface LocalStorageEvent {
  [eventId: string]: ExpireDate
}

const Home = () => {
  const [openModals, setOpenModals] = useState<OpenModals>({})
  const [highestZIndexModalId, setHighestZIndexModalId] = useState<string | null>(null)

  // 팝업 GET
  const { data: mainPopupList } = useMainPopupControllerFindMany({
    page: 1,
    limit: 10,
    status: "ACTIVE",
    sortBy: ["order"],
  })

  const popups = mainPopupList?.items

  const [clickedKeyword, setClickedKeyword] = useState("")
  const handleKeywordClick = (keyword: string) => {
    setClickedKeyword(keyword)
    return keyword
  }

  const expireEvents: LocalStorageEvent = JSON.parse(
    LocalStorage.get(LocalStorageKeys.Events) || "{}",
  )

  useEffect(() => {
    // 처음에 팝업 열림/닫힘 여부를 로컬스토리지에서 가져와서 상태로 설정
    const initialOpenModals: OpenModals = {}
    popups?.forEach((popup) => {
      const event = expireEvents[popup.id]
      const isHidden = event ? dayjs(event).isSame(dayjs(), "day") : false
      initialOpenModals[popup.id] = !isHidden
    })

    setOpenModals(initialOpenModals)
  }, [popups])

  useEffect(() => {
    // 열어도 되는 팝업 찾기
    const openPopups = popups?.filter((popup) => openModals[popup.id] !== false)
    // 가장 높은 z-index를 가진 팝업 찾기. 팝업 바깥을 클릭했을 때 가장 높은 z-index를 가진 팝업만 닫히도록 하기 위함
    let highestZIndex = -1
    let highestZIndexId: string | null = null

    openPopups?.forEach((popup) => {
      const zIndex = 1200 - popup.order
      if (zIndex > highestZIndex) {
        highestZIndex = zIndex
        highestZIndexId = popup.id
      }
    })

    setHighestZIndexModalId(highestZIndexId)
  }, [openModals, expireEvents, setHighestZIndexModalId])

  const handleCloseModal = (eventId: string, checked: boolean) => {
    // 팝업 닫을때 필요한 로직
    if (checked) {
      // 하루동안 보지 않기 체크박스가 체크되어 있는 경우
      const newEvents = { ...expireEvents, [eventId]: dayjs().format(DATE_FORMAT) }
      LocalStorage.set(LocalStorageKeys.Events, JSON.stringify(newEvents))
    }
    setOpenModals((prevOpenModals) => ({ ...prevOpenModals, [eventId]: false }))
  }

  return (
    <>
      <ScrollRestoration />

      <Page
        hiddenFooter={false}
        clickedKeyword={clickedKeyword}
        setClickedKeyword={setClickedKeyword}>
        <CartView isHome>
          <Banner />
          <SpecialEventSection />
          {/* <TodayKeywords onKeywordClick={handleKeywordClick} /> */}
          <MostPopular />
          <div tw="h-16" />
          <Location />
        </CartView>
      </Page>
      {popups &&
        Object.keys(openModals).length !== 0 &&
        popups.map((popup) => (
          <EventModal
            key={popup.id}
            popup={popup}
            onClose={(checked) => handleCloseModal(popup.id, checked)}
            isOpen={openModals[popup.id] !== false}
            style={{ zIndex: 1200 - popup.order }}
            highestZIndexModalId={highestZIndexModalId}
          />
        ))}
    </>
  )
}

export default Home
