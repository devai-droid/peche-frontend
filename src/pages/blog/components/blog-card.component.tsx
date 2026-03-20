import React from "react"
import { BlogPost } from "../blog.types"
import useLanguageValue from "@/lib/hooks/use-language-key"
import CustomLink from "@/lib/components/custom-link.component"
import { css } from "twin.macro"

interface BlogCardProps {
  post: BlogPost
}

const lineClamp2 = css`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const lineClamp1 = css`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const BlogCard = ({ post }: BlogCardProps) => {
  const tv = useLanguageValue()

  const title = tv(post, "title")
  const summary = tv(post, "summary")
  const publishedDate = new Date(post.publishedAt)
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, ".")
    .replace(/\.$/, "")

  return (
    <CustomLink to={`/blog/${post.slug}`} tw="block" className="group">
      <div tw="bg-white overflow-hidden font-pretendard tracking-tight">
        {/* Thumbnail */}
        <div tw="w-full aspect-[4/3] overflow-hidden bg-neutral30">
          {post.thumbnailUrl ? (
            <img
              src={post.thumbnailUrl}
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
          {/* Title */}
          <h3
            tw="text-[16px] lg:text-[18px] font-semibold text-neutralBlack mb-1 leading-[1.4]"
            css={[lineClamp2]}>
            {title}
          </h3>

          {/* Summary */}
          <p tw="text-[13px] lg:text-[14px] text-neutral70 mb-2 leading-[1.5]" css={[lineClamp2]}>
            {summary}
          </p>

          {/* Categories + Date + ViewCount */}
          <div tw="flex items-center gap-2">
            {post.categories.map((cat) => (
              <span
                key={cat.id}
                tw="text-[11px] px-[6px] py-[1px] rounded-sm font-medium"
                css={[{ color: "#DA7F67", backgroundColor: "rgba(218, 127, 103, 0.1)" }]}>
                {tv(cat, "name")}
              </span>
            ))}
            <span tw="text-[12px] text-neutral50">{publishedDate}</span>
            {post.viewCount != null && (
              <span tw="text-[11px] text-neutral50 ml-auto flex items-center gap-[3px]">
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
                {post.viewCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </CustomLink>
  )
}

export default BlogCard
