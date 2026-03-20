import React, { useEffect, useRef, useState } from "react"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"
import { useTranslation } from "react-i18next"
import { useParams, useNavigate } from "react-router-dom"
import { useBlogCreate, useBlogUpdate, useBlogDetail } from "./use-blog"
import { BlogCreatePayload } from "./blog.types"
import tw, { css } from "twin.macro"
import axiosClient from "@/lib/api/http-client"
import type { AxiosResponse } from "axios"
import HtmlToolbar from "./components/html-toolbar.component"
import { useEventCategoryControllerFindManyWithPaginationQuery } from "@/lib/orval/event-categories/event-categories"
import { EventCategoryControllerFindManyWithPaginationQueryStatus } from "@/lib/orval/model"
import useLanguageValue from "@/lib/hooks/use-language-key"

const inputStyle = tw`
  w-full border border-neutral30 px-3 py-2
  text-[14px] lg:text-[15px] font-pretendard
  outline-none focus:border-[#DA7F67]
  transition-colors duration-200
`

const labelStyle = tw`
  text-[14px] lg:text-[15px] font-semibold text-neutralBlack mb-1 block
`

interface LangTab {
  key: string
  label: string
  suffix: string
}

const LANG_TABS: LangTab[] = [
  { key: "ko", label: "한국어", suffix: "" },
  { key: "en", label: "English", suffix: "EN" },
  { key: "zh", label: "中文(简)", suffix: "ZH" },
  { key: "zh-TW", label: "中文(繁)", suffix: "ZHTW" },
  { key: "ja", label: "日本語", suffix: "JA" },
  { key: "th", label: "ไทย", suffix: "TH" },
]

