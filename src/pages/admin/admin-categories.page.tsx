import React, { useState } from "react"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"
import { useTranslation } from "react-i18next"
import { useBlogCategories } from "@/pages/blog/use-blog"
import { BlogCategoryCreatePayload } from "./admin-categories.types"
import axiosClient from "@/lib/api/http-client"
import { useQueryClient } from "@tanstack/react-query"
import useLanguageValue from "@/lib/hooks/use-language-key"
import tw, { css } from "twin.macro"

const inputStyle = tw`
  w-full border border-neutral30 px-3 py-2
  text-[14px] lg:text-[15px] font-pretendard
  outline-none focus:border-[#DA7F67]
  transition-colors duration-200
`

const labelStyle = tw`
  text-[14px] lg:text-[15px] font-semibold text-neutralBlack mb-1 block
`

const AdminCategories = () => {
  const { t } = useTranslation()
  const tv = useLanguageValue()
  const queryClient = useQueryClient()
  const { data: categoriesData } = useBlogCategories()
  const categories = categoriesData?.data ?? []

  const [name, setName] = useState("")
  const [nameEN, setNameEN] = useState("")
  const [nameZH, setNameZH] = useState("")
  const [nameZHTW, setNameZHTW] = useState("")
  const [nameJA, setNameJA] = useState("")
  const [nameTH, setNameTH] = useState("")
  const [sortOrder, setSortOrder] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setIsSubmitting(true)

    const payload: BlogCategoryCreatePayload = {
      name,
      nameEN: nameEN || undefined,
      nameZH: nameZH || undefined,
      nameZHTW: nameZHTW || undefined,
      nameJA: nameJA || undefined,
      nameTH: nameTH || undefined,
      sortOrder,
    }

    try {
      await axiosClient.post("/api/blog/categories", payload)
      queryClient.invalidateQueries(["blog", "categories"])
      setName("")
      setNameEN("")
      setNameZH("")
      setNameZHTW("")
      setNameJA("")
      setNameTH("")
      setSortOrder(0)
    } catch {
      // 401 if not admin
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Page hiddenFooter={false} bottomCartExists={false}>
      <div tw="bg-white min-h-screen font-pretendard tracking-tight leading-[150%]">
        <AppMaxWidth>
          <div tw="pt-[40px] lg:pt-[80px] pb-16 max-w-[600px] mx-auto">
            <h1 tw="text-[24px] lg:text-[30px] font-semibold text-neutralBlack mb-8">
              {t("admin.categories")}
            </h1>

            {/* Existing Categories */}
            <div tw="mb-8">
              {categories.length === 0 ? (
                <div tw="text-neutral50 text-[14px]">No categories yet.</div>
              ) : (
                <div tw="flex flex-col gap-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      tw="flex items-center justify-between px-4 py-3 border border-neutral30 rounded-sm">
                      <div tw="flex items-center gap-2">
                        <span
                          tw="text-[13px] px-2 py-[2px] rounded-sm font-medium"
                          css={[{ color: "#DA7F67", backgroundColor: "rgba(218, 127, 103, 0.1)" }]}>
                          {tv(cat, "name")}
                        </span>
                        <span tw="text-[12px] text-neutral50">#{cat.sortOrder}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Category Form */}
            <div tw="border-t border-neutral30 pt-6">
              <h2 tw="text-[18px] font-semibold text-neutralBlack mb-4">
                {t("admin.addCategory")}
              </h2>

              <form onSubmit={handleSubmit} tw="flex flex-col gap-4">
                <div>
                  <label css={[labelStyle]}>{t("admin.categoryName")} (ko)</label>
                  <input
                    css={[inputStyle]}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="카테고리명"
                    required
                  />
                </div>

                <div tw="grid grid-cols-2 gap-3">
                  <div>
                    <label css={[labelStyle]}>English</label>
                    <input
                      css={[inputStyle]}
                      value={nameEN}
                      onChange={(e) => setNameEN(e.target.value)}
                    />
                  </div>
                  <div>
                    <label css={[labelStyle]}>中文(简)</label>
                    <input
                      css={[inputStyle]}
                      value={nameZH}
                      onChange={(e) => setNameZH(e.target.value)}
                    />
                  </div>
                  <div>
                    <label css={[labelStyle]}>中文(繁)</label>
                    <input
                      css={[inputStyle]}
                      value={nameZHTW}
                      onChange={(e) => setNameZHTW(e.target.value)}
                    />
                  </div>
                  <div>
                    <label css={[labelStyle]}>日本語</label>
                    <input
                      css={[inputStyle]}
                      value={nameJA}
                      onChange={(e) => setNameJA(e.target.value)}
                    />
                  </div>
                  <div>
                    <label css={[labelStyle]}>ไทย</label>
                    <input
                      css={[inputStyle]}
                      value={nameTH}
                      onChange={(e) => setNameTH(e.target.value)}
                    />
                  </div>
                  <div>
                    <label css={[labelStyle]}>Sort Order</label>
                    <input
                      type="number"
                      css={[inputStyle]}
                      value={sortOrder}
                      onChange={(e) => setSortOrder(Number(e.target.value))}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  tw="
                    px-6 py-3 text-[14px] text-white font-medium
                    transition-colors duration-200
                    disabled:opacity-50
                  "
                  css={[
                    css`
                      background-color: #da7f67;
                      &:hover {
                        background-color: #bd7b60;
                      }
                    `,
                  ]}>
                  {t("admin.addCategory")}
                </button>
              </form>
            </div>
          </div>
        </AppMaxWidth>
      </div>
    </Page>
  )
}

export default AdminCategories
