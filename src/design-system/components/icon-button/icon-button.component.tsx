import React, { ForwardRefRenderFunction } from "react"
import { styled } from "@mui/material"
import MuiIconButton from "@mui/material/IconButton"
import cx from "classnames"
import { Icon } from "@/design-system/components"

import styles from "./icon-button.component.module.scss"
import { HTMLButtonProps, SvgIcon } from "@/lib/types/html-element-type"

const StyledMuiIconButton = styled(MuiIconButton)({
  padding: 12,
})

export interface IconButtonProps
  extends Pick<HTMLButtonProps, "disabled" | "onClick" | "className" | "type"> {
  icon: SvgIcon
  iconSize?: number
  active?: boolean
}

const IconButtonComponent: ForwardRefRenderFunction<HTMLButtonElement, IconButtonProps> = (
  { icon, iconSize, className, active, ...props },
  ref,
) => (
  <StyledMuiIconButton ref={ref} {...props} className={cx(styles.button, className)}>
    <Icon className={styles.icon} icon={icon} size={iconSize} />
  </StyledMuiIconButton>
)

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(IconButtonComponent)

export default IconButton
