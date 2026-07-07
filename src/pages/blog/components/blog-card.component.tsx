import React from "react"
import CustomLink from "@/lib/components/custom-link.component"
import { css } from "twin.macro"
import { BlogV2Post, resolveBlogAsset } from "../blog-v2.api"

interface BlogCardProps {
  post: BlogV2Post
}

const lineClamp2 = css`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const BlogCard = ({ post }: BlogCardProps) => {
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

          {/* 날짜만 노출 (대분류·상세페이지 표시는 제거) */}
          <div tw="flex justify-end">
            <span tw="text-[14px] lg:text-[12px] text-neutral50 whitespace-nowrap">{displayDate}</span>
          </div>
        </div>
      </div>
    </CustomLink>
  )
}

export default BlogCard
