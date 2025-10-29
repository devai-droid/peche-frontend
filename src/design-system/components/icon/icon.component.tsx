import React from "react"
import cx from "classnames"
import styled from "@emotion/styled"

import { SvgIcon } from "@/lib/types/html-element-type"

export interface IconProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  icon: SvgIcon
  size?: number
}

const IconWrapper = styled.span(({ size }: { size?: number }) => ({
  width: `${size}rem`,
  height: `${size}rem`,
}))

const Icon = ({ size = 24, icon, className, ...props }: IconProps) => {
  const IconElement = icon
  const rem = size / 16
  return (
    <IconWrapper className={cx(className)} size={rem} {...props}>
      <IconElement width={`${rem}rem`} height={`${rem}rem`} />
    </IconWrapper>
  )
}

export default Icon
