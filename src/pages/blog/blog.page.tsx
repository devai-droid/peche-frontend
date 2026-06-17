import React, { useState } from "react"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"
import bannerImg from "@/assets/images/products-banner.jpg"
import mobileBannerImg from "@/assets/images/products-mobile-banner.jpg"
import useResponsive from "@/lib/hooks/use-responsive"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useAdminAuth } from "@/lib/hooks/use-admin-auth"
import { useQueries, useQuery } from "@tanstack/react-query"
import { blogV2PublicApi } from "./blog-v2.api"
import BlogCard from "./components/blog-card.component"
import { BottomButtons } from "@/features/product/components/cart-view.component"
import BlogPagination from "./components/blog-pagination.component"
import tw from "twin.macro"
import { useProductCategoryControllerFindMany } from "@/lib/orval/product-categories/product-categories"
import { useProductDetailPageControllerFindMany } from "@/lib/orval/product-detail-pages/product-detail-pages"
import { ProductDetailPageControllerFindManyStatus } from "@/lib/orval/model"
import useLanguageValue from "@/lib/hooks/use-language-key"
import useLanguageQuery from "@/lib/hooks/use-language-query"

const POSTS_PER_PAGE = 12

// 대분류별 상세페이지 칩 특수 규칙 (라벨 ≠ 매칭어, 부분 일치). 없는 대분류는 DB 상세페이지로 자동 생성.
const SPECIAL_DETAIL_CHIPS: Record<string, { label: string; contains: string }[]> = {
  여성제모: [
    { label: "젠틀맥스 프로 플러스", contains: "젠틀맥스" },
    { label: "클라리티2", contains: "클라리티" },
  ],
  남성제모: [{ label: "젠틀맥스 프로 플러스", contains: "젠틀맥스" }], // 젠틀맥스만
}

const ALL_CHIP_KEY = "__all__"

type DetailChip = { key: string; label: string; productPage?: string; productPageContains?: string }

const item = tw`w-full font-semibold font-pretendard text-center h-14 flex items-center justify-center bg-white`

