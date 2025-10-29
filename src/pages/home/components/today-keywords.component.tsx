import CustomLink from "@/lib/components/custom-link.component"
import { useSearchKeywordControllerFindMany } from "@/lib/orval/search-keywords/search-keywords"
import { useTranslation } from "react-i18next"
import { Language } from "@/lib/locales/i18n.config"

const TodayKeywords = ({ onKeywordClick }: { onKeywordClick: (keyword: string) => void }) => {
  const { t, i18n } = useTranslation()

  const language = i18n.language as Language
  const { data: keywordsList } = useSearchKeywordControllerFindMany({
    page: 1,
    limit: 10,
    languageLocale: language,
  })

  return (
    <div tw="mt-[57px] mb-[24px] lg:my-20 text-center">
      <div tw="text-xl lg:text-xxl mb-4 lg:mb-8">{t("home.todaysSurgery")}</div>
      <div tw="w-full overflow-auto scrollbar-hide px-2">
        <div tw="flex gap-2 lg:gap-6 sm:justify-center">
          {keywordsList &&
            keywordsList.items.map((keyword) => (
              <CustomLink
                to=""
                tw="text-point text-md lg:text-lg p-2 shrink-0"
                key={keyword.keyword}
                onClick={() => onKeywordClick(keyword.keyword)}>
                {keyword.keyword}
              </CustomLink>
            ))}
        </div>
      </div>
    </div>
  )
}

export default TodayKeywords
