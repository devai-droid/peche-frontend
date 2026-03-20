export interface BlogCategory {
  id: string
  name: string
  nameEN?: string
  nameZH?: string
  nameZHTW?: string
  nameJA?: string
  nameTH?: string
  sortOrder: number
  eventCategoryId?: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  titleEN?: string
  titleZH?: string
  titleZHTW?: string
  titleJA?: string
  titleTH?: string
  summary: string
  summaryEN?: string
  summaryZH?: string
  summaryZHTW?: string
  summaryJA?: string
  summaryTH?: string
  content: string
  contentEN?: string
  contentZH?: string
  contentZHTW?: string
  contentJA?: string
  contentTH?: string
  thumbnailUrl: string
  keywords?: string
  author: string
  visible: boolean
  publishedAt: string
  categories: BlogCategory[]
  eventCategoryId?: string
  viewCount?: number
  createdAt: string
  updatedAt: string
}

export interface BlogListResponse {
  data: BlogPost[]
  total: number
  page: number
  lastPage: number
}

export interface BlogDetailResponse {
  data: BlogPost
}

export interface BlogCategoriesResponse {
  data: BlogCategory[]
}

export interface BlogCreatePayload {
  title: string
  content: string
  slug?: string
  thumbnailUrl: string
  keywords?: string
  summary: string
  author?: string
  visible: boolean
  publishedAt: string
  categoryIds: string[]
  eventCategoryId?: string
  titleEN?: string
  titleZH?: string
  titleZHTW?: string
  titleJA?: string
  titleTH?: string
  summaryEN?: string
  summaryZH?: string
  summaryZHTW?: string
  summaryJA?: string
  summaryTH?: string
  contentEN?: string
  contentZH?: string
  contentZHTW?: string
  contentJA?: string
  contentTH?: string
}

export type BlogUpdatePayload = Partial<BlogCreatePayload>
