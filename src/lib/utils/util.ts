import { endsWith } from "lodash"
import qs from "qs"

export const preloadImage = (url: string) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = resolve
    image.onerror = reject
    image.src = url
  })

export const formatNumber = (num: number, precision = 2) => {
  const map = [
    { suffix: "T", threshold: 1e12 },
    { suffix: "B", threshold: 1e9 },
    { suffix: "M", threshold: 1e6 },
    { suffix: "K", threshold: 1e3 },
    { suffix: "", threshold: 1 },
  ]

  const found = map.find((x) => Math.abs(num) >= x.threshold)
  if (found) {
    const formatted = +(num / found.threshold).toFixed(precision) + found.suffix
    return formatted
  }

  return num
}

export const ordinalSuffixOf = (num: number) => {
  const suffixes = ["th", "st", "nd", "rd"]
  const suffix =
    endsWith(String(num), "11") || endsWith(String(num), "12") || endsWith(String(num), "13")
      ? "th"
      : suffixes[num % 10] || "th"
  return suffix
}

export const zeroPad = (num: number, places: number) => String(num).padStart(places, "0")

export function toQueryString(query?: object) {
  const queryString = qs.stringify(query, {
    arrayFormat: "comma",
    encode: false,
  })
  return queryString ? `?${queryString}` : ""
}
