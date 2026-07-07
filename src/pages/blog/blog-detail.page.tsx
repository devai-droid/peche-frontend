import React, { useMemo, useEffect, useState, useCallback, useRef } from "react"
import DOMPurify from "dompurify"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"
import useResponsive from "@/lib/hooks/use-responsive"
import { useScrollTrigger } from "@mui/material"
import useLanguageValue from "@/lib/hooks/use-language-key"
import { useTranslation } from "react-i18next"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useProductDetailPageControllerFindMany } from "@/lib/orval/product-detail-pages/product-detail-pages"
import { ProductDetailPageControllerFindManyStatus } from "@/lib/orval/model"
import { blogV2PublicApi, resolveBlogAsset, rewriteBlogHtml } from "./blog-v2.api"
import BlogSeo from "./components/blog-seo.component"
import BlogPriceSection, { PriceDetailPageRef } from "./components/blog-price-section.component"
import CustomLink from "@/lib/components/custom-link.component"
import { BottomButtons } from "@/features/product/components/cart-view.component"
import tw, { css } from "twin.macro"
import avatarImg from "@/assets/images/avatar.png"

interface TocItem {
  id: string
  text: string
  level: number
}

function preprocessContent(html: string, lang: string): string {
  const parser = new DOMParser()
  // 인용 출처: 괄호 안 내부 링크(PMID 등)를 괄호 전체 링크로 전환하고 PMID 텍스트는 제거
  const withCitations = html.replace(/\(([^()]*(?:PMID|et\s+al\.)[^()]*)\)/g, (whole, inner) => {
    const linkMatch = inner.match(/<a\s+href="([^"]+)"[^>]*>[\s\S]*?<\/a>/i)
    if (!linkMatch) return whole
    const href = linkMatch[1]
    const cleaned = inner
      .replace(/\s*[—–-]?\s*<a\s+[^>]*>[\s\S]*?<\/a>/gi, "")
      .replace(/\s*[—–-]?\s*PMID\s*\d+/gi, "")
      .replace(/[\s,—–-]+$/, "")
      .trim()
    return `<a href="${href}" class="blog-citation" target="_blank" rel="noopener noreferrer">(${cleaned})</a>`
  })
  const doc = parser.parseFromString(withCitations, "text/html")

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

  // 이미지 캡션(▲로 시작하는 단락)에 클래스 부여 — 본문 검은색과 분리해 회색 처리
  doc.querySelectorAll("p").forEach((p) => {
    if ((p.textContent ?? "").trim().startsWith("▲")) p.classList.add("blog-caption")
  })

  // 괄호 전체가 링크인 인용(마크다운 인용 링크)에 인용 스타일 + 남은 PMID 텍스트 제거
  doc.querySelectorAll("a").forEach((anchor) => {
    const el = anchor as HTMLAnchorElement
    const txt = (el.textContent ?? "").trim()
    if (/^\(.*\)$/.test(txt) && /(et al\.|PMID|(?:19|20)\d{2})/.test(txt)) {
      el.classList.add("blog-citation")
      el.setAttribute("target", "_blank")
      el.setAttribute("rel", "noopener noreferrer")
      const stripped = txt.replace(/\s*[—–-]?\s*PMID\s*\d+/gi, "").replace(/\s*[—–-]+\s*\)$/, ")")
      if (stripped !== txt) el.textContent = stripped
    }
  })

  // 본문 내부 링크(우리 다른 글 slug 링크)를 블로그 URL로 보정 + 관련 글 수집용 마킹.
  // 인용(.blog-citation)·페이지 내 앵커(#id)는 제외. 외부(http) 링크는 출처/인용으로 보고 회색 이태릭 처리.
  doc.querySelectorAll("a").forEach((anchor) => {
    const el = anchor as HTMLAnchorElement
    if (el.classList.contains("blog-citation")) return
    const href = el.getAttribute("href") ?? ""
    // 외부 링크 = 출처/인용 → 붉은 링크가 아니라 회색 이태릭(.blog-citation)
    if (/^https?:\/\//i.test(href)) {
      el.classList.add("blog-citation")
      el.setAttribute("target", "_blank")
      el.setAttribute("rel", "noopener noreferrer")
      return
    }
    if (/^(mailto|tel):/i.test(href)) return
    if (href.length > 1 && href.startsWith("#")) return // 페이지 내 앵커(#id)는 관련 글 아님
    // slug: 실제 slug 링크면 그대로 사용. 빈/'#' placeholder면 앵커 텍스트로 생성
    // (실제 글은 본문에 진짜 slug가 있으므로 생성 분기는 거의 안 탐 — placeholder 대비용)
    let slug = href.replace(/^[#/]/, "").replace(/^blog\//, "")
    if (!slug) {
      slug = (el.textContent ?? "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\wㄱ-ㅎ가-힣-]/g, "")
    }
    if (!slug) return
    el.setAttribute("href", `/${lang}/blog/${slug}`)
    el.setAttribute("data-slug", slug)
    el.classList.add("blog-related-link")
    // 본문 인라인 내부 링크는 새 창에서 — 원본 글 읽기 흐름 보존
    el.setAttribute("target", "_blank")
    el.setAttribute("rel", "noopener noreferrer")
  })

  // FAQ: 한 단락에 붙은 Q(strong)와 A를 줄 분리
  const faqHeading = Array.from(doc.querySelectorAll("h2, h3")).find((h) =>
    /FAQ|자주\s*묻는/i.test(h.textContent ?? ""),
  )
  if (faqHeading) {
    let node = faqHeading.nextElementSibling
    while (node && node.tagName !== "H2") {
      if (node.tagName === "P") {
        const strong = node.querySelector("strong")
        if (strong && strong === node.firstChild && strong.nextSibling) {
          const after = strong.nextSibling
          if (after.nodeType === Node.TEXT_NODE) {
            after.textContent = (after.textContent ?? "").replace(/^\s+/, "")
          }
          node.insertBefore(document.createElement("br"), after)
          ;(strong as HTMLElement).classList.add("faq-q")
        }
      }
      node = node.nextElementSibling
    }
  }

  // 가로선 사용 안 함 — 모든 <hr> 제거
  doc.body.querySelectorAll("hr").forEach((hr) => hr.remove())

  // 끝부분 의학 고지(전체가 <em>인 단락들)를 한 섹션으로 묶어 본문과 분리
  const isFullEm = (el: Element | null): el is HTMLElement =>
    !!el &&
    el.tagName === "P" &&
    el.children.length === 1 &&
    el.children[0].tagName === "EM" &&
    !(el.textContent ?? "").trim().startsWith("▲")
  const trailing: HTMLElement[] = []
  let tail = doc.body.lastElementChild
  while (isFullEm(tail)) {
    trailing.unshift(tail)
    tail = tail.previousElementSibling
  }
  if (trailing.length > 0) {
    const wrap = document.createElement("div")
    wrap.className = "blog-disclaimer"
    trailing[0].parentNode?.insertBefore(wrap, trailing[0])
    trailing.forEach((p) => wrap.appendChild(p))
  }

  return doc.body.innerHTML
}

const BlogDetail = () => {
  const { t, i18n } = useTranslation()
  // 일반: /:lang/blog/:slug, 미리보기(어드민 iframe): /:lang/blog/preview/:id (초안 포함, noindex)
  const { slug, id: previewId } = useParams<{ slug?: string; id?: string }>()
  const isPreview = !!previewId
  const [searchParams] = useSearchParams()
  // 미리보기에서 어드민이 체크박스로 넘긴 고지문구(저장 전에도 라이브 반영). 없으면 글에 저장된 값 사용.
  const noticesParam = searchParams.get("notices")
  const navigate = useNavigate()
  const { isDesktop } = useResponsive()
  // 헤더는 hideOnScroll(스크롤 내리면 숨고 올리면 나타남). 목차 sticky top을 헤더 표시 여부에 맞춰 동적 조정.
  // 헤더 실제 높이는 #header-height 요소를 런타임 측정(로고바+서브내비 = 대략 135px). 숨을 땐 위(24px)로.
  const headerVisible = !useScrollTrigger()
  const [headerH, setHeaderH] = useState(135)
  useEffect(() => {
    const measure = () => {
      const el = document.getElementById("header-height")
      if (el) setHeaderH(Math.round(el.getBoundingClientRect().height))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])
  const tocTop = headerVisible ? headerH + 8 : 24
  const tv = useLanguageValue()
  const lang = i18n.language

  // 글 상세: v2 공개 API (발행 글만) / 미리보기는 id로 초안까지 조회
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-v2-detail", lang, slug, previewId],
    queryFn: () =>
      isPreview ? blogV2PublicApi.preview(previewId as string) : blogV2PublicApi.detail(lang, slug ?? ""),
    enabled: isPreview ? !!previewId : !!slug,
    retry: false,
  })

  // 대표 의료진(어드민 '의료진 정보'에서 관리) — 모든 글 하단 의료진 카드 공통 소스.
  // 어드민에서 수정하면 짧은 캐시 후 전체 글에 자동 반영.
  const { data: representativeDoctor } = useQuery({
    queryKey: ["blog-v2-representative-doctor", post?.lang ?? lang],
    queryFn: () => blogV2PublicApi.representativeDoctor(post?.lang ?? lang),
    enabled: !!post,
    staleTime: 1000 * 30,
  })

  // 공통 고지문구(어드민 '의료 고지 문구' 관리) — 글 하단 결합. 일반 면책=항상, 나머지=글별 선택(post.notices)
  const { data: commonTexts } = useQuery({
    queryKey: ["blog-v2-common-texts", post?.lang ?? lang],
    queryFn: () => blogV2PublicApi.commonTexts(post?.lang ?? lang),
    enabled: !!post,
    staleTime: 1000 * 60,
  })
  const disclaimers = useMemo<string[]>(() => {
    if (!commonTexts) return []
    const byType = new Map(
      commonTexts.filter((t) => t.isActive && t.body).map((t) => [t.type, t.body as string]),
    )
    const out: string[] = []
    const general = byType.get("general_disclaimer")
    if (general) out.push(general)
    const selected =
      isPreview && noticesParam !== null
        ? noticesParam.split(",").filter(Boolean)
        : post?.notices ?? []
    for (const t of selected) {
      const b = byType.get(t)
      if (b) out.push(b)
    }
    return out
  }, [commonTexts, post?.notices, isPreview, noticesParam])

  // CTA 대상 해석용 — 상세페이지 목록(이름→id 매칭)
  const { data: detailPagesData } = useProductDetailPageControllerFindMany({
    status: ProductDetailPageControllerFindManyStatus.ACTIVE,
    limit: 100,
  })

  // 가격 섹션용 — product_page(콤마 여러 개) 이름 → 상세페이지(id,name) 매칭. 중복 상세페이지는 1회만.
  const priceDetailPages = useMemo<PriceDetailPageRef[]>(() => {
    const names = (post?.productPage ?? "").split(",").map((s) => s.trim()).filter(Boolean)
    const items = detailPagesData?.items ?? []
    const seen = new Set<string>()
    const out: PriceDetailPageRef[] = []
    for (const nm of names) {
      const dp = items.find((p) => (tv(p, "name") ?? "").trim() === nm)
      if (dp?.id && !seen.has(dp.id)) {
        seen.add(dp.id)
        out.push({ id: dp.id, name: tv(dp, "name") })
      }
    }
    return out
  }, [post?.productPage, detailPagesData, tv])

  const title = post?.title ?? ""
  const subtitle = post?.subtitle ?? ""
  const summary = post?.summaryText ?? ""
  // 주제 키워드("관련글 더보기" 헤딩) — frontmatter topic_keyword 원본 우선, 마스터 매칭값 폴백
  const topicKeyword = post?.topicKeyword || post?.keyword?.keyword || ""
  const content = rewriteBlogHtml(post?.bodyHtml)
  // 의료진 카드: 글의 author_doctor 우선, 없으면 대표 의료진(공통)으로 채움
  // 카드는 어드민에서 관리하는 대표 의료진을 우선 사용 → 한 곳 수정으로 모든 글에 반영
  const cardDoctor = representativeDoctor ?? post?.authorDoctor ?? undefined
  const authorName = cardDoctor?.name ?? "안태언"
  const processedContent = useMemo(() => preprocessContent(content, lang), [content, lang])
  // ADD_ATTR: ['target'] — DOMPurify 3.x가 기본적으로 a 태그의 target 속성을 제거하므로
  // 내부·외부 링크의 새 창 열기(target="_blank")가 살아남도록 명시적으로 허용.
  const sanitizedContent = useMemo(
    () => DOMPurify.sanitize(processedContent, { ADD_ATTR: ["target"] }),
    [processedContent],
  )

  // 관련 글 = 본문 내부 링크 자동 수집 (인용·외부·# 제외, slug 중복 제거, 본문 등장 순서)
  const relatedPosts = useMemo<{ slug: string; anchor: string }[]>(() => {
    if (!sanitizedContent) return []
    const doc = new DOMParser().parseFromString(sanitizedContent, "text/html")
    const seen = new Set<string>()
    const out: { slug: string; anchor: string }[] = []
    doc.querySelectorAll("a.blog-related-link").forEach((a) => {
      const linkSlug = a.getAttribute("data-slug") ?? ""
      const anchor = (a.textContent ?? "").trim()
      if (!linkSlug || !anchor || seen.has(linkSlug)) return
      seen.add(linkSlug)
      out.push({ slug: linkSlug, anchor })
    })
    return out
  }, [sanitizedContent])

  // Extract TOC from h2 headings with id attributes (h3 제외 — 목차는 대제목만)
  const tocItems = useMemo<TocItem[]>(() => {
    if (!sanitizedContent) return []
    const parser = new DOMParser()
    const doc = parser.parseFromString(sanitizedContent, "text/html")
    const headings = doc.querySelectorAll("h2[id]")
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
  const [showInquiryButtons, setShowInquiryButtons] = useState(false)
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
    // 스크롤 위치 기반: 헤더 라인(HEADER_OFFSET)을 지난 마지막 제목을 활성. 최상단이면 첫 제목.
    const handler = () => {
      if (isScrollingRef.current) return
      // 활성 판정선: 화면 위쪽 1/3 지점(읽는 위치)에 맞춤 — 너무 위(헤더 근처)면 목차가 뒤로 밀려 보임
      const line = Math.max(HEADER_OFFSET + 24, Math.round(window.innerHeight / 3))
      let current = tocItems[0]?.id ?? ""
      tocItems.forEach((item) => {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= line) current = item.id
      })
      setActiveId(current)
    }
    handler()
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [tocItems])

  useEffect(() => {
    return () => clearTimeout(scrollTimerRef.current)
  }, [])

  if (isLoading) {
    return (
      <Page hiddenHeader={isPreview} hiddenFooter={isPreview} bottomCartExists={false} hideOnScroll>
        <div tw="min-h-screen flex items-center justify-center">
          <div tw="text-neutral50 text-[16px]">...</div>
        </div>
      </Page>
    )
  }

  if (!post) {
    return (
      <Page hiddenHeader={isPreview} hiddenFooter={isPreview} bottomCartExists={false} hideOnScroll>
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

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt)
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, ".")
        .replace(/\.$/, "")
    : ""

  return (
    <Page hiddenHeader={isPreview} hiddenFooter={isPreview} bottomCartExists={false} hideOnScroll>
      <BlogSeo
        post={post}
        doctor={cardDoctor}
        title={title}
        summary={summary}
        lang={lang}
        slug={isPreview ? post.slug : (slug ?? "")}
        sanitizedContent={sanitizedContent}
        tocItems={tocItems}
        noindex={isPreview}
      />

      <div tw="bg-white min-h-screen font-pretendard tracking-tight leading-[150%]">
        <AppMaxWidth>
          {/* 제목 위 여백 — 모바일은 고정 헤더(약 64px) + 여유, 데스크톱도 헤더와 간격 확보. 미리보기(헤더 없음)는 축소 */}
          <div css={[isPreview ? tw`pt-6` : tw`pt-32 lg:pt-24`]} />
          {/* Layout: Article(좌) + TOC·가격 사이드바(우) — flex-row-reverse로 사이드바를 오른쪽에 */}
          <div
            css={[
              isDesktop ? tw`flex flex-row-reverse gap-10` : undefined,
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
                    top: ${tocTop}px;
                    align-self: flex-start;
                    transition: top 0.2s ease;
                  `,
                ]}>
                {tocItems.length > 0 && (
                  <nav aria-label={t("blog.toc") || "목차"}>
                    <div
                      tw="text-[16px] font-semibold text-neutralBlack mb-3 pb-2 border-b"
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
                            tw="block py-[5px] text-[15px] leading-[1.5] transition-colors duration-200 no-underline"
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
                {/* 가격 섹션 — PC: 목차 아래 사이드바에 배치 */}
                <BlogPriceSection detailPages={priceDetailPages} />
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

              {/* Subtitle (부제목) - right below title */}
              {subtitle && (
                <p
                  tw="text-[18px] lg:text-[20px] text-neutral70 leading-[1.8] font-pretendard"
                  css={[{ marginBottom: "1.5rem" }]}>
                  {subtitle}
                </p>
              )}

              {/* 작성일 (대분류·상세페이지 표시는 제거) */}
              <div tw="flex items-center text-[14px] lg:text-[15px] text-neutral50 mb-6 lg:mb-8 pb-6 lg:pb-8 border-b border-neutral30">
                <span>{publishedDate}</span>
              </div>

              {/* 핵심 요약 (summaryText) - 구분선 아래 */}
              {summary && (
                <div
                  tw="mb-8 lg:mb-10 p-5 lg:p-6 rounded-sm"
                  css={[{ backgroundColor: "#FEF5EA", borderLeft: "3px solid #DA7F67" }]}>
                  <p tw="text-[16px] lg:text-[17px] text-neutralBlack leading-[1.8] font-pretendard m-0">
                    {summary}
                  </p>
                </div>
              )}

              {/* 썸네일은 목록 카드에서만 노출 — 상세 인트로에는 중복 노출 방지 위해 표시하지 않음 */}

              {/* Mobile TOC + Products Button */}
              {!isDesktop && (
                <div tw="mb-6">
                  {tocItems.length > 0 && (
                    <nav
                      aria-label={t("blog.toc") || "목차"}
                      tw="p-4 border border-neutral30"
                      css={[{ backgroundColor: "#fafafa" }]}>
                      <div
                        tw="text-[15px] font-semibold text-neutralBlack mb-2 pb-2 border-b"
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
                              tw="block py-[4px] text-[14px] leading-[1.5] no-underline"
                              css={[{ color: "#555" }]}>
                              {item.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
                </div>
              )}

              {/* Content */}
              <div
                tw="max-w-none text-[16px] lg:text-[17px] leading-[1.8] text-neutralBlack"
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
                      font-size: calc(1.7em + 2px);
                      margin-top: 2.8em;
                      margin-bottom: 1em;
                    }
                    h3 {
                      font-size: 1.15em;
                    }
                    p {
                      margin-bottom: 1em;
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
                      display: block;
                      margin-top: 2em;
                    }
                    /* 표 */
                    table {
                      width: 100%;
                      border-collapse: collapse;
                      margin: 1.5em 0;
                      font-size: 0.95em;
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
                    tbody tr:nth-of-type(even) {
                      background: #fafafa;
                    }
                    /* 인용 출처 — 괄호 전체를 기울임 + 회색 + 작게 */
                    em {
                      font-style: italic;
                      color: #8a8a8a;
                      font-size: 0.9em;
                    }
                    .blog-citation {
                      font-style: italic;
                      color: #8a8a8a;
                      font-size: 0.9em;
                      text-decoration: none;
                    }
                    a.blog-citation {
                      color: #8a8a8a;
                    }
                    a.blog-citation:hover {
                      text-decoration: underline;
                    }
                    .blog-citation em {
                      color: inherit;
                      font-size: 1em;
                    }
                    /* 끝 의학 고지 — 본문과 떨어뜨림, 가로선 없음 */
                    .blog-disclaimer {
                      margin-top: 4em;
                    }
                    .blog-disclaimer p {
                      margin-bottom: 0.4em;
                    }
                    /* 이미지 캡션 — 본문 검은색과 분리해 진한 회색, 가운데 정렬 */
                    .blog-caption {
                      text-align: center;
                      margin-top: -0.4em;
                      margin-bottom: 1.6em;
                    }
                    .blog-caption em {
                      color: #999;
                      font-size: 0.875em;
                      font-style: normal;
                    }
                    /* FAQ 질문 — 기본(검정) 색, 줄 분리 */
                    .faq-q {
                      display: inline-block;
                      margin-bottom: 0.3em;
                      color: inherit;
                    }
                  `,
                ]}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />

              {/* 공통 고지문구 — 어드민 '의료 고지 문구'에서 관리. 기존 본문 고지 스타일과 동일(가로선 없음) */}
              {disclaimers.length > 0 && (
                <div tw="text-[15px] lg:text-[16px]" css={[{ marginTop: "4em" }]}>
                  {disclaimers.map((d, i) => (
                    <p
                      key={i}
                      css={[
                        {
                          color: "#8a8a8a",
                          fontStyle: "italic",
                          fontSize: "0.9em",
                          lineHeight: 1.8,
                          marginBottom: "0.4em",
                        },
                      ]}>
                      {d}
                    </p>
                  ))}
                </div>
              )}
            </article>
          </div>

          {/* 본문 하단(의료진 카드 + 관련 글) — 데스크톱에선 우측 본문 컬럼에 정렬. TOC sticky 범위 밖 */}
          <div css={[isDesktop ? tw`flex flex-row-reverse gap-10` : undefined]}>
            {isDesktop && <div css={[{ width: "300px", flexShrink: 0 }]} />}
            <div css={[isDesktop ? tw`max-w-[800px] flex-1 min-w-0` : undefined]}>
              {/* 의료진 카드 */}
              <div className="profile-meta" css={[{ marginTop: "4em" }]}>
                <div
                  tw="flex flex-col lg:flex-row items-stretch rounded-sm overflow-hidden"
                  css={[{ backgroundColor: "#fafafa", border: "1px solid #f0f0f0" }]}>
                  {/* 사진 — 모바일: 위(전체폭 정사각) / 데스크톱: 왼쪽 고정폭으로 카드 세로 높이에 꽉 참(여백 없음) */}
                  <div
                    role="img"
                    aria-label={authorName}
                    tw="w-full aspect-square lg:w-[200px] lg:aspect-auto lg:self-stretch bg-center bg-cover bg-no-repeat flex-shrink-0"
                    css={[
                      {
                        backgroundImage: `url("${resolveBlogAsset(cardDoctor?.photoUrl) || avatarImg}")`,
                        backgroundPosition: "center top",
                      },
                    ]}
                  />
                  {/* pêche + 안태언 대표원장(같은 줄, 동일 크기·색) + 소개글 */}
                  <div tw="flex flex-col justify-center gap-[3px] py-5 px-6 flex-1 min-w-0">
                    <p tw="text-[19px] font-semibold text-neutralBlack leading-[1.3]">
                      {authorName}
                      {cardDoctor?.jobTitle ? ` ${cardDoctor.jobTitle}` : ""}
                    </p>
                    {cardDoctor?.bio && (
                      <p tw="text-[15px] text-neutral50 mt-[6px] leading-[1.6]">{cardDoctor.bio}</p>
                    )}
                    <div tw="flex items-center gap-3 text-[15px] text-neutral50 mt-[6px]">
                      <CustomLink
                        to={cardDoctor?.profileUrl || "/doctor"}
                        tw="font-medium transition-colors duration-200"
                        css={[{ color: "#DA7F67" }]}>
                        의료진 소개 보기
                      </CustomLink>
                    </div>
                  </div>
                </div>
              </div>

              {/* 가격 섹션 — 모바일: 의료진 카드 다음 (PC는 왼쪽 목차 아래에 배치) */}
              {!isDesktop && <BlogPriceSection detailPages={priceDetailPages} />}

              {/* 관련 글 — 본문 내부 링크 자동 수집 */}
              {relatedPosts.length > 0 && (
                <aside tw="mt-10">
                  {/* 모바일: '가격 보기' 제목과 동일 스타일(16px + 코랄 밑줄)로 통일 */}
                  <h2
                    tw="font-semibold text-neutralBlack"
                    css={[
                      isDesktop ? tw`text-[21px] mb-4` : tw`text-[16px] pb-2 mb-3`,
                      !isDesktop && { borderBottom: "1px solid #DA7F67" },
                    ]}>
                    {topicKeyword ? `${topicKeyword} 시술 관련글 더보기` : "관련글 더보기"}
                  </h2>
                  <ul tw="list-none p-0 m-0 flex flex-col gap-[2px]">
                    {relatedPosts.map((link) => (
                      <li key={link.slug}>
                        <CustomLink
                          to={`/blog/${link.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          tw="text-[15px] lg:text-[16px] leading-[1.6] no-underline transition-colors duration-200"
                          css={[{ color: "#555" }, tw`hover:text-[#DA7F67]`]}>
                          {link.anchor}
                        </CustomLink>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}
            </div>
          </div>

          {/* Back to list */}
          <div tw="flex justify-center mt-16 mb-44 lg:mt-20 lg:mb-20">
            <button
              onClick={() => navigate(`/${lang}/blog`)}
              tw="
              px-6 py-3 text-[15px] lg:text-[16px]
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

      {/* 모바일 하단 상담/예약 탭바 (다른 페이지와 동일) — lg:hidden 자체 처리 */}
      <BottomButtons
        showInquiryButtons={showInquiryButtons}
        setShowInquiryButtons={setShowInquiryButtons}
      />
    </Page>
  )
}

export default BlogDetail
