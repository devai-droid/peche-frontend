import { useCallback } from "react"
import { get } from "lodash"
import { useTranslation } from "react-i18next"

const keyMatch = {
  ko: "",
  en: "EN",
  ja: "JA",
  th: "TH",
  zh: "ZH",
  "zh-TW": "ZHTW",
}

const useLanguageValue = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language as keyof typeof keyMatch
  const tv = useCallback(
    <T>(obj: T, key: keyof T): string => {
      const localized = get(obj, String(key) + keyMatch[lang])
      if (localized) return localized
      return get(obj, String(key)) ?? ""
    },
    [lang],
  )

  return tv
}

export default useLanguageValue
