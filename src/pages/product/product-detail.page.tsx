import { ShoppingCartIcon } from "@/assets/icon"
import { Button, Chip, Icon } from "@/design-system/components"
import CartView from "@/features/product/components/cart-view.component"
import useCart from "@/features/product/hooks/use-cart"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"
import useLanguageValue from "@/lib/hooks/use-language-key"
import useLanguageQuery from "@/lib/hooks/use-language-query"
import { useEventBundleControllerFindVisible } from "@/lib/orval/event-bundle/event-bundle"
import { useEventControllerFindMany } from "@/lib/orval/events/events"
import { useProductDetailPageControllerFindOne } from "@/lib/orval/product-detail-pages/product-detail-pages"
import { useProductControllerFindMany } from "@/lib/orval/products/products"
import React, { useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import { useParams, useSearchParams } from "react-router-dom"
import tw from "twin.macro"
import dayjs from "dayjs"
import { getNextPageParam } from "@/lib/api/http-client.helper"
import TypeFilter from "@/pages/product/components/type-filter.component"
import { Helmet } from "react-helmet-async"

interface ProductProps {
  name: string
  description: string
  price: string | number
  isNew?: boolean
  isKakao?: boolean
  isBest?: boolean
  isPop?: boolean
  originalPrice?: string | number
  addToCart?: () => void
}

type ProductType = "event" | "normal" | "all"

const Separator = () => (
  <>
    <div tw="h-10" />
    <div tw="-ml-4 w-[calc(100vw-1rem)] h-2 bg-[#efefef] lg:hidden" />
    <div tw="h-10" />
  </>
)

const ProductItem = ({
  name,
  description,
  price,
  isNew,
  isKakao,
  isBest,
  isPop,
  originalPrice,
  addToCart,
}: ProductProps) => {
  const { t } = useTranslation()
  return (
    <div tw="p-4 lg:p-6 rounded-lg border border-[#D0D0D0] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] font-nanumgothic">
      <div tw="flex gap-2">
        {isNew && (
          <Chip tw="mb-3" color="blue">
            {t("common.new")}
          </Chip>
        )}
        {isPop && (
          <Chip tw="mb-3" color="blue">
            {t("common.pop")}
          </Chip>
        )}
        {isBest && <Chip tw="mb-3">{t("common.best")}</Chip>}
        {isKakao && (
          <Chip tw="mb-3" color="yellow">
            {t("common.kakaoFriend")}
          </Chip>
        )}
      </div>
      <div tw="text-[#333] text-lg font-bold">{name}</div>
      <div tw="mt-5 mb-3" style={{ whiteSpace: "pre-line" }}>
        {description}
      </div>
      <div tw="flex items-center gap-2">
        {originalPrice && <span tw="text-sm text-[#717171] line-through">{originalPrice}</span>}
        <span tw="text-xl text-[#8d7b64] font-bold">{price}</span>
      </div>
      {name && !name.includes("가다실") && !name.includes("처방전") && (
        <div tw="mt-2 text-[#F40000] text-sm">{t("common.vatNotIncluded")}</div>
      )}
      <div tw="relative text-right">
        <div tw="md:absolute right-0 bottom-0">
          <Button
            style={{ variant: "filled" }}
            tw="inline-flex items-center justify-center gap-1"
            onClick={addToCart}>
            <Icon icon={ShoppingCartIcon} size={16} /> {t("common.save")}
          </Button>
        </div>
      </div>
    </div>
  )
}

const ProductDetail = () => {
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const { id } = useParams<{ id: string }>()
  const langQuery = useLanguageQuery()
  const tv = useLanguageValue()

  const keyMatch = {
    ko: "",
    en: "EN",
    ja: "JA",
    th: "TH",
    zh: "ZH",
  }
  const { i18n } = useTranslation()
  const lang = i18n.language as keyof typeof keyMatch

  const { data: productDetail } = useProductDetailPageControllerFindOne(id ?? "", {
    query: { enabled: !!id },
  })
  const { data: products } = useProductControllerFindMany(
    {
      detailPageId: id,
      sortBy: [`order${keyMatch[lang]}`],
      sortOrder: ["ASC"],
      page: 1,
      limit: 500,
      ...langQuery,
    },
    { query: { enabled: !!id } },
  )
  // 수정 필요: 이벤트 번들에 포함된 이벤트만 가져오도록 수정. 어떤 이벤트 번들이 선택되었는지도 확인
  const [params, setParams] = useSearchParams()
  const selectedEventBundleId = params.get("bundle")
  const [productInfoClicked, setProductInfoClicked] = React.useState(false)
  const { data: visibleEvents } = useEventBundleControllerFindVisible()
  const { data: events } = useEventControllerFindMany(
    {
      detailPageId: id,
      bundleId: selectedEventBundleId ?? undefined,
      sortBy: ["discountPrice"],
      sortOrder: ["ASC"],
      page: 1,
      limit: 500,
      ...langQuery,
    },
    {
      query: {
        enabled: !!selectedEventBundleId,
        getNextPageParam,
      },
    },
  )
  const handleBundle = (bundleId: string) => {
    setParams((prev) => {
      prev.set("bundle", bundleId.toString())
      return prev
    })
  }

  const productRef = React.useRef<HTMLDivElement>(null)
  const descriptionRef = React.useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = React.useState(0)
  const [productType, setProductType] = React.useState<ProductType>("all")
  const showEvents = productType === "event" || productType === "all"
  const showNormal = productType === "normal" || productType === "all"

  useLayoutEffect(() => {
    const height = document.getElementById("header-height")?.clientHeight || 0
    setHeaderHeight(height + 16)
  }, [])

  useLayoutEffect(() => {
    if (visibleEvents?.length && !selectedEventBundleId) {
      setParams(
        (prev) => {
          prev.set("bundle", visibleEvents[0].id)
          return prev
        },
        { replace: true },
      )
    }
  })

  if (!productDetail || !products) {
    return <Page />
  }

  const category = tv(productDetail.category, "name")
  const name = tv(productDetail, "name")
  const subTitle = tv(productDetail, "description")
  const videoUrl = productDetail.referenceUrl?.split("/").pop()?.split("?")[0]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEventAddToCart = (event: any) => {
    // Utility function to get event end dates from local storage
    const getEventEndDates = () => {
      const storedData = localStorage.getItem("eventEndDates")
      return storedData ? JSON.parse(storedData) : {}
    }

    // Utility function to set event end dates in local storage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const setEventEndDates = (data: any) => {
      localStorage.setItem("eventEndDates", JSON.stringify(data))
    }

    // Retrieve existing end dates from local storage
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const endDates = getEventEndDates()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const selectedEventBundle = visibleEvents?.find((ev) => ev.id === selectedEventBundleId)

    if (selectedEventBundle) {
      // update endDates
      endDates[event.id] = selectedEventBundle.endDate
      // Set the end date of the selected event

      // Save the updated end dates back to local storage
      setEventEndDates(endDates)
    }
    addToCart({ event })
  }

  // 같은 이름의 이벤트가 있을 수 있음
  const eventListTemp = events?.items.map((event) => ({
    name: tv(event, "name"),
    description: tv(event, "description"),
    originalPrice: event.discountPrice
      ? `${event.price.toLocaleString()} ${t("reservePage.won")}`
      : undefined,
    price: `${(event.discountPrice || event.price).toLocaleString()} ${t("reservePage.won")}`,
    isKakao: event.label?.some((label) => label === "KAKAO"),
    isNew: event.label?.some((label) => label === "NEW"),
    isBest: event.label?.some((label) => label === "BEST"),
    isPop: event.label?.some((label) => label === "POP"),
    addToCart: () => handleEventAddToCart(event),
  }))

  // 같은 이름의 이벤트가 여러개 있을 수 있으므로 중복 제거
  const eventList = eventListTemp?.filter(
    (event, index, self) => index === self.findIndex((e) => e.name === event.name),
  )

  const normalProducts = products?.items.map((product) => ({
    name: tv(product, "name"),
    description: tv(product, "description"),
    price: `${product.price.toLocaleString()} ${t("reservePage.won")}`,
    addToCart: () => addToCart({ product }),
  }))

  const information: {
    label: string
    key: keyof typeof productDetail
  }[] = [
    {
      label: t("productDetail.procedure"),
      key: "procedure",
    },
    {
      label: t("productDetail.productInformation"),
      key: "information",
    },
    {
      label: t("productDetail.advantages"),
      key: "advantages",
    },
    {
      label: t("productDetail.target"),
      key: "target",
    },
    {
      label: t("productDetail.qAndA"),
      key: "qAndA",
    },
    {
      label: t("productDetail.caution"),
      key: "caution",
    },
  ]

  const productFilter = [
    {
      key: "all" as ProductType,
      label: t("common.all"),
    },
    {
      key: "event" as ProductType,
      label: t("common.event"),
    },
    {
      key: "normal" as ProductType,
      label: t("common.normal"),
    },
  ]

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - (headerHeight || 0),
        behavior: "smooth",
      })
    }
  }

  return (
    <Page hiddenFooter={false}>
      <Helmet>
        <title>{name} | 세니아클리닉</title>
        <meta name="description" content={`${subTitle}`} />
        {/* <meta name="keywords" content={`${category}, shopping, online store`} /> */}
      </Helmet>
      <AppMaxWidth tw="font-nanumgothic mt-4 lg:mt-10 relative mb-20">
        <CartView isHome={false}>
          <div tw="text-center mb-8 lg:mb-10">
            <Chip>{category}</Chip>
            <div tw="my-4 lg:mt-6 text-[#333] font-bold text-2xl">{name}</div>
            <div tw="text-[#999]">{subTitle}</div>
          </div>

          {productDetail.referenceUrl && (
            <div tw="w-full h-96 bg-[#EFEDED] rounded-lg mb-16">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoUrl}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
            </div>
          )}

          <div tw="mb-10 border-b border-[#888]">
            <div tw="flex items-center justify-center">
              <button
                tw="px-5 py-5"
                css={!productInfoClicked && tw`border-b-2 -mb-px text-point border-point`}
                onClick={() => {
                  setProductInfoClicked(false)
                  scrollTo(productRef)
                }}>
                {t("productDetail.reserveAProduct")}
              </button>
              <button
                tw="px-5 py-5"
                css={productInfoClicked && tw`border-b-2 -mb-px text-point border-point`}
                onClick={() => {
                  setProductInfoClicked(true)
                  scrollTo(descriptionRef)
                }}>
                {t("productDetail.productInformation")}
              </button>
            </div>
          </div>

          {/* <div ref={productRef} css={!eventList?.length && tw`hidden`}> */}
          <div ref={productRef}>
            <div tw="flex justify-between mb-6 lg:mb-11">
              <div tw="font-bold text-xl" css={productType !== "all" && tw`hidden`}>
                {t("productDetail.availableProduct")}{" "}
                {(eventList?.length || 0) + (normalProducts?.length || 0)}
              </div>
              <div tw="font-bold text-xl" css={productType !== "event" && tw`hidden`}>
                {t("productDetail.availableProduct")} {eventList?.length || 0}
              </div>
              <div tw="font-bold text-xl" css={productType !== "normal" && tw`hidden`}>
                {t("productDetail.availableProduct")} {normalProducts?.length || 0}
              </div>
              <div>
                <TypeFilter
                  onSelected={(item) => setProductType(item.key as ProductType)}
                  items={productFilter}
                />
              </div>
            </div>

            {/* 이벤트 번들 탭 여기에 */}
            {showEvents && visibleEvents && visibleEvents.length > 1 && (
              <div tw="border-b border-[#e5e5e5] my-10 bg-white pt-1">
                <div tw="flex justify-center items-center">
                  {visibleEvents.map((event) => (
                    <button
                      key={event.id}
                      tw="px-5 -mb-px text-center text-[#888]"
                      css={
                        selectedEventBundleId === event.id && tw`border-b-2 border-point text-point`
                      }
                      onClick={() => handleBundle(event.id)}>
                      <p tw="text-sm">{tv(event, "name")}</p>
                      <p tw="text-xs">
                        {dayjs(event.startDate).format("YYYY.MM.DD")}~
                        {dayjs(event.endDate).format("YYYY.MM.DD")}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showEvents && (
              <div>
                <div tw="flex flex-col gap-4 lg:gap-6">
                  {eventList?.map((product, index) => (
                    <ProductItem key={index} {...product} />
                  ))}
                </div>
                {!eventList?.length && (
                  <div tw="flex flex-col gap-4 lg:gap-6" style={{ textAlign: "center" }}>
                    {t("productDetail.noEvents")}
                  </div>
                )}
                <Separator />
              </div>
            )}
          </div>

          {showNormal && (
            <div css={!normalProducts?.length && tw`hidden`}>
              <div tw="flex justify-between mb-5">
                <div tw="font-bold text-xl">{t("productDetail.normalProducts")}</div>
              </div>

              <div tw="flex flex-col gap-4 lg:gap-6">
                {normalProducts.map((product, index) => (
                  <ProductItem key={index} {...product} />
                ))}
              </div>

              <Separator />
            </div>
          )}

          <div ref={descriptionRef}>
            <div tw="flex justify-between mb-5">
              <div tw="font-bold text-xl">{t("productDetail.productInformation")}</div>
            </div>

            <div tw="flex flex-col gap-6 lg:gap-8">
              <div tw="aspect-video" css={!productDetail.referenceUrl && tw`hidden`}>
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${
                    productDetail.referenceUrl?.split("/").pop() ?? ""
                  }`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen></iframe>
              </div>

              {information.map((info, index) => {
                const value = tv(productDetail, info.key).toString()
                return (
                  <div key={index} css={!value && tw`hidden`}>
                    <div tw="font-bold text-lg">{info.label}</div>
                    <hr tw="my-2" />
                    <div tw="text-[#333] whitespace-pre-wrap">{value}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </CartView>
      </AppMaxWidth>
    </Page>
  )
}

export default ProductDetail
