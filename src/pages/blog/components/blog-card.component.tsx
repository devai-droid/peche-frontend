import React from "react"
import CustomLink from "@/lib/components/custom-link.component"
import { css } from "twin.macro"
import { BlogV2Post, displayViewCount, resolveBlogAsset } from "../blog-v2.api"

interface ProductCat {
  id: string
  name: string
}

interface BlogCardProps {
  post: BlogV2Post
  productCategories?: ProductCat[]
}

const lineClamp2 = css`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const BlogCard = ({ post, productCategories }: BlogCardProps) => {
  const productCategory = productCategories?.find((c) => c.id === post.productCategoryId)

  const { title } = post
  const summary = post.subtitle ?? post.summaryText ?? ""
  // 목록 노출 날짜 = 최근 수정일(updatedAt). JSON-LD의 dateModified와 일관.
  const displayDate = post.updatedAt
    ? new Date(post.updatedAt)
        .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
        .replace(/\. /g, ".")
        .replace(/\.$/, "")
    : ""

  return (
    <CustomLink to={`/blog/${post.slug}`} tw="block" className="group">
      <div tw="bg-white overflow-hidden font-pretendard tracking-tight">
        {/* Thumbnail */}
        <div tw="w-full aspect-[4/3] overflow-hidden bg-neutral30">
          {post.thumbnailUrl ? (
            <img
              src={resolveBlogAsset(post.thumbnailUrl)}
              alt={title}
              tw="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div tw="w-full h-full flex items-center justify-center text-neutral50 text-[14px]">
              No Image
            </div>
          )}
        </div>

        {/* Content */}
        <div tw="pt-3">
          <h3
            tw="text-[18px] lg:text-[18px] font-semibold text-neutralBlack mb-1 leading-[1.4] min-h-[2.8em]"
            css={[lineClamp2]}>
            {title}
          </h3>

          <p
            tw="text-[15px] lg:text-[14px] text-neutral70 mb-4 leading-[1.5] min-h-[3em]"
            css={[lineClamp2]}>
            {summary}
          </p>

          {/* Category + ProductPage + Date + ViewCount */}
          <div tw="flex items-center gap-2">
            {productCategory && (
              <span
                tw="text-[13px] lg:text-[11px] px-[6px] py-[1px] rounded-sm font-medium"
                css={[{ color: "#DA7F67", backgroundColor: "rgba(218, 127, 103, 0.1)" }]}>
                {productCategory.name}
              </span>
            )}
            {post.productPage && (
              <span tw="text-[13px] lg:text-[11px] font-medium" css={[{ color: "#AB6655" }]}>
                {post.productPage}
              </span>
            )}
            <span tw="text-[14px] lg:text-[12px] text-neutral50">{displayDate}</span>
            {post.viewCount != null && (
              <span tw="text-[13px] lg:text-[11px] text-neutral50 ml-auto flex items-center gap-[3px]">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {displayViewCount(post).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </CustomLink>
  )
}

export default BlogCard
