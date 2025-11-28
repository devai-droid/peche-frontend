import React, { useLayoutEffect } from "react"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"

import bannerImg from "@/assets/images/events-banner.jpg"
import mobileBannerImg from "@/assets/images/events-mobile-banner.jpg"
import useResponsive from "@/lib/hooks/use-responsive"

import tw from "twin.macro"
import { useTranslation } from "react-i18next"
import CartView from "@/features/product/components/cart-view.component"
import { Button, Icon, LinkButton, Chip } from "@/design-system/components"
import { ShoppingCartIcon } from "@/assets/icon"
import { useEventControllerFindManyInfinite } from "@/lib/orval/events/events"
import useLanguageValue from "@/lib/hooks/use-language-key"
import { useSearchParams } from "react-router-dom"
import useLanguageQuery from "@/lib/hooks/use-language-query"
import { useEventCategoryControllerFindManyWithPaginationQuery } from "@/lib/orval/event-categories/event-categories"
import { useEventBundleControllerFindVisible } from "@/lib/orval/event-bundle/event-bundle"
import dayjs from "dayjs"
import useCart from "@/features/product/hooks/use-cart"
import { getNextPageParam } from "@/lib/api/http-client.helper"
import Modal from "@/lib/components/modal/modal.component"

const item = tw`w-full font-semibold font-pretendard text-center h-14 flex items-center justify-center bg-white`

interface EventProps {
  name: string
  description: string
  price: string
  originalPrice?: string
  subDescription?: string
  id: string
  addToCart: () => void
}

const Event = ({
  name,
  description,
  subDescription,
  originalPrice,
  price,
  id,
  addToCart,
  isNew,
  isPop,
  isBest,
  isKakao,
}: EventProps & {
  isNew?: boolean
  isPop?: boolean
  isBest?: boolean
  isKakao?: boolean
}) => {
  const { t } = useTranslation()

  return (
    <div tw="bg-white p-4 font-pretendard flex flex-col gap-2 tracking-tight leading-[150%]">
      {/* Chip 영역 */}
      <div tw="flex gap-1">
        {isPop && (
          <Chip tw="h-[24px] px-2 text-[11px] leading-[1] flex items-center mb-1" color="primary">
            {t("common.pop")}
          </Chip>
        )}

        {isNew && (
          <Chip tw="h-[24px] px-2 text-[11px] leading-[1] flex items-center mb-1" color="gray">
            {t("common.new")}
          </Chip>
        )}

        {isKakao && (
          <Chip tw="h-[24px] px-2 text-[11px] leading-[1] flex items-center mb-1" color="pink">
            {t("common.kakaoFriend")}
          </Chip>
        )}

        {isBest && (
          <Chip tw="h-[24px] px-2 text-[11px] leading-[1] flex items-center mb-1" color="darkgray">
            {t("common.best")}
          </Chip>
        )}
      </div>

      {/* 제목 */}
      <div tw="text-neutralBlack text-[18px] md:text-[22px] font-semibold">{name}</div>

      {/* 설명 */}
      <div tw="text-[13px] md:text-[14px] text-neutral70" style={{ whiteSpace: "pre-line" }}>
        {description}
      </div>

      {/* 서브 설명 */}
      <div tw="text-sm text-[#888]">{subDescription}</div>

      {/* 🔥 가격을 버튼 위로 이동 — 버튼과 완전히 분리됨 */}
      <div tw="flex items-center gap-2 mb-2">
        {!!originalPrice && (
          <div tw="line-through text-[13px] sm:text-[14px] text-neutral50">{originalPrice}</div>
        )}
        <div tw="text-[16px] md:text-[18px] text-neutralBlack font-bold">{price}</div>
      </div>

      {/* 버튼 영역 — 절대 위치 제거하고 자연스럽게 아래 배치 */}
      <div tw="flex justify-end gap-3 md:-mt-10 -mt-2">
        <LinkButton style={{ variant: "outlined", size: "sm" }} to={`/products/${id}`}>
          {t("products.detail")}
        </LinkButton>

        <Button
          onClick={addToCart}
          tw="flex items-center justify-center gap-1"
          style={{ size: "sm", variant: "filled" }}>
          {t("common.save")}
          <Icon tw="ml-[5px]" icon={ShoppingCartIcon} size={16} />
        </Button>
      </div>
    </div>
  )
}

const Events = () => {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
  const tv = useLanguageValue()
  const langQuery = useLanguageQuery()
  const [params, setParams] = useSearchParams()
  const selectedCategoryId = params.get("category")
  const selectedEventBundleId = params.get("bundle")
  const [showInquiryModal, setShowInquiryModal] = React.useState(false)

  const keyMatch = {
    ko: "",
    en: "EN",
    ja: "JA",
    th: "TH",
    zh: "ZH",
  }
  const { i18n } = useTranslation()
  const lang = i18n.language as keyof typeof keyMatch

  const { addToCart, resetCart, inquiry, setInquiry } = useCart()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddToCart = (event: any) => {
    // 상담모드일 경우 → addToCart가 blockedByInquiry=true 반환함
    const result = addToCart(item)

    if (result?.blockedByInquiry) {
      setShowInquiryModal(true)
      return
    }
    // Utility function to get event end dates from local storage
    const getEventEndDates = () => {
      const storedData = localStorage.getItem("eventEndDates")
      return storedData ? JSON.parse(storedData) : {}
    }

    // Utility function to set event end dates in local storage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setEventEndDates = (data: any) => {
      localStorage.setItem("eventEndDates", JSON.stringify(data))
    }

    // Retrieve existing end dates from local storage
    const endDates = getEventEndDates()

    const selectedEventBundle = visibleEvents?.find((ev) => ev.id === selectedEventBundleId)

    if (selectedEventBundle) {
      // update endDates
      endDates[event.event.id] = selectedEventBundle.endDate

      // Save the updated end dates back to local storage
      setEventEndDates(endDates)
    }
    addToCart(event)
  }

  const { data: visibleEvents } = useEventBundleControllerFindVisible()
  const { data: categories } = useEventCategoryControllerFindManyWithPaginationQuery({
    status: "ACTIVE",
    sortBy: ["order"],
    sortOrder: ["ASC"],
    limit: 100,
    ...langQuery,
  })
  const { data: events } = useEventControllerFindManyInfinite(
    {
      categoryId: selectedCategoryId ?? undefined,
      bundleId: selectedEventBundleId ?? undefined,
      sortBy: [`order${keyMatch[lang]}`],
      sortOrder: ["ASC"],
      limit: 100,
      ...langQuery,
    },
    {
      query: {
        enabled: !!selectedCategoryId && !!selectedEventBundleId,
        getNextPageParam,
      },
    },
  )

  const handleCategory = (id: string) => {
    setParams((prev) => {
      prev.set("category", id.toString())
      return prev
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBundle = (id: string) => {
    setParams((prev) => {
      prev.set("bundle", id.toString())
      return prev
    })
  }

  useLayoutEffect(() => {
    if (
      visibleEvents?.length &&
      categories?.items?.length &&
      (!selectedCategoryId || !selectedEventBundleId)
    ) {
      setParams(
        (prev) => {
          prev.set("category", categories.items[0].id)
          prev.set("bundle", visibleEvents[0].id)
          return prev
        },
        { replace: true },
      )
    }
  }, [categories, visibleEvents])

  if (!categories || !visibleEvents) {
    return <Page />
  }

  const colSpan = (column: number) => `span ${column} / span ${column}`

  // -----------------------------
  // Event Category Header UI
  // -----------------------------
  interface EventCategoryBannerProps {
    name: string
    startDate: string | Date
    endDate: string | Date
    imageUrl: string
  }
  const selectedCategory = categories?.items?.find((c) => c.id === selectedCategoryId)

  // visibleEvents에 선택된 번들의 날짜 정보가 있음
  const selectedBundle = visibleEvents?.find((b) => b.id === selectedEventBundleId)

  const eventStartDate = selectedBundle?.startDate
  const eventEndDate = selectedBundle?.endDate

  const EventCategoryBanner = ({
    name,
    startDate,
    endDate,
    imageUrl,
  }: EventCategoryBannerProps) => {
    return (
      <div tw="w-full mb-6 px-4 md:px-0 font-pretendard tracking-tight leading-[150%]">
        <div tw="bg-white px-4 py-4 md:py-6 md:px-4 border-b border-neutral20">
          <div tw="text-[18px] md:text-[22px] font-semibold text-neutralBlack mb-2">{name}</div>
          <div tw="text-[13px] md:text-[14px] text-neutral70">
            이벤트 기간: {dayjs(startDate).format("YY.MM.DD")}~{dayjs(endDate).format("YY.MM.DD")}
          </div>
        </div>

        <div tw="w-full bg-gray-100 overflow-hidden">
          <img src={imageUrl} alt={name} tw="w-full object-cover md:h-[380px] h-[250px]" />
        </div>
      </div>
    )
  }

  // 날짜 포맷
  const formatDate = (d?: string) => (d ? dayjs(d).format("YYYY.MM.DD") : "")

  return (
    <Page hiddenFooter={false}>
      <div tw="w-screen overflow-hidden relative">
        <img
          src={isMobile ? mobileBannerImg : bannerImg}
          alt="banner"
          tw="w-full max-h-[700px] h-[700px] object-cover block"
        />
        <div tw="absolute left-[8%] top-[15%] md:top-[10%] text-left text-neutralBlack">
          <div tw="text-[39px] lg:text-[50px] font-time font-normal tracking-tight">
            Price & Events
          </div>
          <div tw="text-[18px] lg:text-[22px] font-pretendard">가격 및 이벤트</div>
        </div>
      </div>

      <div tw="bg-neutral min-h-screen pt-[1px] tracking-tight leading-[150%]">
        <AppMaxWidth tw="max-lg:p-0">
          {/* <div tw="max-lg:hidden">
              <img src={isMobile ? mobileBannerImg : bannerImg} alt="banner" tw="w-full" />
            </div> */}

          <div tw="flex justify-center mt-8 lg:mt-16 mb-4 lg:mb-12 max-lg:p-4">
            <div tw="grid justify-center bg-neutral30 gap-px p-px grid-cols-3 lg:grid-cols-5 w-full">
              {categories?.items?.map((category, index) => {
                const isSelected = selectedCategoryId === category.id

                // 모바일/데스크탑 구분
                const isFirstRow = (isMobile && index < 3) || (!isMobile && index < 5)

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategory(category.id)}
                    css={[
                      item,

                      // 선택된 버튼 스타일 (공통)
                      isSelected && tw`bg-[#DA7F67] text-white`,

                      // 비선택 버튼: 첫줄 / 아니면 구분
                      !isSelected &&
                        (isFirstRow
                          ? tw`bg-[#FEF5EA] text-black`
                          : tw`bg-white font-normal text-black`),
                    ]}>
                    <div tw="px-2 overflow-hidden text-ellipsis">{tv(category, "name")}</div>
                  </button>
                )
              })}
              <div
                tw="max-lg:hidden"
                css={[
                  item,
                  {
                    gridColumn: colSpan(5 - (categories.items.length % 5)),
                    display: categories.items.length % 5 === 0 ? "none" : "block",
                  },
                ]}
              />
              <div
                tw="lg:hidden"
                css={[
                  item,
                  {
                    gridColumn: colSpan(3 - (categories.items.length % 3)),
                    display: categories.items.length % 3 === 0 ? "none" : "block",
                  },
                ]}
              />
            </div>
          </div>
          <CartView isHome={false}>
            {/* <div tw="border-b border-[#e5e5e5] my-10 bg-white pt-1">
              <div tw="flex justify-center items-center">
                {visibleEvents
                  .sort((a, b) => {
                    // Sorting logic to prioritize events with `visibleFirst` as true
                    if (a.visibleFirst === b.visibleFirst) {
                      return 0 // No change in order if both are the same
                    }
                    return a.visibleFirst ? -1 : 1 // Place `true` before `false`
                  })
                  .map((event) => (
                    <button
                      key={event.id}
                      tw="px-5 -mb-px text-center text-[#888]"
                      css={
                        selectedEventBundleId === event.id && tw`border-b-2 border-point text-point`
                      }
                      onClick={() => handleBundle(event.id)}>
                      <p tw="text-sm">{tv(event, "name")}</p>
                      <p tw="text-xs">
                        {dayjs(event.postStartDate).format("YYYY.MM.DD")}~
                        {dayjs(event.postEndDate).format("YYYY.MM.DD")}
                      </p>
                    </button>
                  ))}
              </div>
            </div> */}

            {selectedCategory?.image?.url && selectedBundle && (
              <EventCategoryBanner
                name={tv(selectedCategory, "name")}
                startDate={selectedBundle.startDate}
                endDate={selectedBundle.endDate}
                imageUrl={selectedCategory.image.url}
              />
            )}

            <div tw="flex flex-col gap-4 max-lg:px-4">
              {events?.pages
                .flatMap((page) => page.items)
                .map((event, index) => (
                  <Event
                    addToCart={() => handleAddToCart({ event })}
                    id={event.detailPage?.id}
                    key={index}
                    name={tv(event, "name")}
                    description={tv(event, "description")}
                    subDescription={
                      event.category.startDate
                        ? `${dayjs(event.category.startDate).format("YYYY.MM.DD")} ~ ${dayjs(
                            event.category.endDate,
                          ).format("YYYY.MM.DD")}`
                        : ""
                    }
                    originalPrice={
                      event.discountPrice
                        ? `${event.price.toLocaleString()} ${t("reservePage.won")}`
                        : undefined
                    }
                    price={`${(event.discountPrice || event.price).toLocaleString()} ${t(
                      "reservePage.won",
                    )}`}
                    isNew={event.label?.includes("NEW")}
                    isPop={event.label?.includes("POP")}
                    isBest={event.label?.includes("BEST")}
                    isKakao={event.label?.includes("KAKAO")}
                  />
                ))}
            </div>
            {events?.pages[0].meta.totalItems === 0 && (
              <div tw="flex flex-col gap-4 lg:gap-6" style={{ textAlign: "center" }}>
                {t("productDetail.noEvents")}
              </div>
            )}
          </CartView>
        </AppMaxWidth>
      </div>
      <Modal open={showInquiryModal} title="안내" onClose={() => setShowInquiryModal(false)}>
        <div tw="flex flex-col items-center justify-center h-full">
          <div tw="text-center text-[16px] font-semibold leading-snug">
            방문 상담이 담겨있는 상태에서는 시술 선택이 어렵습니다.
          </div>

          <div tw="text-neutral70 text-center mt-3">방문 상담을 비운 후 시술을 담아주세요.</div>

          <div tw="flex justify-end gap-2 mt-8">
            <Button
              tw="min-w-[8rem]"
              style={{ variant: "outlined", color: "point", size: "lg" }}
              onClick={() => setShowInquiryModal(false)}>
              취소하기
            </Button>

            <Button
              onClick={() => {
                // resetCart()
                setInquiry(false)
                setShowInquiryModal(false)
              }}>
              방문 상담 비우기
            </Button>
          </div>
        </div>
      </Modal>
    </Page>
  )
}

export default Events
