import axios, { AxiosRequestConfig } from "axios"

/**
 * 블로그 v2 공개 API 클라이언트.
 * - dev: same-origin("") → webpack proxy(/api·/uploads → localhost:3007)
 * - 운영: 운영 백엔드(base.pecheskin.clinic). BACKEND_API_URL에서 `/api` 떼서 사용.
 * - BLOG_V2_API_URL 지정 시 그 값을 최우선 사용.
 */
const BLOG_V2_BASE =
  process.env.BLOG_V2_API_URL ||
  (process.env.STAGE && process.env.STAGE !== "dev"
    ? (process.env.BACKEND_API_URL || "").replace(/\/api\/?$/, "")
    : "")

const blogAxios = axios.create({ baseURL: BLOG_V2_BASE })
const request = <T>(config: AxiosRequestConfig): Promise<T> =>
  blogAxios(config).then(({ data }) => data as T)

/** 로컬 백엔드에 박힌 절대 이미지 주소(http://localhost:3007/...)를 현재 origin 기준으로 보정. */
export const resolveBlogAsset = (url?: string): string =>
  (url ?? "").replace(/https?:\/\/localhost:3007/g, BLOG_V2_BASE)

/** 본문 HTML 안의 이미지/링크 절대 주소도 동일하게 보정. */
export const rewriteBlogHtml = (html?: string): string =>
  (html ?? "").replace(/https?:\/\/localhost:3007/g, BLOG_V2_BASE)

export interface BlogV2Doctor {
  id: string
  name: string
  specialty?: string
  jobTitle?: string
  /** 의료진 소개글 — 모든 글 하단 의료진 카드 공통 노출 */
  bio?: string
  associations?: string[]
  photoUrl?: string
  profileUrl?: string
}

export interface BlogV2Post {
  id: string
  lang: string
  status: string
  title: string
  subtitle?: string
  bodyHtml?: string
  bodyMd: string
  thumbnailUrl?: string
  slug: string
  summaryText?: string
  mainKeyword?: string
  subKeywords?: string[]
  /** 주제 키워드 원본(frontmatter topic_keyword) — CTA 버튼명·"관련글 더보기" 헤딩에 사용 */
  topicKeyword?: string
  /** 주제 키워드 마스터(blog.keywords) 매칭 시 */
  keyword?: { id: string; keyword: string }
  /** 글 노출 위치용 상세페이지명(콤마로 여러 개). CTA와 분리 */
  productPage?: string
  /** CTA 버튼 링크(최대 2개) — 백엔드에서 이름→URL 해석 완료. 없으면 productPage 기반 단일 CTA로 폴백 */
  ctaLinks?: Array<{ type: "page" | "category" | "event"; target: string; text: string; url: string }>
  /** 가격 보기 소스 — 백엔드에서 이름→id 해석 완료. page(상세페이지)/category(상품 대분류)/event(이벤트 대분류). 없으면 productPage로 폴백 */
  priceRefs?: Array<{ type: "page" | "category" | "event"; id: string; name: string }>
  /** 이 글에 적용할 추가 고지문구 type 목록 (일반 면책 제외) */
  notices?: string[]
  productCategoryId?: string
  authorDoctor?: BlogV2Doctor
  publishedAt?: string
  viewCount: number
  extraJsonld?: Record<string, unknown>
  schemaType?: string
  internalLinks?: Array<{ anchor: string; slug: string }>
  createdAt: string
  updatedAt: string
}

export interface BlogV2ListResponse {
  items: BlogV2Post[]
  total: number
  page: number
  limit: number
}

export const blogV2PublicApi = {
  list: (params: {
    lang?: string
    productCategoryId?: string
    productPage?: string
    productPageContains?: string
    page?: number
    limit?: number
  }) =>
    request<BlogV2ListResponse>({
      method: "GET",
      url: "/api/blog-v2/posts/public/list",
      params,
    }),
  detail: (lang: string, slug: string) =>
    request<BlogV2Post>({
      method: "GET",
      url: `/api/blog-v2/posts/public/detail/${lang}/${encodeURIComponent(slug)}`,
    }),
  // 내부링크 치환용 — slug들 중 발행된 글의 slug→제목 맵(미발행/미존재는 미포함)
  slugTitles: (lang: string, slugs: string[]) =>
    request<Record<string, string>>({
      method: "GET",
      url: "/api/blog-v2/posts/public/slug-titles",
      params: { lang, slugs: slugs.join(",") },
    }),
  // 미리보기(초안 포함) — 어드민 iframe 전용. 페이지는 noindex 처리.
  preview: (id: string) =>
    request<BlogV2Post>({
      method: "GET",
      url: `/api/blog-v2/posts/public/preview/${id}`,
    }),
  // 대표 의료진(글 언어 기준, 없으면 ko 폴백) — 글에 author_doctor가 없을 때 하단 카드 채움
  representativeDoctor: (lang?: string) =>
    request<BlogV2Doctor | null>({
      method: "GET",
      url: "/api/blog-v2/doctors/public/representative",
      params: lang ? { lang } : undefined,
    }),
  // 공통 고지문구(활성만, 글 언어 기준) — 글 하단 결합용
  commonTexts: (lang?: string) =>
    request<BlogV2CommonText[]>({
      method: "GET",
      url: "/api/blog-v2/common-texts/public",
      params: lang ? { lang } : undefined,
    }),
  // 사이트 공통 정보(병원, 글 언어 기준 병합) — JSON-LD/메타 결합용
  siteConfig: (lang?: string) =>
    request<BlogV2SiteConfig>({
      method: "GET",
      url: "/api/blog-v2/site-config/public",
      params: lang ? { lang } : undefined,
    }),
}

export interface BlogV2CommonText {
  type: string
  body?: string
  isActive: boolean
}

export interface BlogV2SiteConfig {
  hospitalName?: string
  baseUrl?: string
  organizationType?: string
  telephone?: string
  addressStreet?: string
  addressLocality?: string
  addressRegion?: string
  addressPostalCode?: string
  addressCountry?: string
  latitude?: number
  longitude?: number
  medicalSpecialty?: string
  sameAs?: string[]
  knowsAbout?: string[]
  certifications?: string[]
}
