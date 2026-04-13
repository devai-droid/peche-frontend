import React from "react"
import cx from "classnames"
import { ReactComponent as PecheLogoPc } from "@/assets/icons/peche-logo-pc.svg"

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
      <PecheLogoPc width={129} height={23} aria-label="Logo" />
    </a>
  )
}

export default Logo
