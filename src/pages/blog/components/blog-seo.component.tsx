import React from "react"
import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"
import { blogV2PublicApi, BlogV2Doctor, BlogV2Post } from "../blog-v2.api"
import { BLOG_SITE } from "../blog-site.config"

interface FaqItem {
  question: string
  answer: string
}

interface TocItem {
  id: string
  text: string
  level: number
}

interface BlogSeoProps {
  post: BlogV2Post
  /** 글 지정 의료진이 없을 때 대표 의료진으로 채워진 카드용 의료진 (author/reviewedBy 통일) */
  doctor?: BlogV2Doctor
  title: string
  summary: string
  lang: string
  slug: string
  sanitizedContent?: string
  tocItems?: TocItem[]
  noindex?: boolean // 미리보기 등 색인 금지 페이지
}

const TITLE_MAX = 38 // 검색 결과 제목 잘림 방지(병원명 suffix 제외 기준)

/** 본문 HTML의 "FAQ" 섹션에서 Q/A 추출 (백엔드 extractFaqs와 동일 규칙). */
function extractFaqs(html: string): FaqItem[] {
  if (!html) return []
  const doc = new DOMParser().parseFromString(html, "text/html")
  const headings = Array.from(doc.querySelectorAll("h2, h3"))
  const faqHeading = headings.find((h) => /FAQ|자주\s*묻는/i.test(h.textContent ?? ""))
  if (!faqHeading) return []

  const faqs: FaqItem[] = []
  let node = faqHeading.nextElementSibling
  while (node && node.tagName !== "H2") {
    if (node.tagName === "P") {
      const strong = node.querySelector("strong")
      const qRaw = (strong?.textContent ?? "").trim()
      if (qRaw) {
        const full = node.textContent ?? ""
        const question = qRaw.replace(/^Q[:.]?\s*/i, "").trim()
        const answer = full
          .replace(qRaw, "")
          .replace(/^\s*A[:.]?\s*/i, "")
          .trim()
        if (question && answer) faqs.push({ question, answer })
      }
    }
    node = node.nextElementSibling
  }
  return faqs
}

/**
 * articleBody(AEO): 순수 본문 텍스트만. FAQ 섹션·의학고지·이미지 캡션은 제외
 * (감수자카드·예약 등은 본문 HTML에 없음). JSON-LD articleBody에 본문이 깨끗하게 담기도록.
 */
function extractArticleBody(html: string): string {
  if (!html) return ""
  const doc = new DOMParser().parseFromString(html, "text/html")
  doc.querySelectorAll(".blog-disclaimer, .blog-caption").forEach((el) => el.remove())
  // FAQ 헤딩부터 끝까지 제거(FAQPage 스키마가 별도로 커버)
  const faqHeading = Array.from(doc.querySelectorAll("h2, h3")).find((h) =>
    /FAQ|자주\s*묻는/i.test(h.textContent ?? ""),
  )
  if (faqHeading) {
    let node: Element | null = faqHeading
    while (node) {
      const next: Element | null = node.nextElementSibling
      node.remove()
      node = next
    }
  }
  return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim()
}

