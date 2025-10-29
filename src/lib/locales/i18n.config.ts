// src/locales/i18n.ts

import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import { initReactI18next } from "react-i18next"
import translationEN from "./en.json"
import translationKO from "./ko.json"
import translationZH from "./zh.json"
import translationJA from "./ja.json"
import translationTH from "./th.json"
import { LocalStorage } from "../service/local-storage.service"
import { LocalStorageKeys } from "../constants/local-storage-key.constant"

export type Language = (typeof Language)[keyof typeof Language]
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Language = {
  KOR: "ko",
  ENG: "en",
  CHN: "zh",
  JPN: "ja",
  THA: "th",
} as const

const resources = {
  [Language.ENG]: {
    translation: translationEN,
  },
  [Language.KOR]: {
    translation: translationKO,
  },
  [Language.CHN]: {
    translation: translationZH,
  },
  [Language.JPN]: {
    translation: translationJA,
  },
  [Language.THA]: {
    translation: translationTH,
  },
}

i18n
  .use(new LanguageDetector(null, { lookupLocalStorage: LocalStorageKeys.Language }))
  .use(initReactI18next)
  .init({
    resources,
    lng: LocalStorage.get(LocalStorageKeys.Language) || Language.KOR,
    fallbackLng: Language.ENG,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
