import { useCallback } from "react"
import { get } from "lodash"
import { useTranslation } from "react-i18next"

const keyMatch = {
  ko: "",
  en: "EN",
  ja: "JA",
  th: "TH",
  zh: "ZH",
}

const useLanguageValue = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language as keyof typeof keyMatch
  const tv = useCallback(
    <T>(obj: T, key: keyof T): string => get(obj, String(key) + keyMatch[lang]) ?? "",
    [lang],
  )

  return tv
}

export default useLanguageValue
