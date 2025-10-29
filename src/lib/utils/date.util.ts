import dayjs from "dayjs"

import "dayjs/locale/ko"

const displayTimeAgo = (dateString: string, lang = "ko") => {
  const now = dayjs()
  const date = dayjs(dateString).locale(lang)
  const diff = now.diff(date, "minutes")

  if (diff < 1) {
    return lang === "ko" ? "방금" : "just now"
  }
  if (diff < 60) {
    return lang === "ko" ? `${diff}분 전` : `${diff} ${diff === 1 ? "minute" : "minutes"} ago`
  }
  if (diff < 1440) {
    return lang === "ko"
      ? `${Math.floor(diff / 60)}시간 전`
      : `${Math.floor(diff / 60)} ${Math.floor(diff / 60) === 1 ? "hour" : "hours"} ago`
  }
  if (diff < 4320) {
    return lang === "ko"
      ? `${Math.floor(diff / 1440)}일 전`
      : `${Math.floor(diff / 1440)} ${Math.floor(diff / 1440) === 1 ? "day" : "days"} ago`
  }
  if (date.isSame(now, "year")) {
    return lang === "ko" ? date.format("MMM D일") : date.format("MMM D")
  }
  return date.format("YYYY.MM.DD")
}

export { displayTimeAgo }
