import React from "react"
import cx from "classnames"
import LogoImg from "@/assets/images/xenia-logo.webp"

import styles from "./logo.component.module.scss"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

interface Props {
  className?: string
}

const Logo: React.FC<Props> = ({ className, ...props }) => {
  const { i18n } = useTranslation()
  const { language } = i18n
  const [searchParams] = useSearchParams()

  const key = searchParams.get("path_visit")
  const type = searchParams.get("detail_visit")
  const search = `path_visit=${key}&detail_visit=${type}`

  return (
    <a
      className={cx(styles.link, className)}
      href={`${window.location.origin}/${language}?${search}`}
      {...props}>
      <img className={cx(styles.logo, className)} src={LogoImg} alt="Logo" />
    </a>
  )
}

export default Logo
