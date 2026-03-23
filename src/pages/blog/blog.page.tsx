import React, { useState } from "react"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"
import bannerImg from "@/assets/images/products-banner.jpg"
import mobileBannerImg from "@/assets/images/products-mobile-banner.jpg"
import useResponsive from "@/lib/hooks/use-responsive"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useAdminAuth } from "@/lib/hooks/use-admin-auth"
import { useBlogList } from "./use-blog"
import BlogCard from "./components/blog-card.component"
import BlogPagination from "./components/blog-pagination.component"
import tw from "twin.macro"
import { useEventCategoryControllerFindManyWithPaginationQuery } from "@/lib/orval/event-categories/event-categories"
import { EventCategoryControllerFindManyWithPaginationQueryStatus } from "@/lib/orval/model"
import useLanguageValue from "@/lib/hooks/use-language-key"

const POSTS_PER_PAGE = 12

const item = tw`w-full font-semibold font-pretendard text-center h-14 flex items-center justify-center bg-white`

const colSpan = (column: number) => `span ${column} / span ${column}`

const Blog = () => {
  const { t, i18n } = useTranslation()
  const { isMobile, isDesktop } = useResponsive()
  const navigate = useNavigate()
  const { isAdmin } = useAdminAuth()
  const tv = useLanguageValue()
  const [page, setPage] = useState(1)
  const [selectedEventCatId, setSelectedEventCatId] = useState<string | null>(null)

  const lang = i18n.language

  const { data: eventCategoriesData } = useEventCategoryControllerFindManyWithPaginationQuery({
    status: EventCategoryControllerFindManyWithPaginationQueryStatus.ACTIVE,
    sortBy: ["order"],
    sortOrder: ["ASC"],
    limit: 100,
  })

  const eventCategories = eventCategoriesData?.items ?? []

  const { data, isLoading } = useBlogList(
    page,
    POSTS_PER_PAGE,
    lang,
    selectedEventCatId ?? undefined,
  )

  const posts = data?.data ?? []
  const lastPage = data?.lastPage ?? 1

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleTabClick = (eventCatId: string | null) => {
    setSelectedEventCatId(eventCatId)
    setPage(1)
  }

  const tabs = [
    { id: null, label: t("blog.allCategory") },
    ...eventCategories.map((cat) => ({ id: cat.id, label: tv(cat, "name") })),
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
          {/* Event Category Tabs */}
          {eventCategories.length > 0 && (
            <div tw="flex justify-center mt-8 lg:mt-16 mb-4 lg:mb-12 max-lg:p-4">
              <div tw="grid justify-center bg-neutral30 gap-px p-px grid-cols-3 lg:grid-cols-5 w-full">
                {tabs.map((tab, index) => {
                  const isSelected = selectedEventCatId === tab.id
                  const isFirstRow = isDesktop ? index < 5 : index < 3
                  return (
                    <button
                      key={tab.id ?? "__all__"}
                      onClick={() => handleTabClick(tab.id)}
                      css={[
                        item,
                        isSelected && tw`bg-[#DA7F67] text-white`,
                        !isSelected &&
                          (isFirstRow
                            ? tw`bg-[#FEF5EA] hover:(bg-tertiary) text-black hover:(text-primary)`
                            : tw`bg-white font-normal text-black hover:(text-primary)`),
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
                    gridColumn: colSpan(5 - (tabs.length % 5)),
                    display: tabs.length % 5 === 0 ? "none" : "block",
                    marginBottom: "-1px",
                    marginRight: "-1px",
                  }}
                />
                <div
                  tw="lg:hidden bg-white"
                  css={{
                    gridColumn: colSpan(3 - (tabs.length % 3)),
                    display: tabs.length % 3 === 0 ? "none" : "block",
                    marginBottom: "-1px",
                    marginRight: "-1px",
                  }}
                />
              </div>
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
              {isAdmin && (
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
                  <BlogCard key={post.id} post={post} eventCategories={eventCategories} />
                ))}
              </div>

              {isAdmin && (
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
    </Page>
  )
}

export default Blog
