import React from "react"
import cx from "classnames"
import { ReactComponent as PecheLogoHorizontal } from "@/assets/icons/peche-logo-horizontal.svg"

import styles from "./logo.component.module.scss"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

interface Props {
  className?: string
}

const MobileLogo: React.FC<Props> = ({ className, ...props }) => {
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
      <PecheLogoHorizontal width={129} height={23} aria-label="mobileLogo" />
    </a>
  )
}

export default MobileLogo
