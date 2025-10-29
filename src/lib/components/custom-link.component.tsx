import React, { ForwardRefRenderFunction } from "react"
import { useTranslation } from "react-i18next"

import { Link, LinkProps, useSearchParams } from "react-router-dom"

const CustomLinkComponent: ForwardRefRenderFunction<HTMLAnchorElement, LinkProps> = (
  { to, ...props },
  ref,
) => {
  const { i18n } = useTranslation()
  const { language } = i18n
  const [searchParams] = useSearchParams()

  const lang = to.toString().startsWith("/") ? `/${language}` : ""
  const path = searchParams.get("path_visit")
  const detail = searchParams.get("detail_visit")
  const search = `path_visit=${path}&detail_visit=${detail}`

  if (path === null) {
    return <Link ref={ref} {...props} to={`${lang}${to}`} />
  }

  const searchString = to?.toString().includes("?") ? `&${search}` : `?${search}`
  return <Link ref={ref} {...props} to={`${lang}${to}${searchString}`} />
}

const CustomLink = React.forwardRef(CustomLinkComponent)

export default CustomLink
