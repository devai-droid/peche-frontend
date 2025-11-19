import React, { useLayoutEffect } from "react"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"

import bannerImg from "@/assets/images/events-banner.jpg"
import mobileBannerImg from "@/assets/images/events-mobile-banner.jpg"
import useResponsive from "@/lib/hooks/use-responsive"

import tw from "twin.macro"
import { useTranslation } from "react-i18next"
import CartView from "@/features/product/components/cart-view.component"
import { Button, Icon, LinkButton } from "@/design-system/components"
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

const item = tw`w-full font-bold font-nanumgothic text-center h-14 flex items-center justify-center bg-white`

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
}: EventProps) => {
  const { t } = useTranslation()
  return (
    <div tw="bg-white p-4 lg:p-6 rounded-lg border border-[#D0D0D0] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] font-nanumgothic flex flex-col gap-1">
      <div tw="text-[#333] text-lg font-bold">{name}</div>
      <div style={{ whiteSpace: "pre-line" }}>{description}</div>
      <div tw="text-sm text-[#888]">{subDescription}</div>
      <div tw="flex items-center gap-2">
        {!!originalPrice && <div tw="text-[#717171] text-md line-through">{originalPrice}</div>}
        <div tw="text-xl text-[#8d7b64] font-bold">{price}</div>
      </div>
      <div tw="mt-2 text-[#F40000] text-sm">{t("common.vatNotIncluded")}</div>
      <div tw="relative text-right">
        <div tw="md:absolute right-0 bottom-0 inline-flex gap-3 ">
          <LinkButton style={{ size: "sm" }} to={`/products/${id}`}>
            {t("products.detail")}
          </LinkButton>
          <Button
            onClick={addToCart}
            tw="flex items-center justify-center gap-1"
            style={{ size: "sm", variant: "filled" }}>
            <Icon icon={ShoppingCartIcon} size={16} /> {t("common.save")}
          </Button>
        </div>
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
  return (
    <Page hiddenFooter={false}>
      <div tw="w-screen overflow-hidden">
        <img
          src={isMobile ? mobileBannerImg : bannerImg}
          alt="banner"
          tw="w-full max-h-[700px] h-[700px] object-cover block"
        />
      </div>

      <div tw="bg-neutral min-h-screen pt-[1px]">
        <AppMaxWidth tw="max-lg:p-0">
          {/* <div tw="max-lg:hidden">
              <img src={isMobile ? mobileBannerImg : bannerImg} alt="banner" tw="w-full" />
            </div> */}

          <div tw="flex justify-center mt-8 lg:mt-16 mb-4 lg:mb-12 max-lg:p-4">
            <div tw="grid justify-center bg-[#EBECEF] gap-px p-px grid-cols-3 lg:grid-cols-5 w-full">
              {categories?.items?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    handleCategory(category.id)
                  }}
                  css={[
                    item,
                    selectedCategoryId === category.id ? tw`text-white bg-point` : tw`text-black`,
                  ]}>
                  <div tw="px-2 overflow-hidden text-ellipsis">{tv(category, "name")}</div>
                </button>
              ))}
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

            <div tw="flex flex-col gap-6 max-lg:px-4">
              {events?.pages
                .flatMap((page) => page.items)
                .map((event, index) => (
                  <Event
                    addToCart={() => handleAddToCart({ event })}
                    id={event.detailPage.id}
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
                    price={`${(event.discountPrice || event.price).toLocaleString()} ${t("reservePage.won")}`}
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
