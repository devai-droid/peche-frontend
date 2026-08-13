import React from "react"
import tw, { css } from "twin.macro"
import { useQuery } from "@tanstack/react-query"
import { blogV2PublicApi, resolveBlogAsset } from "@/pages/blog/blog-v2.api"
import CustomLink from "@/lib/components/custom-link.component"
import avatarImg from "@/assets/images/avatar.png"

/**
 * 시술 상세페이지 본문 렌더 — 블로그 상세(blog-detail)와 동일한 본문 타이포그래피를 적용한다.
 * detail_page 글의 bodyHtml을 받아, 대표 이미지 자리에 블로그 스타일로 그린다.
 * (h2 1.7em+2px · h3 1.15em · ul/ol disc·코랄 마커 · 표 · 인용구 · 이미지+캡션)
 */

// 블로그 본문 CSS와 동일 규칙
const articleCss = css`
  font-size: 16px;
  color: #1a1a1a;
  line-height: 1.7;
  word-break: keep-all;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    line-height: 1.3;
  }
  h1 {
    font-size: 1.5em;
  }
  h2 {
    font-size: calc(1.7em + 2px);
    margin-top: 3.4em;
    margin-bottom: 1em;
  }
  @media (min-width: 1024px) {
    h2 {
      margin-top: 4.4em;
    }
  }
  h2:first-of-type {
    margin-top: 0.4em;
  }
  h3 {
    font-size: 1.15em;
    margin-top: 2.4em;
    margin-bottom: 0.8em;
  }
  p {
    margin-bottom: 1em;
  }
  strong {
    font-weight: 700;
  }
  ul {
    list-style: disc outside;
    padding-left: 1.4em;
    margin: 0.4em 0 1.2em;
  }
  ol {
    list-style: decimal outside;
    padding-left: 1.5em;
    margin: 0.4em 0 1.2em;
  }
  li {
    margin-bottom: 0.4em;
    padding-left: 0.2em;
  }
  li::marker {
    color: #da7f67;
  }
  blockquote {
    border-left: 3px solid #da7f67;
    padding-left: 1em;
    margin: 1.4em 0;
    color: #666;
  }
  a {
    color: #da7f67;
    text-decoration: underline;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 2px;
    display: block;
    margin: 2em auto 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5em 0 2.6em;
    font-size: 0.95em;
    overflow-x: auto;
    display: block;
  }
  @media (min-width: 640px) {
    table {
      display: table;
    }
  }
  th,
  td {
    border: 1px solid #e5e0dc;
    padding: 0.6em 0.85em;
    text-align: left;
    vertical-align: top;
  }
  thead th {
    background: #faf3ef;
    font-weight: 600;
  }
  /* 이미지 캡션(▲로 시작하는 단락) — 블로그와 동일 */
  .blog-caption {
    text-align: center;
    margin-bottom: 2.6em;
  }
  .blog-caption em {
    display: block;
    margin-top: 0.9em;
    line-height: 1.45;
    color: #999;
    font-size: 0.875em;
    font-style: normal;
  }
  hr {
    display: none;
  }
  /* CTA 버튼 — 한 문단에 링크만 단독으로 있으면 버튼으로 렌더. 홈 '카카오톡 상담하기'(bg-primary·풀폭) 형식과 동일 */
  .cta-button {
    margin: 0.9em 0;
  }
  .cta-button a {
    display: block;
    width: 100%;
    background: #da7f67;
    color: #fff;
    text-align: center;
    text-decoration: none;
    font-weight: 500;
    padding: 14px 20px;
    font-size: 15px;
    border-radius: 2px;
    transition: background 0.2s;
  }
  .cta-button a:hover {
    background: #ab6655;
  }
`

function preprocess(html: string): string {
  if (typeof window === "undefined") return html
  const doc = new DOMParser().parseFromString(html, "text/html")
  // h1 → h2 (블로그 규칙: 본문 최상위 제목은 h2)
  doc.querySelectorAll("h1").forEach((h1) => {
    const h2 = doc.createElement("h2")
    h2.innerHTML = h1.innerHTML
    h1.replaceWith(h2)
  })
  // 가로선 제거
  doc.querySelectorAll("hr").forEach((hr) => hr.remove())
  // 외부 링크는 새 창
  doc.querySelectorAll("a[href^='http']").forEach((a) => {
    a.setAttribute("target", "_blank")
    a.setAttribute("rel", "noopener noreferrer")
  })
  // 이미지 캡션(▲) 단락 마킹
  doc.querySelectorAll("p").forEach((p) => {
    if ((p.textContent ?? "").trim().startsWith("▲")) p.classList.add("blog-caption")
  })
  // CTA 버튼: 한 문단에 링크만 단독으로 있으면(문구 없이 [라벨](URL)) 버튼으로 렌더
  doc.querySelectorAll("p").forEach((p) => {
    const kids = Array.from(p.childNodes).filter(
      (n) => !(n.nodeType === 3 && !(n.textContent ?? "").trim()),
    )
    if (kids.length === 1 && (kids[0] as HTMLElement).tagName === "A") {
      p.classList.add("cta-button")
    }
  })
  return doc.body.innerHTML
}

interface Props {
  html?: string
  lang: string
}

const DetailPageArticle = ({ html, lang }: Props) => {
  const processed = React.useMemo(() => (html ? preprocess(html) : ""), [html])
  // 작성/감수 의료진 카드 — 블로그와 동일하게 어드민 '의료진 정보'의 대표 의료진 사용
  const { data: doctor } = useQuery({
    queryKey: ["detail-rep-doctor", lang],
    queryFn: () => blogV2PublicApi.representativeDoctor(lang),
    staleTime: 1000 * 60 * 10,
  })
  if (!processed) return null
  const authorName = doctor?.name ?? "안태언"
  return (
    <div tw="bg-white mt-10 px-5 py-8 md:px-9 md:py-10 rounded-lg font-pretendard tracking-tight">
      <article css={articleCss} dangerouslySetInnerHTML={{ __html: processed }} />

      {/* 작성/감수 의료진 카드 — 블로그 하단 카드와 동일 */}
      <div css={[{ marginTop: "4em" }]}>
        <div
          tw="flex flex-col lg:flex-row items-stretch rounded-sm overflow-hidden"
          css={[{ backgroundColor: "#fafafa", border: "1px solid #f0f0f0" }]}>
          <div
            role="img"
            aria-label={authorName}
            tw="w-full aspect-square lg:w-[200px] lg:aspect-auto lg:self-stretch bg-center bg-cover bg-no-repeat flex-shrink-0"
            css={[
              {
                backgroundImage: `url("${resolveBlogAsset(doctor?.photoUrl) || avatarImg}")`,
                backgroundPosition: "center top",
              },
            ]}
          />
          <div tw="flex flex-col justify-center gap-[3px] py-5 px-6 flex-1 min-w-0">
            <p tw="text-[19px] font-semibold text-neutralBlack leading-[1.3]">
              {authorName}
              {doctor?.jobTitle ? ` ${doctor.jobTitle}` : ""}
            </p>
            {doctor?.bio && (
              <p tw="text-[15px] text-neutral50 mt-[6px] leading-[1.6]">{doctor.bio}</p>
            )}
            <div tw="flex items-center gap-3 text-[15px] text-neutral50 mt-[6px]">
              <CustomLink
                to={doctor?.profileUrl || "/doctor"}
                tw="font-medium transition-colors duration-200"
                css={[{ color: "#DA7F67" }]}>
                의료진 소개 보기
              </CustomLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailPageArticle
