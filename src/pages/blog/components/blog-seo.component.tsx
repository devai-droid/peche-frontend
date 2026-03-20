import React from "react"
import { Helmet } from "react-helmet-async"
import { BlogPost } from "../blog.types"

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
  post: BlogPost
  title: string
  summary: string
  lang: string
  slug: string
  sanitizedContent?: string
  tocItems?: TocItem[]
}

const BlogSeo = ({ post, title, summary, lang, slug, sanitizedContent, tocItems }: BlogSeoProps) => {
  const siteUrl = "https://pecheskin.clinic"
  const pageUrl = `${siteUrl}/${lang}/blog/${slug}`
  const siteName = "페슈의원"

  const hasPart =
    tocItems && tocItems.length > 0
      ? tocItems.map((item) => ({
          "@type": "WebPageElement",
          name: item.text,
          url: `${pageUrl}#${item.id}`,
        }))
      : undefined

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: summary,
    image: post.thumbnailUrl || undefined,
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    ...(hasPart ? { hasPart } : {}),
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/${lang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/${lang}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: pageUrl,
      },
    ],
  }

  // Parse FAQ items from content HTML
  const faqItems: FaqItem[] = []
  if (sanitizedContent) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(sanitizedContent, "text/html")
    const questions = doc.querySelectorAll(".schema-faq-question")
    questions.forEach((q) => {
      const questionEl = q.querySelector("strong")
      const answerEl = q.querySelector(".schema-faq-answer")
      if (questionEl && answerEl) {
        faqItems.push({
          question: (questionEl.textContent ?? "").replace(/^Q\.\s*/, ""),
          answer: answerEl.textContent?.trim() ?? "",
        })
      }
    })
  }

  const faqJsonLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null

  const supportedLangs = ["ko", "en", "zh", "zh-TW", "ja", "th"]

  return (
    <Helmet>
      <title>{`${title} | ${siteName}`}</title>
      <meta name="description" content={summary} />
      {post.keywords && <meta name="keywords" content={post.keywords} />}

      {/* OG Tags */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={summary} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content={siteName} />
      {post.thumbnailUrl && <meta property="og:image" content={post.thumbnailUrl} />}
      <meta property="article:published_time" content={post.publishedAt} />
      <meta property="article:modified_time" content={post.updatedAt} />
      <meta property="article:author" content={post.author} />

      {/* hreflang */}
      {supportedLangs.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={`${siteUrl}/${l}/blog/${slug}`} />
      ))}
      <link rel="canonical" href={pageUrl} />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      {faqJsonLd && <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>}
    </Helmet>
  )
}

export default BlogSeo