const Blog = () => {
  const { t, i18n } = useTranslation()
  const { isMobile, isDesktop } = useResponsive()
  const navigate = useNavigate()
  const { isAdmin } = useAdminAuth()
  const tv = useLanguageValue()
  const [page, setPage] = useState(1)
  const [showInquiryButtons, setShowInquiryButtons] = useState(false)
  const [selectedProductCatId, setSelectedProductCatId] = useState<string | null>(null)
  const [selectedChipKey, setSelectedChipKey] = useState<string>(ALL_CHIP_KEY)

  const lang = i18n.language
  const langQuery = useLanguageQuery()

  // 대분류: 전체시술 페이지와 동일 파라미터로 조회 → 순서·갯수 자동 일치 (어드민서 추가 시 함께 반영)
  const { data: productCategoriesData } = useProductCategoryControllerFindMany({
    status: "ACTIVE",
    sortBy: ["order"],
    sortOrder: ["ASC"],
    limit: 100,
    ...langQuery,
  })
  const productCategories = (productCategoriesData?.items ?? []).map((cat) => ({
    id: cat.id,
    name: tv(cat, "name"),
  }))
  const selectedCatName = productCategories.find((c) => c.id === selectedProductCatId)?.name ?? ""

  // 선택된 대분류의 상세페이지 (칩 출처: 어드민 등록 DB). 특수 대분류(여성/남성 제모)는 config 사용.
  // 대분류명은 띄어쓰기 차이("남성 제모" vs "남성제모") 무시하고 매칭.
  const specialChips = SPECIAL_DETAIL_CHIPS[selectedCatName.replace(/\s+/g, "")]
  const isSpecialCat = !!specialChips
  const { data: detailPagesData } = useProductDetailPageControllerFindMany(
    {
      status: ProductDetailPageControllerFindManyStatus.ACTIVE,
      categoryId: selectedProductCatId ?? undefined,
      limit: 100,
      ...langQuery,
    },
    { query: { enabled: !!selectedProductCatId && !isSpecialCat } },
  )

  // 상세페이지 칩 목록 (대분류 선택 시에만). 맨 앞 '전체' 칩.
  const detailChips: DetailChip[] = (() => {
    if (!selectedProductCatId) return []
    let chips: DetailChip[]
    if (specialChips) {
      chips = specialChips.map((c) => ({
        key: c.label,
        label: c.label,
        productPageContains: c.contains,
      }))
    } else {
      chips = (detailPagesData?.items ?? []).map((dp) => {
        const name = tv(dp, "name")
        return { key: dp.id, label: name, productPage: name }
      })
    }
    if (chips.length === 0) return []
    return [{ key: ALL_CHIP_KEY, label: t("blog.allCategory") }, ...chips]
  })()

  const selectedChip = detailChips.find((c) => c.key === selectedChipKey)

  // 중분류(상세페이지)별 등록 글 개수 — 각 칩의 필터로 total만 조회 (limit:1)
  const chipCountQueries = useQueries({
    queries: detailChips.map((chip) => ({
      queryKey: ["blog-v2-count", lang, selectedProductCatId, chip.key],
      queryFn: () =>
        blogV2PublicApi.list({
          lang,
          productCategoryId: selectedProductCatId ?? undefined,
          productPage: chip.productPage,
          productPageContains: chip.productPageContains,
          page: 1,
          limit: 1,
        }),
      enabled: !!selectedProductCatId,
      staleTime: 1000 * 60 * 5,
    })),
  })
  const chipCountByKey = new Map<string, number>()
  detailChips.forEach((chip, idx) => {
    const total = chipCountQueries[idx]?.data?.total
    if (typeof total === "number") chipCountByKey.set(chip.key, total)
  })

  // 글 목록: v2 공개 API
  const { data, isLoading } = useQuery({
    queryKey: ["blog-v2-public", page, lang, selectedProductCatId, selectedChipKey],
    queryFn: () =>
      blogV2PublicApi.list({
        lang,
        productCategoryId: selectedProductCatId ?? undefined,
        productPage: selectedChip?.productPage,
        productPageContains: selectedChip?.productPageContains,
        page,
        limit: POSTS_PER_PAGE,
      }),
  })

  const posts = data?.items ?? []
  const lastPage = data ? Math.max(1, Math.ceil(data.total / POSTS_PER_PAGE)) : 1

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleTabClick = (productCatId: string | null) => {
    setSelectedProductCatId(productCatId)
    setSelectedChipKey(ALL_CHIP_KEY) // 대분류 바뀌면 상세페이지 칩 초기화
    setPage(1)
  }

  const handleChipClick = (chipKey: string) => {
    setSelectedChipKey(chipKey)
    setPage(1)
  }

  const tabs = [
    { id: null, label: t("blog.allCategory") },
    ...productCategories.map((cat) => ({ id: cat.id, label: cat.name })),
  ]

  return (
    <Page hiddenFooter={false} bottomCartExists={false}>
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
          ">
          <div tw="text-[39px] lg:text-[50px] font-time font-normal tracking-tight">
            {t("blog.title")}
          </div>
          <div tw="text-[18px] lg:text-[22px] font-pretendard text-center">
            {t("blog.subtitle")}
          </div>
        </div>
      </div>

      <div tw="bg-white min-h-screen font-pretendard tracking-tight leading-[150%]">
        <AppMaxWidth tw="max-lg:px-0 max-lg:pt-0 pb-20 lg:pb-32">
          {/* 시술 대분류 탭 (product_category) */}
          {productCategories.length > 0 && (
            <div tw="flex justify-center mt-8 lg:mt-16 mb-4 lg:mb-12 max-lg:p-4">
              <div tw="grid justify-center bg-neutral30 gap-px p-px grid-cols-3 lg:grid-cols-5 w-full">
                {tabs.map((tab) => {
                  const isSelected = selectedProductCatId === tab.id
                  return (
                    <button
                      key={tab.id ?? "__all__"}
                      onClick={() => handleTabClick(tab.id)}
                      css={[
                        item,
                        isSelected
                          ? tw`text-white bg-primary`
                          : tw`font-normal text-neutralBlack hover:(text-primary)`,
                      ]}>
                      <div tw="px-2 overflow-hidden text-ellipsis text-[13px] sm:text-[15px] md:text-[17px]">
                        {tab.label}
                      </div>
                    </button>
                  )
                })}
                <div
                  tw="max-lg:hidden bg-white"
                  css={{
                    gridColumn: `span ${5 - (tabs.length % 5)} / span ${5 - (tabs.length % 5)}`,
                    display: tabs.length % 5 === 0 ? "none" : "block",
                    marginBottom: "-1px",
                    marginRight: "-1px",
                  }}
                />
                <div
                  tw="lg:hidden bg-white"
                  css={{
                    gridColumn: `span ${3 - (tabs.length % 3)} / span ${3 - (tabs.length % 3)}`,
                    display: tabs.length % 3 === 0 ? "none" : "block",
                    marginBottom: "-1px",
                    marginRight: "-1px",
                  }}
                />
              </div>
            </div>
          )}

          {/* 상세페이지(product_page) 필터 — 밑줄형 텍스트 탭. 대분류 선택 시 노출 */}
          {detailChips.length > 0 && (
            <div tw="flex flex-wrap justify-start gap-x-6 gap-y-2 mb-8 lg:mb-12 px-4">
              {detailChips.map((chip) => {
                const isSelected = selectedChipKey === chip.key
                return (
                  <button
                    key={chip.key}
                    onClick={() => handleChipClick(chip.key)}
                    tw="pb-1 text-[15px] lg:text-[17px] border-b-2 transition-colors duration-200"
                    css={[
                      isSelected
                        ? tw`text-[#DA7F67] border-[#DA7F67] font-semibold`
                        : tw`text-neutral70 border-transparent hover:text-[#DA7F67]`,
                    ]}>
                    {chip.label}
                    {chip.key !== ALL_CHIP_KEY && chipCountByKey.get(chip.key) !== undefined && (
                      <span
                        tw="ml-0.5 align-super text-[10px] lg:text-[11px] font-semibold"
                        css={[{ color: "#DA7F67" }]}>
                        {chipCountByKey.get(chip.key)}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div tw="flex justify-center py-20">
              <div tw="text-neutral50 text-[16px]">...</div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && posts.length === 0 && (
            <div tw="flex flex-col items-center py-20 max-lg:px-4">
              <div tw="text-[18px] lg:text-[22px] text-neutral70">{t("blog.noPosts")}</div>
              {isAdmin && isDesktop && (
                <div tw="flex justify-center mt-6">
                  <button
                    onClick={() => navigate(`/${lang}/blog/write`)}
                    tw="
                      px-4 py-2 text-[14px] lg:text-[15px]
                      border font-medium
                      transition-colors duration-200
                      hover:text-white
                    "
                    css={[
                      {
                        color: "#DA7F67",
                        borderColor: "#DA7F67",
                      },
                      tw`hover:bg-[#DA7F67]`,
                    ]}>
                    {t("blog.write")}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Blog Grid */}
          {!isLoading && posts.length > 0 && (
            <>
              <div
                tw="max-lg:px-4"
                css={[
                  tw`grid gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-12`,
                  isDesktop && tw`grid-cols-4`,
                  !isDesktop && isMobile && tw`grid-cols-1`,
                  !isDesktop && !isMobile && tw`grid-cols-2`,
                ]}>
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} productCategories={productCategories} />
                ))}
              </div>

              {isAdmin && isDesktop && (
                <div tw="flex justify-end mt-10 lg:mt-12 max-lg:px-4">
                  <button
                    onClick={() => navigate(`/${lang}/blog/write`)}
                    tw="
                      px-4 py-2 text-[14px] lg:text-[15px]
                      border font-medium
                      transition-colors duration-200
                      hover:text-white
                    "
                    css={[
                      {
                        color: "#DA7F67",
                        borderColor: "#DA7F67",
                      },
                      tw`hover:bg-[#DA7F67]`,
                    ]}>
                    {t("blog.write")}
                  </button>
                </div>
              )}

              <div tw="mt-16 lg:mt-20">
                <BlogPagination
                  currentPage={page}
                  lastPage={lastPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </AppMaxWidth>
      </div>
      {/* 모바일 하단 상담/예약 탭바 (다른 페이지와 동일) — lg:hidden 자체 처리 */}
      <BottomButtons
        showInquiryButtons={showInquiryButtons}
        setShowInquiryButtons={setShowInquiryButtons}
      />
    </Page>
  )
}

export default Blog
