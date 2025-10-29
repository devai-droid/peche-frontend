import React from "react"
import { MenuItem, MenuItemProps } from "@mui/material"
import cx from "classnames"

import styles from "./dropdown.component.module.scss"

const DropdownItem: React.FC<MenuItemProps> = ({ className, ...props }) => (
  <MenuItem {...props} className={cx(styles.item, className)} />
)

export default DropdownItem
