import React, { useLayoutEffect } from "react"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"

import bannerImg from "@/assets/images/products-banner.webp"
import mobileBannerImg from "@/assets/images/products-mobile-banner.webp"
import useResponsive from "@/lib/hooks/use-responsive"
import { useSearchParams } from "react-router-dom"
import CustomLink from "@/lib/components/custom-link.component"

import tw from "twin.macro"
import { useTranslation } from "react-i18next"
import { useProductCategoryControllerFindMany } from "@/lib/orval/product-categories/product-categories"
// import useLanguageQuery from "@/lib/hooks/use-language-query"
import useLanguageValue from "@/lib/hooks/use-language-key"
import { useProductDetailPageControllerFindManyInfinite } from "@/lib/orval/product-detail-pages/product-detail-pages"
import {
  Product as ProductModel,
  ProductDetailPageControllerFindManyStatus,
} from "@/lib/orval/model"
import { getNextPageParam } from "@/lib/api/http-client.helper"
import useLanguageQuery from "@/lib/hooks/use-language-query"
import { useEventBundleControllerFindVisible } from "@/lib/orval/event-bundle/event-bundle"
import { useEventControllerFindMany } from "@/lib/orval/events/events"

const item = tw`w-full font-bold font-nanumgothic text-center h-14 flex items-center justify-center bg-white`

interface ProductProps {
  name: string
  description: string
  price: string
  id: string
}

const Product = ({ name, description, price, id }: ProductProps) => {
  const { t } = useTranslation()
  return (
    <div tw="p-4 lg:p-6 rounded-lg border border-[#D0D0D0] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] font-nanumgothic">
      <div tw="text-[#333] text-lg font-bold">{name}</div>
      <div tw="mt-5 mb-3">{description}</div>
      <div tw="text-xl text-[#8d7b64] font-bold">{price}</div>
      <div tw="relative text-right">
        <div tw="md:absolute right-0 bottom-0">
          <CustomLink
            to={`/products/${id}`}
            tw="inline-block rounded-full px-3 h-10 leading-10 border border-point text-point text-xs">
            {t("products.detail")}
          </CustomLink>
        </div>
      </div>
    </div>
  )
}

const Products = () => {
  const { isMobile } = useResponsive()
  const langQuery = useLanguageQuery()
  const { t } = useTranslation()
  const tv = useLanguageValue()
  const { data: categories } = useProductCategoryControllerFindMany({
    status: "ACTIVE",
    sortBy: ["order"],
    sortOrder: ["ASC"],
    limit: 100,
    ...langQuery,
  })
  const [params, setParams] = useSearchParams()
  const selectedCategoryId = params.get("category")
  // 이벤트 상품 최소금액 조회를 위해 추가됨
  const { data: visibleEvents } = useEventBundleControllerFindVisible()
  const [bundleId, setBundleId] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (visibleEvents && visibleEvents[0]) {
      setBundleId(visibleEvents[0].id)
    }
  }, [visibleEvents])

  const { data: events } = useEventControllerFindMany({
    bundleId: bundleId ?? undefined,
    limit: 1000,
    ...langQuery,
  })
  // ***

  const { data: products } = useProductDetailPageControllerFindManyInfinite(
    {
      status: ProductDetailPageControllerFindManyStatus.ACTIVE,
      categoryId: selectedCategoryId ?? undefined,
      sortBy: ["order"],
      sortOrder: ["ASC"],
      limit: 100,
      ...langQuery,
    },
    {
      query: { getNextPageParam },
    },
  )

  const handleCategory = (id: string, replace?: boolean) => {
    setParams(
      (prev) => {
        prev.set("category", id.toString())
        return prev
      },
      { replace },
    )
  }

  useLayoutEffect(() => {
    if (categories && !selectedCategoryId) {
      handleCategory(categories.items[0].id, true)
    }
  }, [categories])

  if (!categories) {
    return <Page />
  }

  const colSpan = (column: number) => `span ${column} / span ${column}`

  return (
    <Page hiddenFooter={false}>
      <AppMaxWidth tw="max-lg:p-0">
        <img src={isMobile ? mobileBannerImg : bannerImg} alt="banner" tw="w-full" />

        <div tw="flex justify-center mt-8 lg:mt-16 mb-4 lg:mb-8 max-lg:p-4">
          <div tw="grid justify-center bg-[#EBECEF] gap-px p-px grid-cols-3 lg:grid-cols-5 w-full">
            {categories.items.map((category) => (
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

        <div tw="flex flex-col gap-6 max-lg:p-4 mb-16">
          {products?.pages
            .flatMap((p) => p.items)
            .map((product) => {
              let price
              // Check if product.products is an empty array
              if (Array.isArray(product.products) && product.products.length === 0) {
                // Filter events where events[].detailPage.id matches product.id
                const relatedEvents = events
                  ? events.items.filter((event) => event.detailPage?.id === product.id)
                  : []

                const minDiscountPrice = relatedEvents.reduce((min, event) => {
                  return event.discountPrice < min ? event.discountPrice : min
                }, Infinity)

                price =
                  minDiscountPrice === Infinity
                    ? `0 ${t("reservePage.won")}`
                    : `${minDiscountPrice.toLocaleString()} ${t("reservePage.won")}`
              } else {
                // Calculate the minimum price from product.products if available
                price = `${product.products
                  .reduce((acc, cur) => {
                    const p = cur as unknown as ProductModel
                    return acc === 0 ? p.price : Math.min(acc, p.price)
                  }, 0)
                  .toLocaleString()} ${t("reservePage.won")} ~`
              }

              return (
                <Product
                  key={product.id}
                  id={product.id}
                  name={tv(product, "name")}
                  description={tv(product, "description")}
                  price={price}
                />
              )
            })}
        </div>
        {/* <div tw="flex flex-col gap-6 max-lg:p-4 mb-16">
          {products?.pages
            .flatMap((p) => p.items)
            .map((product) => (
              <Product
                key={product.id}
                id={product.id}
                name={tv(product, "name")}
                description={tv(product, "description")}
                price={`${product.products
                  .reduce((acc, cur) => {
                    const p = cur as unknown as ProductModel
                    return acc === 0 ? p.price : Math.min(acc, p.price)
                  }, 0)
                  .toLocaleString()}원 ~`}
              />
            ))}
        </div> */}
      </AppMaxWidth>
    </Page>
  )
}

export default Products
