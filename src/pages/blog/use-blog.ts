import { useQuery, useMutation, useQueryClient, QueryKey } from "@tanstack/react-query"
import axiosClient from "@/lib/api/http-client"
import type { AxiosResponse } from "axios"
import {
  BlogListResponse,
  BlogDetailResponse,
  BlogCategoriesResponse,
  BlogCreatePayload,
  BlogUpdatePayload,
  BlogPost,
} from "./blog.types"

const BLOG_QUERY_KEY = "blog"

async function fetchBlogList(
  page: number,
  limit: number,
  lang: string,
  eventCategoryId?: string,
): Promise<BlogListResponse> {
  const res: AxiosResponse<BlogListResponse> = await axiosClient.get("/api/blog", {
    params: { page, limit, lang, ...(eventCategoryId ? { eventCategoryId } : {}) },
  })
  return res.data
}

async function fetchBlogDetail(slug: string, lang: string): Promise<BlogDetailResponse> {
  const res: AxiosResponse<BlogDetailResponse> = await axiosClient.get(`/api/blog/${slug}`, {
    params: { lang },
  })
  return res.data
}

async function fetchBlogCategories(): Promise<BlogCategoriesResponse> {
  const res: AxiosResponse<BlogCategoriesResponse> = await axiosClient.get("/api/blog/categories")
  return res.data
}

export const useBlogList = (
  page: number,
  limit: number,
  lang: string,
  eventCategoryId?: string,
) => {
  return useQuery<BlogListResponse, Error, BlogListResponse, QueryKey>(
    [BLOG_QUERY_KEY, "list", page, limit, lang, eventCategoryId],
    () => fetchBlogList(page, limit, lang, eventCategoryId),
  )
}

export const useBlogDetail = (slug: string, lang: string) => {
  return useQuery<BlogDetailResponse, Error, BlogDetailResponse, QueryKey>(
    [BLOG_QUERY_KEY, "detail", slug, lang],
    () => fetchBlogDetail(slug, lang),
    { enabled: !!slug },
  )
}

export const useBlogCategories = () => {
  return useQuery<BlogCategoriesResponse, Error, BlogCategoriesResponse, QueryKey>(
    [BLOG_QUERY_KEY, "categories"],
    () => fetchBlogCategories(),
  )
}

export const useBlogCreate = () => {
  const queryClient = useQueryClient()
  return useMutation<BlogPost, Error, BlogCreatePayload>(
    async (payload) => {
      const res: AxiosResponse<{ data: BlogPost }> = await axiosClient.post("/api/blog", payload)
      return res.data.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([BLOG_QUERY_KEY])
      },
    },
  )
}

export const useBlogUpdate = () => {
  const queryClient = useQueryClient()
  return useMutation<BlogPost, Error, { id: string; payload: BlogUpdatePayload }>(
    async ({ id, payload }) => {
      const res: AxiosResponse<{ data: BlogPost }> = await axiosClient.patch(
        `/api/blog/${id}`,
        payload,
      )
      return res.data.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([BLOG_QUERY_KEY])
      },
    },
  )
}

export const useBlogDelete = () => {
  const queryClient = useQueryClient()
  return useMutation<{ success: boolean }, Error, string>(
    async (id) => {
      const res: AxiosResponse<{ success: boolean }> = await axiosClient.delete(`/api/blog/${id}`)
      return res.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([BLOG_QUERY_KEY])
      },
    },
  )
}
