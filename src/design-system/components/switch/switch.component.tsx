import React from "react"
import cx from "classnames"
import MuiSwitch, { SwitchProps } from "@mui/material/Switch"

import styles from "./switch.component.module.scss"

const Switch: React.FC<SwitchProps> = ({ className, ...props }) => (
  <MuiSwitch className={cx(styles.switch, className)} disableRipple disableFocusRipple {...props} />
)

export default Switch
