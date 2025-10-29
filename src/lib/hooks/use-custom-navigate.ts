import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { NavigateOptions, useNavigate, useSearchParams } from "react-router-dom"

const useCustomNavigate = () => {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const [searchParams] = useSearchParams()

  const customNavigate = useCallback(
    (path: string, options?: NavigateOptions) => {
      const { language } = i18n

      const lang = path.startsWith("/") ? `/${language}` : ""

      const pathVisit = searchParams.get("path_visit")
      const detail = searchParams.get("detail_visit")
      const search = `path_visit=${pathVisit}&detail_visit=${detail}`

      if (pathVisit === null) {
        navigate(`${lang}${path}`, options)
        return
      }

      const searchString = path.includes("?") ? `&${search}` : `?${search}`

      navigate(`${lang}${path}${searchString}`, options)
    },
    [navigate, searchParams],
  )

  return customNavigate
}

export default useCustomNavigate
