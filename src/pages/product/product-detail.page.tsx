import { ShoppingCartIcon, ChevronDownIcon } from "@/assets/icon"
import { Button, Chip, Icon } from "@/design-system/components"
import bannerImg from "@/assets/images/events-banner.jpg"
import mobileBannerImg from "@/assets/images/events-mobile-banner.jpg"
import useResponsive from "@/lib/hooks/use-responsive"
import CartView from "@/features/product/components/cart-view.component"
import useCart from "@/features/product/hooks/use-cart"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"
import useLanguageValue from "@/lib/hooks/use-language-key"
import useLanguageQuery from "@/lib/hooks/use-language-query"
import { useEventControllerFindMany } from "@/lib/orval/events/events"
import { useProductDetailPageControllerFindOne } from "@/lib/orval/product-detail-pages/product-detail-pages"
import { useProductControllerFindMany } from "@/lib/orval/products/products"
import React, { useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import { useParams, useSearchParams } from "react-router-dom"
import tw from "twin.macro"
import { Helmet } from "react-helmet-async"
import Modal from "@/lib/components/modal/modal.component"
import { useQuery } from "@tanstack/react-query"
import { blogV2PublicApi } from "@/pages/blog/blog-v2.api"
import DetailPageArticle from "./components/detail-page-article.component"

interface ProductProps {
  // eslint-disable-next-line react/no-unused-prop-types
  type: "event" | "normal"
  name: string
  description: string
  price: string | number
  originalPrice?: string | number
  bundleName?: string
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
  bundleName,
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
          <Chip tw="h-[24px] px-2 text-[13px] md:text-[15px] leading-[1] px-[4px]" color="primary">
            {t("common.pop")}
          </Chip>
        )}
        {isNew && (
          <Chip tw="h-[24px] px-2 text-[13px] md:text-[15px] leading-[1] px-[4px]" color="gray">
            {t("common.new")}
          </Chip>
        )}
        {isKakao && (
          <Chip tw="h-[24px] px-2 text-[13px] md:text-[15px] leading-[1] px-[4px]" color="pink">
            {t("common.kakaoFriend")}
          </Chip>
        )}
        {isBest && (
          <Chip tw="h-[24px] px-2 text-[13px] md:text-[15px] leading-[1] px-[4px]" color="darkgray">
            {t("common.best")}
          </Chip>
        )}
      </div>

      {/* 제목 */}
      <div tw="text-[16px] md:text-[18px] font-semibold">
        {bundleName && <span tw="text-[#DA7F67]">{bundleName} </span>}
        <span tw="text-neutralBlack">{name}</span>
      </div>

      {/* 설명 */}
      <div tw="text-[13px] md:text-[14px] text-neutral70 whitespace-pre-line">{description}</div>

      {/* 가격 */}
      <div tw="flex items-center gap-2 mb-2">
        {originalPrice && (
          <div tw="line-through text-[13px] sm:text-[14px] text-neutral50">{originalPrice}</div>
        )}
        <div tw="text-[16px] md:text-[18px] text-secondary3 font-semibold">{price}</div>
      </div>

      {/* 버튼 */}
      <div tw="flex justify-end gap-3 -mt-10">
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
  const { t, i18n } = useTranslation()
  const { addToCart, inquiry, setInquiry, setInquiryMemo, usePackageChecked, setUsePackageChecked } = useCart()
  const { id } = useParams<{ id: string }>()
  const langQuery = useLanguageQuery()
  const tv = useLanguageValue()
  const [params, setParams] = useSearchParams()
  const { isMobile } = useResponsive()

  const { data: productDetail } = useProductDetailPageControllerFindOne(id ?? "", {
    query: { enabled: !!id },
  })

  const keyMatch = { ko: "", en: "EN", ja: "JA", th: "TH", zh: "ZH", "zh-TW": "ZHTW" }
  const lang = i18n.language as keyof typeof keyMatch

  // 시술 상세페이지 본문(detail_page 글) — 상품의 한국어 이름(product_page)으로 조회. 대표 이미지 자리에 렌더.
  const koName = (productDetail as { name?: string } | undefined)?.name
  const { data: detailPost } = useQuery({
    queryKey: ["detail-page-post", koName, i18n.language],
    queryFn: () => blogV2PublicApi.detailPagePost(koName ?? "", i18n.language),
    enabled: !!koName,
    staleTime: 1000 * 60,
  })

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

  const { data: events } = useEventControllerFindMany(
    {
      detailPageId: id,
      sortBy: ["order"],
      sortOrder: ["ASC"],
      page: 1,
      limit: 500,
      ...langQuery,
    },
    { query: { enabled: !!id } },
  )

  const [showAllProducts, setShowAllProducts] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"event" | "product">("event")
  const [showInquiryModal, setShowInquiryModal] = React.useState(false)
  const [showPackageBlockModal, setShowPackageBlockModal] = React.useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pendingAddItem, setPendingAddItem] = React.useState<any>(null)

  React.useEffect(() => {
    if (!inquiry && pendingAddItem) {
      addToCart(pendingAddItem)
      setPendingAddItem(null)
    }
  }, [inquiry])

  React.useEffect(() => {
    if (!usePackageChecked && pendingAddItem) {
      addToCart(pendingAddItem)
      setPendingAddItem(null)
    }
  }, [usePackageChecked])

  if (!productDetail || !products) return <Page />

  const name = tv(productDetail, "name")
  const subTitle = tv(productDetail, "description")

  // 이벤트 상품 리스트
  const eventList =
    events?.items.map((event) => ({
      type: "event" as const,
      name: tv(event, "name"),
      description: tv(event, "description"),
      bundleName: event.category ? tv(event.category, "name") : undefined,
      price: `${(event.discountPrice || event.price).toLocaleString()} ${t("reservePage.won")}`,
      originalPrice: event.discountPrice
        ? `${event.price.toLocaleString()} ${t("reservePage.won")}`
        : undefined,
      isKakao: event.label?.includes("KAKAO"),
      isNew: event.label?.includes("NEW"),
      isBest: event.label?.includes("BEST"),
      isPop: event.label?.includes("POP"),
      addToCart: () => {
        const result = addToCart({ event })
        if (result?.blockedByInquiry) {
          setPendingAddItem({ event })
          setShowInquiryModal(true)
        } else if (result?.blockedByPackage) {
          setPendingAddItem({ event })
          setShowPackageBlockModal(true)
        }
      },
    })) ?? []

  // 이름이 같은 이벤트는 하나만 남기기
  const dedupedEventList = eventList.filter(
    (item, idx, self) => idx === self.findIndex((e) => e.name === item.name),
  )

  // 일반 상품 리스트 (정상가+할인가)
  const normalProducts = products.items.map((product) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = product as typeof product & { discountPrice?: number }
    return {
      type: "normal" as const,
      name: tv(product, "name"),
      description: tv(product, "description"),
      price: `${(p.discountPrice || product.price).toLocaleString()} ${t("reservePage.won")}`,
      originalPrice: p.discountPrice
        ? `${product.price.toLocaleString()} ${t("reservePage.won")}`
        : undefined,
      addToCart: () => {
        const result = addToCart({ product })
        if (result?.blockedByInquiry) {
          setPendingAddItem({ product })
          setShowInquiryModal(true)
        } else if (result?.blockedByPackage) {
          setPendingAddItem({ product })
          setShowPackageBlockModal(true)
        }
      },
    }
  })

  const DISPLAY_LIMIT = 5
  const activeList = activeTab === "event" ? dedupedEventList : normalProducts
  const displayedList = showAllProducts ? activeList : activeList.slice(0, DISPLAY_LIMIT)

  return (
    <Page hiddenFooter={false} bottomCartExists tw="bg-neutral">
      <div tw="bg-neutral min-h-screen">
        <Helmet>
          <title>{name} | 페슈의원</title>
          <meta name="description" content={`${subTitle}`} />
          {/* 상세 콘텐츠가 공통(제모 사본)이면 대표 상품을 canonical로 — 중복 콘텐츠 방지 */}
          {detailPost?.canonicalProductId && detailPost.canonicalProductId !== id && (
            <link
              rel="canonical"
              href={`https://pecheskin.clinic/${i18n.language}/products/${detailPost.canonicalProductId}`}
            />
          )}
        </Helmet>

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

        <AppMaxWidth tw="bg-neutral pt-12 lg:pt-20 pb-20 font-pretendard">
          <CartView isHome={false}>
            {/* 제목 카드 */}
            <div tw="bg-white p-[24px] mb-4 text-center border-b-[2px] border-b-secondary3">
              <div tw="text-secondary3 font-semibold text-[18px] md:text-[22px]">{name}</div>
              {/* <div tw="text-neutral70 text-[15px] md:text-[17px] mt-4">{subTitle}</div> */}
            </div>

            {/* 탭 */}
            <div tw="flex mb-4">
              <button
                onClick={() => { setActiveTab("event"); setShowAllProducts(false) }}
                css={[
                  tw`flex-1 py-3 text-[15px] md:text-[17px] font-semibold text-center transition-colors`,
                  activeTab === "event"
                    ? tw`bg-[#DA7F67] text-white`
                    : tw`bg-white text-neutral70 hover:text-[#DA7F67]`,
                ]}>
                {t("header.event")}
              </button>
              <button
                onClick={() => { setActiveTab("product"); setShowAllProducts(false) }}
                css={[
                  tw`flex-1 py-3 text-[15px] md:text-[17px] font-semibold text-center transition-colors`,
                  activeTab === "product"
                    ? tw`bg-[#DA7F67] text-white`
                    : tw`bg-white text-neutral70 hover:text-[#DA7F67]`,
                ]}>
                {t("header.surgeryAndPrice")}
              </button>
            </div>

            {/* 리스트 */}
            <div>
              {displayedList.length === 0 && activeTab === "event" && (
                <div tw="text-center text-neutral70 py-12 text-[15px] md:text-[17px]">
                  {t("productDetail.noEvents")}
                </div>
              )}
              {displayedList.map((item, index) => {
                const hideBorder = index === displayedList.length - 1
                return (
                  <ProductItem key={index} {...item} hideBorder={hideBorder} />
                )
              })}

              {/* 더보기 버튼 */}
              {!showAllProducts && activeList.length > DISPLAY_LIMIT && (
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
                    <ChevronDownIcon width={20} height={20} />
                  </button>
                </div>
              )}
            </div>

            {/* 비디오 영역 */}
            {(() => {
              const suffix = keyMatch[lang]
              const langReferenceUrl =
                (productDetail as unknown as Record<string, string | undefined>)[
                  `referenceUrl${suffix}`
                ]
              const langImage =
                (productDetail as unknown as Record<string, { url?: string } | undefined>)[
                  `image${suffix}`
                ]
              return (
                <>
                  {langReferenceUrl && (
                    <div tw="bg-white p-[8px] md:p-[16px] py-6 md:py-12 mt-16">
                      {/* 시술 소개 영상 텍스트 */}
                      <div tw="text-[18px] md:text-[22px] font-semibold text-neutralBlack mb-[8px] md:mb-[16px]">
                        {t("productDetail.treatmentVideo")}
                      </div>

                      {/* 검은색 보더 */}
                      <div tw="border-t border-neutralBlack mb-6" />

                      {/* 살색 비디오 컨테이너 */}
                      <div tw="bg-white">
                        <iframe
                          width="100%"
                          height="100%"
                          tw="w-full h-[650px] md:h-[860px]"
                          title="Youtube video"
                          src={`https://www.youtube.com/embed/${
                            langReferenceUrl?.split("/").pop() ?? ""
                          }`}
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  {/* 대표 이미지 자리 — 상세 본문(detail_page 글)이 있으면 블로그 스타일로 렌더, 없으면 기존 대표 이미지 */}
                  {detailPost?.bodyHtml ? (
                    <DetailPageArticle html={detailPost.bodyHtml} lang={i18n.language} />
                  ) : (
                    langImage?.url && (
                      <div tw="bg-white mt-10">
                        <img src={langImage.url} alt={name} tw="w-full rounded-lg" />
                      </div>
                    )
                  )}
                </>
              )
            })()}
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

          <div tw="flex justify-end gap-2 mt-8">
            <Button
              tw="w-[150px] text-[13px] md:text-[15px]"
              style={{ variant: "outlined", color: "point", size: "sm" }}
              onClick={() => setShowInquiryModal(false)}>
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

      {/* 보유권 사용 활성 상태에서 시술 담기 차단 모달 (기존 비우기 모달과 동일) */}
      <Modal
        open={showPackageBlockModal}
        width="max-w-[400px] font-pretendard"
        onClose={() => setShowPackageBlockModal(false)}>
        <div tw="flex flex-col items-start justify-center h-full">
          <div tw="text-left text-[16px] lg:text-[18px] font-semibold leading-snug">
            {t("reservePage.packageCartConflictTitle")}
          </div>
          <div tw="text-neutral70 text-[14px] lg:text-[16px] text-left mt-3">
            {t("reservePage.packageCartConflictText")}
          </div>
          <div tw="flex w-full gap-2 mt-8">
            <Button
              tw="w-[150px] text-[13px] md:text-[15px]"
              style={{ variant: "outlined", color: "point", size: "sm" }}
              onClick={() => {
                setShowPackageBlockModal(false)
                setPendingAddItem(null)
              }}>
              {t("cart.cancel")}
            </Button>
            <Button
              tw="w-[150px] text-[13px] md:text-[15px] px-[10px]"
              style={{ variant: "filled", color: "point", size: "sm" }}
              onClick={() => {
                setUsePackageChecked(false)
                setShowPackageBlockModal(false)
              }}>
              {t("reservePage.clearPackage")}
            </Button>
          </div>
        </div>
      </Modal>
    </Page>
  )
}

export default ProductDetail
