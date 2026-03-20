import React, { useMemo, useEffect, useState, useCallback, useRef } from "react"
import DOMPurify from "dompurify"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"
import useResponsive from "@/lib/hooks/use-responsive"
import useLanguageValue from "@/lib/hooks/use-language-key"
import { useTranslation } from "react-i18next"
import { useParams, useNavigate } from "react-router-dom"
import { useAdminAuth } from "@/lib/hooks/use-admin-auth"
import { useBlogDetail, useBlogDelete } from "./use-blog"
import BlogSeo from "./components/blog-seo.component"
import CustomLink from "@/lib/components/custom-link.component"
import tw, { css } from "twin.macro"
import avatarImg from "@/assets/images/avatar.png"

interface TocItem {
  id: string
  text: string
  level: number
}

function preprocessContent(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  // AC-2: h1 → h2 변환
  doc.querySelectorAll("h1").forEach((h1) => {
    const h2 = document.createElement("h2")
    h2.innerHTML = h1.innerHTML
    Array.from(h1.attributes).forEach((attr) => h2.setAttribute(attr.name, attr.value))
    h1.replaceWith(h2)
  })

  // AC-1: id 없는 h2/h3에 텍스트 기반 id 자동 부여
  const counter: Record<string, number> = {}
  doc.querySelectorAll("h2, h3").forEach((h) => {
    if (h.id) return
    const base = (h.textContent ?? "")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^\wㄱ-ㅎ가-힣ぁ-んァ-ン一-龯]/g, "")
    if (!base) return
    const el = h as HTMLElement
    if (!counter[base]) {
      counter[base] = 1
      el.id = base
    } else {
      counter[base] += 1
      el.id = `${base}-${counter[base]}`
    }
  })

  return doc.body.innerHTML
}

