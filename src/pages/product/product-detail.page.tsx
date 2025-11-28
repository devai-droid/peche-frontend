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
import React from "react"
import { useTranslation } from "react-i18next"
import { useParams, useSearchParams } from "react-router-dom"
import tw from "twin.macro"
import { Helmet } from "react-helmet-async"

interface ProductProps {
  // eslint-disable-next-line react/no-unused-prop-types
  type: "event" | "normal"
  name: string
  description: string
  price: string | number
  originalPrice?: string | number
  isNew?: boolean
  isKakao?: boolean
  isBest?: boolean
  isPop?: boolean
  addToCart?: () => void
  hideBorder?: boolean
}

const ProductItem = ({
  name,
  description,
  price,
  originalPrice,
  isNew,
  isKakao,
  isBest,
  isPop,
  addToCart,
  hideBorder,
}: ProductProps) => {
  const { t } = useTranslation()

  return (
    <div
      css={[
        tw`bg-white p-4 font-pretendard flex flex-col gap-2 tracking-tight leading-[150%]`,
        !hideBorder && tw`border-b border-neutral30`,
      ]}>
      {/* Chip 영역 */}
      <div tw="flex gap-1">
        {isPop && (
          <Chip tw="h-[24px] px-2 text-[11px] leading-[1]" color="primary">
            {t("common.pop")}
          </Chip>
        )}
        {isNew && (
          <Chip tw="h-[24px] px-2 text-[11px] leading-[1]" color="gray">
            {t("common.new")}
          </Chip>
        )}
        {isKakao && (
          <Chip tw="h-[24px] px-2 text-[11px] leading-[1]" color="pink">
            {t("common.kakaoFriend")}
          </Chip>
        )}
        {isBest && (
          <Chip tw="h-[24px] px-2 text-[11px] leading-[1]" color="darkgray">
            {t("common.best")}
          </Chip>
        )}
      </div>

      {/* 제목 */}
      <div tw="text-neutralBlack text-[18px] md:text-[22px] font-semibold">{name}</div>

      {/* 설명 */}
      <div tw="text-[13px] md:text-[14px] text-neutral70 whitespace-pre-line">{description}</div>

      {/* 가격 */}
      <div tw="flex items-center gap-2 mb-2">
        {originalPrice && <div tw="line-through text-[13px] text-neutral50">{originalPrice}</div>}
        <div tw="text-[16px] md:text-[18px] text-neutralBlack font-bold">{price}</div>
      </div>

      {/* 버튼 */}
      <div tw="flex justify-end gap-3 md:-mt-10 -mt-2">
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

const ProductDetail = () => {
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const { id } = useParams<{ id: string }>()
  const langQuery = useLanguageQuery()
  const tv = useLanguageValue()
  const [params, setParams] = useSearchParams()

  const { data: productDetail } = useProductDetailPageControllerFindOne(id ?? "", {
    query: { enabled: !!id },
  })

  const { i18n } = useTranslation()
  const keyMatch = { ko: "", en: "EN", ja: "JA", th: "TH", zh: "ZH" }
  const lang = i18n.language as keyof typeof keyMatch

  const selectedEventBundleId = params.get("bundle")

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
    { query: { enabled: !!selectedEventBundleId } },
  )

  const [showAllProducts, setShowAllProducts] = React.useState(false)

  // 최초 번들 자동 선택
  React.useEffect(() => {
    if (visibleEvents?.length && !selectedEventBundleId) {
      setParams((prev) => {
        prev.set("bundle", visibleEvents[0].id)
        return prev
      })
    }
  }, [visibleEvents])

  if (!productDetail || !products) return <Page />

  const name = tv(productDetail, "name")
  const subTitle = tv(productDetail, "description")

  // 이벤트 상품 리스트
  const eventList =
    events?.items.map((event) => ({
      type: "event" as const,
      name: tv(event, "name"),
      description: tv(event, "description"),
      price: `${(event.discountPrice || event.price).toLocaleString()} ${t("reservePage.won")}`,
      originalPrice: event.discountPrice
        ? `${event.price.toLocaleString()} ${t("reservePage.won")}`
        : undefined,
      isKakao: event.label?.includes("KAKAO"),
      isNew: event.label?.includes("NEW"),
      isBest: event.label?.includes("BEST"),
      isPop: event.label?.includes("POP"),
      addToCart: () => addToCart({ event }),
    })) ?? []

  // 🔥 이름이 같은 이벤트는 하나만 남기기
  const dedupedEventList = eventList.filter(
    (item, idx, self) => idx === self.findIndex((e) => e.name === item.name),
  )

  // 일반 상품 리스트
  const normalProducts = products.items.map((product) => ({
    type: "normal" as const,
    name: tv(product, "name"),
    description: tv(product, "description"),
    price: `${product.price.toLocaleString()} ${t("reservePage.won")}`,
    addToCart: () => addToCart({ product }),
  }))

  // 합치기
  const mergedList = [...dedupedEventList, ...normalProducts]

  const DISPLAY_LIMIT = 5
  const displayedList = showAllProducts ? mergedList : mergedList.slice(0, DISPLAY_LIMIT)

  // 마지막 이벤트 index
  const lastEventIndex = dedupedEventList.length - 1

  // 마지막 일반 상품 index (mergedList 기준 X, normalProducts 기준)
  const lastNormalIndex = normalProducts.length - 1

  return (
    <Page hiddenFooter={false} tw="bg-neutral">
      <div tw="bg-neutral min-h-screen">
        <Helmet>
          <title>{name} | 페슈의원</title>
          <meta name="description" content={`${subTitle}`} />
        </Helmet>

        <AppMaxWidth tw="bg-neutral pt-24 lg:pt-10 pb-20 font-pretendard">
          <CartView isHome={false}>
            {/* 제목 카드 */}
            <div tw="bg-white p-6 mb-8 text-center">
              <div tw="text-neutralBlack font-semibold text-[20px] md:text-[22px]">{name}</div>
              <div tw="text-neutral70 text-[15px] md:text-[17px] mt-4">{subTitle}</div>
            </div>

            {/* 상품 리스트 */}
            <div>
              {displayedList.map((item, index) => {
                const isEvent = item.type === "event"
                const isNormal = item.type === "normal"

                // 이벤트 상품 마지막인지?
                const hideBorderEvent = isEvent && index === eventList.length - 1

                // 일반 상품 마지막인지?
                const hideBorderNormal =
                  isNormal && index === eventList.length + normalProducts.length - 1

                const hideBorder = hideBorderEvent || hideBorderNormal

                // 이벤트 → 일반 사이 공간
                const showGap =
                  index > 0 && displayedList[index - 1].type === "event" && item.type === "normal"

                return (
                  <React.Fragment key={index}>
                    {showGap && <div tw="h-6 bg-neutral" />}
                    <ProductItem {...item} hideBorder={hideBorder} />
                  </React.Fragment>
                )
              })}

              {/* 더보기 버튼 */}
              {!showAllProducts && mergedList.length > DISPLAY_LIMIT && (
                <div tw="flex justify-center mt-8">
                  <button
                    tw="
                      w-full 
                      max-w-[100%]
                      bg-white
                      border border-primary
                      text-primary
                      py-3
                      flex items-center justify-center 
                      text-[16px]
                      font-medium
                      gap-2
                    "
                    onClick={() => setShowAllProducts(true)}>
                    {t("productDetail.moreProcedures")}
                    <span tw="text-[18px] leading-none">⌄</span> {/* 캐럿 아이콘 */}
                  </button>
                </div>
              )}
            </div>

            {/* 비디오 영역 */}
            {productDetail.referenceUrl && (
              <div tw="bg-white p-6 md:p-10 mt-16">
                {/* 시술 소개 영상 텍스트 */}
                <div tw="text-[18px] md:text-[22px] font-semibold text-neutralBlack mb-4">
                  {t("productDetail.treatmentVideo")}
                </div>

                {/* 검은색 보더 */}
                <div tw="border-t border-neutralBlack mb-6" />

                {/* 살색 비디오 컨테이너 */}
                <div tw="bg-tertiary p-4 md:p-8">
                  <iframe
                    width="100%"
                    height="100%"
                    tw="w-full h-[650px] md:h-[860px]"
                    title="Youtube video"
                    src={`https://www.youtube.com/embed/${
                      productDetail.referenceUrl?.split("/").pop() ?? ""
                    }`}
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* 대표 이미지 영역 */}
            {productDetail.image?.url && (
              <div tw="bg-white p-6 md:p-10 mt-10">
                <img src={productDetail.image.url} alt={name} tw="w-full rounded-lg" />
              </div>
            )}
          </CartView>
        </AppMaxWidth>
      </div>
    </Page>
  )
}

export default ProductDetail
