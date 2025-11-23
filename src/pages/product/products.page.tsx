import React, { useLayoutEffect } from "react"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"

import bannerImg from "@/assets/images/products-banner.jpg"
import mobileBannerImg from "@/assets/images/products-mobile-banner.jpg"
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

const item = tw`w-full font-normal font-pretendard text-center h-14 flex items-center justify-center bg-white`

interface ProductProps {
  name: string
  description: string
  price: string
  id: string
}

const Product = ({ name, description, price, id }: ProductProps) => {
  const { t } = useTranslation()
  return (
    <div tw="bg-white p-4 font-pretendard flex flex-col gap-2 tracking-tight leading-[150%]">
      <div tw="text-neutralBlack text-[18px] md:text-[22px] font-semibold">{name}</div>
      <div tw="text-[13px] md:text-[14px] text-neutral70" style={{ whiteSpace: "pre-line" }}>
        {description}
      </div>
      <div tw="text-[16px] md:text-[18px] text-neutralBlack font-bold">{price}</div>
      <div tw="relative text-right">
        <div tw="md:absolute right-0 bottom-0">
          <CustomLink
            to={`/products/${id}`}
            tw="inline-block px-3 h-10 leading-10 border border-primary text-primary text-xs">
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
      <div tw="w-screen overflow-hidden">
        <img
          src={isMobile ? mobileBannerImg : bannerImg}
          alt="banner"
          tw="w-full max-h-[700px] h-[700px] object-cover block"
        />
        <div tw="absolute left-[8%] top-[10%] text-left text-neutralBlack">
          <div tw="text-[39px] lg:text-[50px] font-time font-normal tracking-tight">Treatments</div>
          <div tw="text-[18px] lg:text-[22px] font-pretendard">전체 시술</div>
        </div>
      </div>
      <div tw="bg-neutral min-h-screen pt-[1px]">
        <AppMaxWidth tw="max-lg:p-0">
          <div tw="bg-neutral flex justify-center mt-8 lg:mt-16 mb-4 lg:mb-8 max-lg:p-4">
            <div tw="grid justify-center bg-neutral30 gap-px p-px grid-cols-3 lg:grid-cols-5 w-full">
              {categories.items.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    handleCategory(category.id)
                  }}
                  css={[
                    item,
                    selectedCategoryId === category.id
                      ? tw`text-white bg-primary`
                      : tw`text-neutralBlack`,
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

          <div tw="flex flex-col gap-4 max-lg:p-4 mb-16">
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
      </div>
    </Page>
  )
}

export default Products