const BlogSeo = ({
  post,
  doctor,
  title,
  summary,
  lang,
  slug,
  sanitizedContent,
  tocItems,
  noindex,
}: BlogSeoProps) => {
  // 사이트 공통 정보 — 어드민 '기본 정보 관리'(DB) 우선, 아직 못 받았으면 코드 상수로 폴백
  const { data: cfg } = useQuery({
    queryKey: ["blog-v2-site-config"],
    queryFn: () => blogV2PublicApi.siteConfig(),
    staleTime: 1000 * 60 * 5,
  })
  const site = {
    hospitalName: cfg?.hospitalName || BLOG_SITE.hospitalName,
    baseUrl: cfg?.baseUrl || BLOG_SITE.baseUrl,
    organizationType: cfg?.organizationType || BLOG_SITE.organizationType,
    telephone: cfg?.telephone || BLOG_SITE.telephone,
    medicalSpecialty: cfg?.medicalSpecialty || BLOG_SITE.medicalSpecialty,
    address: {
      locality: cfg?.addressLocality || BLOG_SITE.address.locality,
      region: cfg?.addressRegion || BLOG_SITE.address.region,
      country: cfg?.addressCountry || BLOG_SITE.address.country,
    },
    geo:
      cfg && cfg.latitude != null && cfg.longitude != null
        ? { latitude: cfg.latitude, longitude: cfg.longitude }
        : BLOG_SITE.geo,
    sameAs: cfg?.sameAs?.length ? cfg.sameAs : BLOG_SITE.sameAs,
    knowsAbout: cfg?.knowsAbout?.length ? cfg.knowsAbout : BLOG_SITE.knowsAbout,
    credentials: cfg?.certifications?.length ? cfg.certifications : BLOG_SITE.credentials,
    supportedLangs: BLOG_SITE.supportedLangs,
  }
  const baseUrl = site.baseUrl
  const pageUrl = `${baseUrl}/${lang}/blog/${slug}`
  const siteName = site.hospitalName
  const hospitalId = `${baseUrl}/#hospital`

  // 글 지정 의료진 우선, 없으면 대표 의료진 — 카드와 JSON-LD(author/reviewedBy) 동일 인물로 통일
  const doc = post.authorDoctor ?? doctor
  // profileUrl이 상대경로면 절대 URL로 보정(SEO용). 내부 의료진 소개 페이지는 /:lang 하위.
  const docProfileUrl = doc?.profileUrl
    ? doc.profileUrl.startsWith("http")
      ? doc.profileUrl
      : `${baseUrl}/${lang}${doc.profileUrl.startsWith("/") ? "" : "/"}${doc.profileUrl}`
    : undefined
  const keywords = [post.mainKeyword, ...(post.subKeywords ?? [])].filter(Boolean).join(", ")
  const metaTitle = title.length > TITLE_MAX ? title.slice(0, TITLE_MAX).trim() : title

  const hasPart =
    tocItems && tocItems.length > 0
      ? tocItems.map((item) => ({
          "@type": "WebPageElement",
          name: item.text,
          url: `${pageUrl}#${item.id}`,
        }))
      : undefined

  // 1. BlogPosting — author/reviewedBy/publisher가 루트 병원(@id)을 참조해 단일 엔티티로 통합
  const articleJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: summary,
    image: post.thumbnailUrl || undefined,
    author: doc
      ? {
          "@type": "Person",
          name: doc.name,
          jobTitle: doc.jobTitle,
          url: docProfileUrl,
          worksFor: { "@id": hospitalId },
        }
      : { "@type": "Organization", "@id": hospitalId },
    ...(doc
      ? {
          reviewedBy: {
            "@type": "Physician",
            name: doc.name,
            medicalSpecialty: doc.specialty,
            worksFor: { "@id": hospitalId },
          },
        }
      : {}),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    publisher: { "@id": hospitalId },
    mainEntityOfPage: { "@type": "MedicalWebPage", "@id": pageUrl },
    articleBody: extractArticleBody(sanitizedContent ?? "") || undefined,
    ...(hasPart ? { hasPart } : {}),
  }

  // 2. 병원 단일 엔티티(루트) — @id로 위 author/reviewedBy/publisher와 통합
  const hospitalJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": site.organizationType,
    "@id": hospitalId,
    name: siteName,
    url: baseUrl,
    telephone: site.telephone || undefined,
    medicalSpecialty: site.medicalSpecialty || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: site.geo
      ? {
          "@type": "GeoCoordinates",
          latitude: site.geo.latitude,
          longitude: site.geo.longitude,
        }
      : undefined,
    sameAs: site.sameAs,
    knowsAbout: site.knowsAbout,
    hasCredential:
      site.credentials && site.credentials.length > 0 ? site.credentials : undefined,
  }

  // 3. BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/${lang}` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/${lang}/blog` },
      { "@type": "ListItem", position: 3, name: title, item: pageUrl },
    ],
  }

  // 4. FAQPage (본문 FAQ 섹션 파싱)
  const faqItems = extractFaqs(sanitizedContent ?? "")
  const faqJsonLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null

  // 5. medical_schema (글 주인공 JSON-LD, 마케터 작성 — MedicalProcedure 등)
  const extraJsonLd =
    post.extraJsonld && typeof post.extraJsonld === "object" ? post.extraJsonld : null

  return (
    <Helmet>
      <title>{`${metaTitle} | ${siteName}`}</title>
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta name="description" content={summary} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* OG — article:* 메타는 의도적으로 넣지 않음(OG가 Article 엔티티 자동 생성해 JSON-LD와 중복되는 것 방지) */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={summary} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content={siteName} />
      {post.thumbnailUrl && <meta property="og:image" content={post.thumbnailUrl} />}

      {/* hreflang */}
      {site.supportedLangs.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={`${baseUrl}/${l}/blog/${slug}`} />
      ))}
      <link rel="canonical" href={pageUrl} />

      {/* JSON-LD: BlogPosting + 병원(@id) + Breadcrumb + FAQPage + medical_schema */}
      <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(hospitalJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      {faqJsonLd && <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>}
      {extraJsonLd && <script type="application/ld+json">{JSON.stringify(extraJsonLd)}</script>}
    </Helmet>
  )
}

export default BlogSeo