const BlogDetail = () => {
  const { t, i18n } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { isDesktop } = useResponsive()
  const tv = useLanguageValue()
  const lang = i18n.language

  const { isAdmin } = useAdminAuth()
  const deleteMutation = useBlogDelete()

  const { data, isLoading } = useBlogDetail(slug ?? "", lang)
  const post = data?.data

  const title = post ? tv(post, "title") : ""
  const summary = post ? tv(post, "summary") : ""
  const content = post ? tv(post, "content") : ""
  const processedContent = useMemo(() => preprocessContent(content), [content])
  const sanitizedContent = useMemo(() => DOMPurify.sanitize(processedContent), [processedContent])

  // Extract TOC from h2/h3 headings with id attributes
  const tocItems = useMemo<TocItem[]>(() => {
    if (!sanitizedContent) return []
    const parser = new DOMParser()
    const doc = parser.parseFromString(sanitizedContent, "text/html")
    const headings = doc.querySelectorAll("h2[id], h3[id]")
    const items: TocItem[] = []
    headings.forEach((h) => {
      items.push({
        id: h.getAttribute("id") ?? "",
        text: h.textContent ?? "",
        level: h.tagName === "H2" ? 2 : 3,
      })
    })
    return items
  }, [sanitizedContent])

  const [activeId, setActiveId] = useState("")
  const isScrollingRef = useRef(false)
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const HEADER_OFFSET = 150

  const handleTocClick = useCallback((id: string) => {
    setActiveId(id)
    isScrollingRef.current = true
    clearTimeout(scrollTimerRef.current)

    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
      window.scrollTo({ top: y, behavior: "smooth" })
    }

    // smooth scroll은 보통 600~800ms — 그 동안 Observer 무시
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false
    }, 800)
  }, [])

  useEffect(() => {
    if (tocItems.length === 0) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-150px 0px -60% 0px", threshold: 0 },
    )
    tocItems.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [tocItems])

  useEffect(() => {
    return () => clearTimeout(scrollTimerRef.current)
  }, [])

  const handleDelete = async () => {
    // eslint-disable-next-line no-alert
    if (!post || !window.confirm(t("blog.deleteConfirm"))) return
    try {
      await deleteMutation.mutateAsync(post.id)
      navigate(`/${lang}/blog`)
    } catch {
      // API error — 401 if not admin
    }
  }

  if (isLoading) {
    return (
      <Page hiddenFooter={false} bottomCartExists={false} hideOnScroll>
        <div tw="min-h-screen flex items-center justify-center">
          <div tw="text-neutral50 text-[16px]">...</div>
        </div>
      </Page>
    )
  }

  if (!post) {
    return (
      <Page hiddenFooter={false} bottomCartExists={false} hideOnScroll>
        <div tw="min-h-screen flex flex-col items-center justify-center gap-4 font-pretendard">
          <div tw="text-[18px] text-neutral70">{t("blog.noPosts")}</div>
          <CustomLink
            to="/blog"
            tw="px-4 py-2 border text-[14px] font-medium transition-colors duration-200"
            css={[{ color: "#DA7F67", borderColor: "#DA7F67" }]}>
            {t("blog.backToList")}
          </CustomLink>
        </div>
      </Page>
    )
  }

  const publishedDate = new Date(post.publishedAt)
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, ".")
    .replace(/\.$/, "")

  return (
    <Page hiddenFooter={false} bottomCartExists={false} hideOnScroll>
      <BlogSeo
        post={post}
        title={title}
        summary={summary}
        lang={lang}
        slug={slug ?? ""}
        sanitizedContent={sanitizedContent}
        tocItems={tocItems}
      />

      <div tw="bg-white min-h-screen font-pretendard tracking-tight leading-[150%]">
        <AppMaxWidth>
          <div tw="pt-6 lg:pt-10" />
          {/* Layout: TOC sidebar + Article */}
          <div
            css={[
              isDesktop ? tw`flex gap-10` : undefined,
              isDesktop &&
                css`
                  overflow: clip;
                `,
            ]}>
            {/* TOC Sidebar - Desktop only */}
            {isDesktop && (
              <aside
                css={[
                  css`
                    width: 300px;
                    flex-shrink: 0;
                    position: sticky;
                    top: 190px;
                    align-self: flex-start;
                    overflow-y: auto;
                    max-height: calc(100vh - 170px);
                    padding-bottom: 4em;
                  `,
                ]}>
                {tocItems.length > 0 && (
                  <nav>
                    <div
                      tw="text-[15px] font-semibold text-neutralBlack mb-3 pb-2 border-b"
                      css={[{ borderColor: "#DA7F67" }]}>
                      {t("blog.toc") || "목차"}
                    </div>
                    <ul tw="list-none p-0 m-0">
                      {tocItems.map((item) => (
                        <li key={item.id} css={[item.level === 3 && tw`pl-3`]}>
                          <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                              e.preventDefault()
                              handleTocClick(item.id)
                            }}
                            tw="block py-[5px] text-[14px] leading-[1.5] transition-colors duration-200 no-underline"
                            css={[
                              activeId === item.id
                                ? { color: "#DA7F67", fontWeight: 600 }
                                : tw`text-neutral50 hover:text-neutralBlack`,
                            ]}>
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
                <CustomLink
                  to={
                    post.categories.find((cat) => cat.eventCategoryId)
                      ? `/${lang}/events?category=${post.categories.find((cat) => cat.eventCategoryId)?.eventCategoryId}`
                      : `/${lang}/events`
                  }
                  tw="block w-full text-center mt-4 text-[13px] px-5 py-[7px] bg-primary text-white font-medium transition hover:bg-[#AB6655]">
                  {t("blog.viewEvents")}
                </CustomLink>
              </aside>
            )}

            {/* Article */}
            <article css={[isDesktop ? tw`max-w-[800px] flex-1 min-w-0` : tw`px-0`]}>
              {/* Title */}
              <h1
                tw="font-semibold text-neutralBlack leading-[1.3]"
                css={[{ fontSize: "2.5em", marginBottom: "1.5rem" }]}>
                {title}
              </h1>

              {/* Summary lead - right below title */}
              {summary && (
                <p
                  tw="text-[17px] lg:text-[19px] text-neutral70 leading-[1.8] font-pretendard"
                  css={[{ marginBottom: "2.5rem" }]}>
                  {summary}
                </p>
              )}

              {/* Meta: categories | date */}
              <div tw="flex items-center gap-3 text-[13px] lg:text-[14px] text-neutral50 mb-6 lg:mb-8 pb-6 lg:pb-8 border-b border-neutral30">
                {post.categories.map((cat) => (
                  <span key={cat.id} css={[{ color: "rgb(218, 127, 103)" }]}>
                    {tv(cat, "name")}
                  </span>
                ))}
                {post.categories.length > 0 && <span>|</span>}
                <span>{publishedDate}</span>
              </div>

              {/* Admin Actions */}
              {isAdmin && (
                <div tw="flex gap-2 mb-6">
                  <button
                    onClick={() => navigate(`/${lang}/blog/edit/${post.slug}`)}
                    tw="px-4 py-2 text-[13px] border font-medium transition-colors duration-200"
                    css={[
                      { color: "#DA7F67", borderColor: "#DA7F67" },
                      tw`hover:bg-[#DA7F67] hover:text-white`,
                    ]}>
                    {t("blog.editPost")}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isLoading}
                    tw="px-4 py-2 text-[13px] border border-red-400 text-red-500 font-medium transition-colors duration-200 hover:bg-red-500 hover:text-white disabled:opacity-50">
                    {t("blog.deletePost")}
                  </button>
                </div>
              )}

              {/* Thumbnail */}
              {post.thumbnailUrl && (
                <div tw="mb-8 lg:mb-10">
                  <img
                    src={post.thumbnailUrl}
                    alt={title}
                    tw="w-full max-h-[500px] object-cover rounded-sm"
                  />
                </div>
              )}

              {/* Mobile TOC + Event Button */}
              {!isDesktop && (
                <div tw="mb-6">
                  {tocItems.length > 0 && (
                    <nav tw="p-4 border border-neutral30" css={[{ backgroundColor: "#fafafa" }]}>
                      <div
                        tw="text-[14px] font-semibold text-neutralBlack mb-2 pb-2 border-b"
                        css={[{ borderColor: "#DA7F67" }]}>
                        {t("blog.toc") || "목차"}
                      </div>
                      <ul tw="list-none p-0 m-0">
                        {tocItems.map((item) => (
                          <li key={item.id} css={[item.level === 3 && tw`pl-3`]}>
                            <a
                              href={`#${item.id}`}
                              tw="block py-[4px] text-[13px] leading-[1.5] no-underline"
                              css={[{ color: "#555" }]}>
                              {item.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
                  <CustomLink
                    to={
                      post.categories.find((cat) => cat.eventCategoryId)
                        ? `/${lang}/events?category=${post.categories.find((cat) => cat.eventCategoryId)?.eventCategoryId}`
                        : `/${lang}/events`
                    }
                    tw="block w-full text-center mt-3 text-[13px] px-5 py-[10px] bg-primary text-white font-medium transition hover:bg-[#AB6655]">
                    {t("blog.viewEvents")}
                  </CustomLink>
                </div>
              )}

              {/* Content */}
              <div
                tw="max-w-none mb-10 lg:mb-16 text-[15px] lg:text-[16px] leading-[1.8] text-neutralBlack"
                css={[
                  css`
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
                      font-size: 1.7em;
                    }
                    h3 {
                      font-size: 1.15em;
                    }
                    p {
                      margin-bottom: 1em;
                    }
                    ul,
                    ol {
                      padding-left: 1.5em;
                      margin-bottom: 1em;
                    }
                    li {
                      margin-bottom: 0.25em;
                    }
                    blockquote {
                      border-left: 3px solid #da7f67;
                      padding-left: 1em;
                      margin: 1em 0;
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
                    }
                  `,
                ]}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            </article>
          </div>

          {/* Author Profile Card */}
          <div className="profile-meta" tw="pt-8 mt-10 mb-10 border-t border-neutral30">
            <div
              tw="flex items-center gap-6 py-5 px-6 rounded-sm"
              css={[{ backgroundColor: "#fafafa", border: "1px solid #f0f0f0" }]}>
              {/* Avatar */}
              <img
                src={avatarImg}
                alt={post.author}
                tw="w-[72px] h-[72px] rounded-full object-cover flex-shrink-0"
              />
              {/* Divider */}
              <div tw="w-px self-stretch bg-neutral30 flex-shrink-0" />
              {/* Info */}
              <div tw="flex flex-col gap-[3px]">
                <p tw="text-[15px] font-semibold text-neutralBlack leading-[1.3]">{post.author}</p>
                <p tw="text-[13px] text-neutral50 leading-[1.3]">
                  {t("blog.profileTitle")} · {t("blog.profileClinic")}
                </p>
                <p tw="text-[13px] text-neutral50 mt-[6px]">
                  {t("blog.profileTel") || "1661-2365"}
                </p>
                <div tw="flex items-center gap-3 text-[13px] text-neutral50">
                  <span>pecheskin.clinic</span>
                  <span css={[{ color: "#C4C4C4" }]}>|</span>
                  <CustomLink
                    to={`/${lang}/reservation`}
                    tw="font-medium transition-colors duration-200"
                    css={[{ color: "#DA7F67" }]}>
                    {t("blog.profileMore")}
                  </CustomLink>
                </div>
              </div>
            </div>
          </div>

          {/* Back to list */}
          <div tw="flex justify-center mb-16 lg:mb-20">
            <button
              onClick={() => navigate(`/${lang}/blog`)}
              tw="
              px-6 py-3 text-[14px] lg:text-[15px]
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
              {t("blog.backToList")}
            </button>
          </div>
        </AppMaxWidth>
      </div>
    </Page>
  )
}

export default BlogDetail
