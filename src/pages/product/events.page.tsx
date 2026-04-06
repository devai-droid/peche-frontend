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
import { useProductControllerFindMany } from "@/lib/orval/products/products"
import { useProductCategoryControllerFindMany } from "@/lib/orval/product-categories/product-categories"
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
          <Chip
            tw="h-[24px] px-2 text-[13px] md:text-[15px] leading-[1] flex items-center mb-1 px-[4px]"
            color="primary">
            {t("common.pop")}
          </Chip>
        )}

        {isNew && (
          <Chip
            tw="h-[24px] px-2 text-[13px] md:text-[15px] leading-[1] flex items-center mb-1 px-[4px]"
            color="gray">
            {t("common.new")}
          </Chip>
        )}

        {isKakao && (
          <Chip
            tw="h-[24px] px-2 text-[13px] md:text-[15px] leading-[1] flex items-center mb-1 px-[4px]"
            color="pink">
            {t("common.kakaoFriend")}
          </Chip>
        )}

        {isBest && (
          <Chip
            tw="h-[24px] px-2 text-[13px] md:text-[15px] leading-[1] flex items-center mb-1 px-[4px]"
            color="darkgray">
            {t("common.best")}
          </Chip>
        )}
      </div>

      {/* 제목 */}
      <div tw="text-neutralBlack text-[16px] md:text-[18px] font-semibold">{name}</div>

      {/* 설명 */}
      <div tw="text-[13px] md:text-[14px] text-neutral70" style={{ whiteSpace: "pre-line" }}>
        {description}
      </div>

      {/* 서브 설명 */}
      <div tw="text-sm text-[#888]">{subDescription}</div>

      {/* 가격을 버튼 위로 이동 — 버튼과 완전히 분리됨 */}
      <div tw="flex items-center gap-2 mb-2">
        {!!originalPrice && (
          <div tw="line-through text-[13px] sm:text-[14px] text-neutral50">{originalPrice}</div>
        )}
        <div tw="text-[16px] md:text-[18px] text-secondary3 font-semibold">{price}</div>
      </div>

      {/* 버튼 영역 — 절대 위치 제거하고 자연스럽게 아래 배치 */}
      <div
        tw="flex justify-end gap-3 -mt-[43px]"
        css={`
          @media (max-width: 395px) {
            margin-top: -0.5rem; /* -mt-2 */
          }
        `}>
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pendingAddEvent, setPendingAddEvent] = React.useState<any>(null)

  const keyMatch = {
    ko: "",
    en: "EN",
    ja: "JA",
    th: "TH",
    zh: "ZH",
    "zh-TW": "ZHTW",
  }
  const { i18n } = useTranslation()
  const lang = i18n.language as keyof typeof keyMatch

  const { addToCart, inquiry, setInquiry, setInquiryMemo } = useCart()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddToCart = (event: any) => {
    // 상담모드일 경우 → addToCart가 blockedByInquiry=true 반환함
    const result = addToCart(event)

    if (result?.blockedByInquiry) {
      setPendingAddEvent(event)
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
  const { data: eventCategories } = useEventCategoryControllerFindManyWithPaginationQuery({
    status: "ACTIVE",
    sortBy: ["order"],
    sortOrder: ["ASC"],
    limit: 100,
    ...langQuery,
  })
  const { data: productCategories } = useProductCategoryControllerFindMany({
    status: "ACTIVE",
    sortBy: ["order"],
    sortOrder: ["ASC"],
    limit: 100,
  })

  // 통합 탭 목록: EventCategory (특별 이벤트 4개) + ProductCategory (상시)
  const combinedTabs = React.useMemo(() => {
    const eventTabs = (eventCategories?.items ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      nameEN: c.nameEN,
      nameZH: c.nameZH,
      nameZHTW: c.nameZHTW,
      nameJA: c.nameJA,
      nameTH: c.nameTH,
      type: "event" as const,
      image: c.image,
      description: c.description,
      descriptionEN: c.descriptionEN,
      descriptionZH: c.descriptionZH,
      descriptionZHTW: c.descriptionZHTW,
      descriptionJA: c.descriptionJA,
      descriptionTH: c.descriptionTH,
      startDate: c.startDate,
      endDate: c.endDate,
    }))
    const productTabs = (productCategories?.items ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      nameEN: c.nameEN,
      nameZH: c.nameZH,
      nameZHTW: c.nameZHTW,
      nameJA: c.nameJA,
      nameTH: c.nameTH,
      type: "product" as const,
      image: undefined,
      description: undefined,
      descriptionEN: undefined,
      descriptionZH: undefined,
      descriptionZHTW: undefined,
      descriptionJA: undefined,
      descriptionTH: undefined,
      startDate: undefined,
      endDate: undefined,
    }))
    return [...eventTabs, ...productTabs]
  }, [eventCategories, productCategories])

  // 현재 선택된 탭이 event인지 product인지
  const selectedTab = combinedTabs.find((t) => t.id === selectedCategoryId)
  const isProductTab = selectedTab?.type === "product"

  // 이벤트 데이터 (특별 이벤트 탭 선택 시)
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
        enabled: !!selectedCategoryId && !!selectedEventBundleId && !isProductTab,
        getNextPageParam,
      },
    },
  )

  // 상품 데이터 (상시 탭 선택 시)
  const { data: products } = useProductControllerFindMany(
    {
      categoryId: selectedCategoryId ?? undefined,
      sortBy: [`order${keyMatch[lang]}`],
      sortOrder: ["ASC"],
      limit: 1000,
      ...langQuery,
    },
    {
      query: {
        enabled: !!selectedCategoryId && isProductTab,
      },
    },
  )

  const handleCategory = (id: string) => {
    setParams((prev) => {
      prev.set("category", id.toString())
      return prev
    })
  }

  React.useEffect(() => {
    if (!inquiry && pendingAddEvent) {
      addToCart(pendingAddEvent)
      setPendingAddEvent(null)
    }
  }, [inquiry])

  useLayoutEffect(() => {
    if (
      visibleEvents?.length &&
      combinedTabs.length &&
      (!selectedCategoryId || !selectedEventBundleId)
    ) {
      setParams(
        (prev) => {
          if (!selectedCategoryId) prev.set("category", combinedTabs[0]?.id)
          prev.set("bundle", visibleEvents[0]?.id)
          return prev
        },
        { replace: true },
      )
    }
  }, [combinedTabs, visibleEvents])

  if (!combinedTabs.length || !visibleEvents) {
    return <Page />
  }

  // -----------------------------
  // Event Category Header UI
  // -----------------------------
  interface EventCategoryBannerProps {
    name: string
    startDate: string | Date
    endDate: string | Date
    imageUrl: string
  }
  interface NoPictureBannerProps {
    name: string
    description: string
  }
  // visibleEvents에 선택된 번들의 날짜 정보가 있음
  const selectedBundle = visibleEvents?.find((b) => b.id === selectedEventBundleId)

  // const eventStartDate = selectedBundle?.startDate
  // const eventEndDate = selectedBundle?.endDate

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
          <img src={imageUrl} alt={name} tw="w-full object-cover md:h-[380px]" />
        </div>
      </div>
    )
  }

  const NoPictureCategoryBanner = ({ name, description }: NoPictureBannerProps) => {
    return (
      <div tw="w-full mb-6 px-4 md:px-0 font-pretendard tracking-tight leading-[150%]">
        <div tw="bg-white px-4 py-4 md:py-6 md:px-4 border-b-[2px] border-b-secondary3">
          <div tw="text-[18px] md:text-[22px] font-semibold text-neutralBlack mb-2">{name}</div>
          <div tw="text-[16px] md:text-[18px] text-neutral70">{description}</div>
        </div>
      </div>
    )
  }

  return (
    <Page hiddenFooter={false} bottomCartExists>
      <div tw="w-screen overflow-hidden relative">
        <img
          src={isMobile ? mobileBannerImg : bannerImg}
          alt="banner"
          tw="w-full max-h-[310px] h-[310px] object-cover block"
        />
        <div
          tw="
              absolute top-1/2 left-1/2 
              -translate-x-1/2 -translate-y-1/2 
              text-center text-neutralBlack
              min-w-[300px]
            ">
          <div tw="text-[39px] lg:text-[50px] font-time font-normal tracking-tight">
            {t("productDetail.eventsTitle")}
          </div>
          <div tw="text-[18px] lg:text-[22px] font-pretendard">
            {t("productDetail.eventsSubtitle")}
          </div>
        </div>
      </div>

      <div tw="bg-neutral min-h-screen pt-[1px] tracking-tight leading-[150%]">
        <AppMaxWidth tw="max-lg:px-0 max-lg:pt-0 max-lg:pb-20 pb-32">
          <div tw="flex justify-center mt-8 lg:mt-16 mb-4 lg:mb-12 max-lg:p-4">
            <div tw="grid justify-center bg-neutral30 gap-px p-px grid-cols-3 lg:grid-cols-5 w-full">
              {combinedTabs.map((tab, index) => {
                const isSelected = selectedCategoryId === tab.id
                const isEventTab = tab.type === "event"

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleCategory(tab.id)}
                    css={[
                      item,
                      isSelected && tw`bg-[#DA7F67] text-white`,
                      !isSelected &&
                        (isEventTab
                          ? tw`bg-[#FEF5EA] hover:(bg-tertiary) text-black hover:(text-primary)`
                          : tw`bg-white font-normal text-black hover:(text-primary)`),
                    ]}>
                    <div tw="px-2 overflow-hidden text-ellipsis text-[13px] sm:text-[15px] md:text-[17px]">
                      {tv(tab, "name")}
                    </div>
                  </button>
                )
              })}
              <div
                tw="max-lg:hidden bg-neutral"
                css={{
                  gridColumn: `span ${5 - (combinedTabs.length % 5)} / span ${5 - (combinedTabs.length % 5)}`,
                  display: combinedTabs.length % 5 === 0 ? "none" : "block",
                  marginBottom: "-1px",
                  marginRight: "-1px",
                }}
              />
              <div
                tw="lg:hidden bg-neutral"
                css={{
                  gridColumn: `span ${3 - (combinedTabs.length % 3)} / span ${3 - (combinedTabs.length % 3)}`,
                  display: combinedTabs.length % 3 === 0 ? "none" : "block",
                  marginBottom: "-1px",
                  marginRight: "-1px",
                }}
              />
            </div>
          </div>
          <CartView isHome={false}>
            {/* 특별 이벤트 탭: 배너 + 이벤트 목록 */}
            {!isProductTab && (
              <>
                {selectedTab?.image?.url && selectedBundle && (
                  <EventCategoryBanner
                    name={tv(selectedTab, "name")}
                    startDate={selectedBundle.startDate}
                    endDate={selectedBundle.endDate}
                    imageUrl={selectedTab.image.url}
                  />
                )}
                {selectedTab?.description && !selectedTab.image?.url && selectedBundle && (
                  <NoPictureCategoryBanner
                    name={tv(selectedTab, "name")}
                    description={tv(selectedTab, "description")}
                  />
                )}

                <div tw="flex flex-col gap-4 max-lg:px-4">
                  {events?.pages
                    .flatMap((page) => page.items)
                    .filter(
                      (event, index, self) =>
                        index === self.findIndex((e) => tv(e, "name") === tv(event, "name")),
                    )
                    .map((event, index) => (
                      <Event
                        addToCart={() => handleAddToCart({ event })}
                        id={event.detailPage?.id}
                        key={index}
                        name={tv(event, "name")}
                        description={tv(event, "description")}
                        subDescription={
                          event.category?.startDate
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
                {events?.pages[0]?.meta?.totalItems === 0 && (
                  <div tw="flex flex-col gap-4 lg:gap-6" style={{ textAlign: "center" }}>
                    {t("productDetail.noEvents")}
                  </div>
                )}
              </>
            )}

            {/* 상시 탭: 상품 목록 (할인가 표시) */}
            {isProductTab && (
              <>
                <div tw="flex flex-col gap-4 max-lg:px-4">
                  {products?.items
                    ?.filter(
                      (product, index, self) =>
                        index === self.findIndex((p) => tv(p, "name") === tv(product, "name")),
                    )
                    .map((product, index) => {
                      // discountPrice는 BE에서 추가 후 orval 재생성 시 타입에 반영됨
                      const p = product as typeof product & { discountPrice?: number }
                      return (
                        <Event
                          addToCart={() => handleAddToCart({ event: product })}
                          id={product.detailPage?.id}
                          key={index}
                          name={tv(product, "name")}
                          description={tv(product, "description")}
                          subDescription=""
                          originalPrice={
                            p.discountPrice
                              ? `${product.price.toLocaleString()} ${t("reservePage.won")}`
                              : undefined
                          }
                          price={`${(p.discountPrice || product.price).toLocaleString()} ${t(
                            "reservePage.won",
                          )}`}
                        />
                      )
                    })}
                </div>
                {products?.items?.length === 0 && (
                  <div tw="flex flex-col gap-4 lg:gap-6" style={{ textAlign: "center" }}>
                    {t("productDetail.noEvents")}
                  </div>
                )}
              </>
            )}
          </CartView>
        </AppMaxWidth>
      </div>
      <Modal
        open={showInquiryModal}
        width="max-w-[400px] font-pretendard"
        onClose={() => setShowInquiryModal(false)}>
        <div tw="flex flex-col items-start justify-center h-full">
          <div tw="text-left text-[16px] lg:text-[18px] font-semibold leading-snug">
            {t("cart.emptyVisitThenSelectText1")}
          </div>

          <div tw="text-neutral70 text-[14px] lg:text-[16px] text-left mt-3">
            {t("cart.emptyVisitThenSelectText2")}
          </div>

          <div tw="flex w-full gap-2 mt-8">
            <Button
              tw="w-[150px] text-[13px] md:text-[15px]"
              style={{ variant: "outlined", color: "point", size: "sm" }}
              onClick={() => {
                setShowInquiryModal(false)
                setPendingAddEvent(null)
              }}>
              {t("cart.cancel")}
            </Button>

            <Button
              tw="w-[150px] text-[13px] md:text-[15px] px-[10px]"
              style={{ variant: "filled", color: "point", size: "sm" }}
              onClick={() => {
                setInquiry(false)
                setInquiryMemo("")
                setShowInquiryModal(false)
              }}>
              {t("cart.emptyVisitThenSelectButton")}
            </Button>
          </div>
        </div>
      </Modal>
    </Page>
  )
}

export default Events
