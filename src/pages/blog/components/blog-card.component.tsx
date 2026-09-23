import React from "react"
import CustomLink from "@/lib/components/custom-link.component"
import { css } from "twin.macro"
import { BlogV2Post, resolveBlogAsset } from "../blog-v2.api"

interface BlogCardProps {
  post: BlogV2Post
  /** 검색어 — 제목·부제목에서 일치 부분에 배경 하이라이트 */
  highlight?: string
}

const lineClamp2 = css`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

// 검색어 하이라이트 — 코랄 톤 반투명 배경
const markStyle = css`
  background: rgba(218, 127, 103, 0.26);
  color: inherit;
  border-radius: 2px;
  padding: 0 1px;
`

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/** text에서 term과 일치하는 부분(대소문자 무시)을 <mark>로 감싼다. term 없으면 원문 그대로. */
const highlightText = (text: string, term?: string): React.ReactNode => {
  const t = term?.trim()
  if (!t || !text) return text
  const parts = text.split(new RegExp(`(${escapeRegExp(t)})`, "gi"))
  const lower = t.toLowerCase()
  return parts.map((part, i) =>
    part.toLowerCase() === lower ? (
      <mark key={i} css={markStyle}>
        {part}
      </mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  )
}

const BlogCard = ({ post, highlight }: BlogCardProps) => {
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
      {/* 최상위 overflow-hidden 제거 — 오른쪽 끝에 붙는 날짜 글자가 열별 소수점 폭에서 잘리던 문제. 썸네일은 자체 overflow-hidden 유지 */}
      <div tw="bg-white font-pretendard tracking-tight">
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
            {highlightText(title, highlight)}
          </h3>

          <p
            tw="text-[15px] lg:text-[14px] text-neutral70 mb-4 leading-[1.5] min-h-[3em]"
            css={[lineClamp2]}>
            {highlightText(summary, highlight)}
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