const BlogWrite = () => {
  const { t, i18n } = useTranslation()
  const { slug: slugParam } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const lang = i18n.language
  const tv = useLanguageValue()
  const isEdit = !!slugParam

  const { data: editData } = useBlogDetail(slugParam ?? "", lang)
  const createMutation = useBlogCreate()
  const updateMutation = useBlogUpdate()

  const { data: eventCategoriesData } = useEventCategoryControllerFindManyWithPaginationQuery({
    status: EventCategoryControllerFindManyWithPaginationQueryStatus.ACTIVE,
    limit: 100,
  })
  const eventCategories = eventCategoriesData?.items ?? []

  const [activeLangTab, setActiveLangTab] = useState("ko")
  const [selectedEventCategoryId, setSelectedEventCategoryId] = useState<string>("")

  // Form fields - multilingual
  const [fields, setFields] = useState<Record<string, string>>({
    title: "",
    titleEN: "",
    titleZH: "",
    titleZHTW: "",
    titleJA: "",
    titleTH: "",
    summary: "",
    summaryEN: "",
    summaryZH: "",
    summaryZHTW: "",
    summaryJA: "",
    summaryTH: "",
    content: "",
    contentEN: "",
    contentZH: "",
    contentZHTW: "",
    contentJA: "",
    contentTH: "",
  })

  // Non-multilingual fields
  const [keywords, setKeywords] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split("T")[0])
  const [visible, setVisible] = useState(true)

  // Populate fields on edit
  useEffect(() => {
    if (isEdit && editData?.data) {
      const post = editData.data
      setFields({
        title: post.title ?? "",
        titleEN: post.titleEN ?? "",
        titleZH: post.titleZH ?? "",
        titleZHTW: post.titleZHTW ?? "",
        titleJA: post.titleJA ?? "",
        titleTH: post.titleTH ?? "",
        summary: post.summary ?? "",
        summaryEN: post.summaryEN ?? "",
        summaryZH: post.summaryZH ?? "",
        summaryZHTW: post.summaryZHTW ?? "",
        summaryJA: post.summaryJA ?? "",
        summaryTH: post.summaryTH ?? "",
        content: post.content ?? "",
        contentEN: post.contentEN ?? "",
        contentZH: post.contentZH ?? "",
        contentZHTW: post.contentZHTW ?? "",
        contentJA: post.contentJA ?? "",
        contentTH: post.contentTH ?? "",
      })
      setKeywords(post.keywords ?? "")
      setThumbnailUrl(post.thumbnailUrl)
      setPublishedAt(post.publishedAt.split("T")[0])
      setVisible(post.visible)
      setSelectedEventCategoryId(post.eventCategoryId ?? "")
    }
  }, [isEdit, editData])

  const handleFieldChange = (fieldName: string, value: string) => {
    setFields((prev) => ({ ...prev, [fieldName]: value }))
  }

  const getFieldKey = (base: string, suffix: string) => {
    return suffix ? `${base}${suffix}` : base
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res: AxiosResponse<{ url: string }> = await axiosClient.post(
        "/api/upload/image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      )
      setThumbnailUrl(res.data.url)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async () => {
    const payload: BlogCreatePayload = {
      title: fields.title,
      titleEN: fields.titleEN || undefined,
      titleZH: fields.titleZH || undefined,
      titleZHTW: fields.titleZHTW || undefined,
      titleJA: fields.titleJA || undefined,
      titleTH: fields.titleTH || undefined,
      summary: fields.summary,
      summaryEN: fields.summaryEN || undefined,
      summaryZH: fields.summaryZH || undefined,
      summaryZHTW: fields.summaryZHTW || undefined,
      summaryJA: fields.summaryJA || undefined,
      summaryTH: fields.summaryTH || undefined,
      content: fields.content,
      contentEN: fields.contentEN || undefined,
      contentZH: fields.contentZH || undefined,
      contentZHTW: fields.contentZHTW || undefined,
      contentJA: fields.contentJA || undefined,
      contentTH: fields.contentTH || undefined,
      thumbnailUrl,
      keywords: keywords || undefined,
      publishedAt: new Date(publishedAt).toISOString(),
      visible,
      categoryIds: [],
      eventCategoryId: selectedEventCategoryId || undefined,
    }

    try {
      if (isEdit && editData?.data?.id) {
        await updateMutation.mutateAsync({ id: editData.data.id, payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      navigate(`/${lang}/blog`)
    } catch {
      // Error handling can be improved with toast later
    }
  }

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)

  const currentTab = LANG_TABS.find((tab) => tab.key === activeLangTab) ?? LANG_TABS[0]

  return (
    <Page hiddenFooter={false} bottomCartExists={false}>
      <div tw="bg-white min-h-screen font-pretendard tracking-tight leading-[150%]">
        <AppMaxWidth>
          <div tw="pt-[40px] lg:pt-[80px] pb-16 max-w-[800px] mx-auto">
            {/* Page Title */}
            <h1 tw="text-[24px] lg:text-[30px] font-semibold text-neutralBlack mb-8">
              {isEdit ? t("blog.edit") : t("blog.write")}
            </h1>

            {/* Language Tabs */}
            <div tw="flex gap-1 mb-6 flex-wrap">
              {LANG_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveLangTab(tab.key)}
                  tw="px-3 py-[6px] text-[13px] lg:text-[14px] border transition-colors duration-200"
                  css={[
                    activeLangTab === tab.key
                      ? css`
                          color: #ffffff;
                          background-color: #da7f67;
                          border-color: #da7f67;
                        `
                      : tw`text-neutral70 border-neutral30 hover:border-[#DA7F67] hover:text-[#DA7F67]`,
                  ]}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Multilingual Fields */}
            <div tw="flex flex-col gap-5 mb-8">
              {/* Title */}
              <div>
                <label css={[labelStyle]}>
                  {t("blog.titleField")} ({currentTab.label})
                </label>
                <input
                  css={[inputStyle]}
                  value={fields[getFieldKey("title", currentTab.suffix)]}
                  onChange={(e) =>
                    handleFieldChange(getFieldKey("title", currentTab.suffix), e.target.value)
                  }
                  placeholder={t("blog.titleField")}
                />
              </div>

              {/* Summary */}
              <div>
                <label css={[labelStyle]}>
                  {t("blog.summaryField")} ({currentTab.label})
                </label>
                <textarea
                  css={[inputStyle, tw`h-[80px] resize-y`]}
                  value={fields[getFieldKey("summary", currentTab.suffix)]}
                  onChange={(e) =>
                    handleFieldChange(getFieldKey("summary", currentTab.suffix), e.target.value)
                  }
                  placeholder={t("blog.summaryField")}
                />
              </div>

              {/* Content (HTML) */}
              <div>
                <label css={[labelStyle]}>
                  {t("blog.contentField")} ({currentTab.label}) — HTML
                </label>
                <HtmlToolbar
                  textareaRef={contentTextareaRef}
                  onChange={(v) => handleFieldChange(getFieldKey("content", currentTab.suffix), v)}
                />
                <textarea
                  ref={contentTextareaRef}
                  css={[
                    inputStyle,
                    tw`h-[300px] resize-y text-[13px]`,
                    { fontFamily: "monospace" },
                  ]}
                  value={fields[getFieldKey("content", currentTab.suffix)]}
                  onChange={(e) =>
                    handleFieldChange(getFieldKey("content", currentTab.suffix), e.target.value)
                  }
                  placeholder="<p>HTML content...</p>"
                />
              </div>
            </div>

            {/* Non-multilingual Fields */}
            <div tw="border-t border-neutral30 pt-6 flex flex-col gap-5 mb-8">
              {/* Keywords */}
              <div>
                <label css={[labelStyle]}>키워드 (SEO)</label>
                <input
                  css={[inputStyle]}
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="키워드1, 키워드2, 키워드3"
                />
                <p tw="text-[12px] text-neutral50 mt-1">쉼표로 구분. meta keywords 태그에 적용됩니다.</p>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label css={[labelStyle]}>{t("blog.thumbnailField")}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  css={[inputStyle]}
                />
                {isUploading && <p tw="text-[13px] text-neutral50 mt-1">업로드 중...</p>}
                {thumbnailUrl && (
                  <img
                    src={thumbnailUrl}
                    alt="thumbnail preview"
                    tw="mt-2 w-full max-h-[200px] object-cover"
                  />
                )}
              </div>

              {/* Publish Date */}
              <div>
                <label css={[labelStyle]}>{t("blog.publishDate")}</label>
                <input
                  type="date"
                  css={[inputStyle]}
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                />
              </div>

              {/* Visible */}
              <div tw="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                  tw="w-4 h-4"
                />
                <label tw="text-[14px] text-neutralBlack">Visible</label>
              </div>

              {/* Event Category */}
              {eventCategories.length > 0 && (
                <div>
                  <label css={[labelStyle]}>{t("blog.categoryField")}</label>
                  <select
                    css={[inputStyle]}
                    value={selectedEventCategoryId}
                    onChange={(e) => setSelectedEventCategoryId(e.target.value)}>
                    <option value="">카테고리 없음</option>
                    {eventCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {tv(cat, "name")}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div tw="flex justify-end gap-3">
              <button
                onClick={() => navigate(`/${lang}/blog`)}
                tw="px-6 py-3 text-[14px] border border-neutral30 text-neutral70 hover:border-neutralBlack hover:text-neutralBlack transition-colors duration-200">
                {t("blog.cancel")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={createMutation.isLoading || updateMutation.isLoading || isUploading}
                tw="px-6 py-3 text-[14px] text-white transition-colors duration-200 disabled:opacity-50"
                css={[{ backgroundColor: "#DA7F67" }, tw`hover:bg-[#BD7B60]`]}>
                {t("blog.save")}
              </button>
            </div>
          </div>
        </AppMaxWidth>
      </div>
    </Page>
  )
}

export default BlogWrite
