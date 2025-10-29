import { useMemo } from "react"
import { useTranslation } from "react-i18next"

const keyMatch = {
  ko: "",
  en: "EN",
  ja: "JA",
  th: "TH",
  zh: "ZH",
}

interface LanguageQuery {
  visible?: boolean
  visibleEN?: boolean
  visibleJA?: boolean
  visibleTH?: boolean
  visibleZH?: boolean
}

const useLanguageQuery = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language as keyof typeof keyMatch
  const query: LanguageQuery = useMemo(() => ({ [`visible${keyMatch[lang]}`]: true }), [lang])

  return query
}

export default useLanguageQuery
