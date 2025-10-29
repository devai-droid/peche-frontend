import { Select, SelectProps } from "@mui/material"

import styles from "./dropdown-input.component.module.scss"

const publicProps: SelectProps = {
  variant: "standard",
  displayEmpty: true,
  className: styles["hidden-border"],
  classes: {
    select: styles.select,
    icon: styles["select-icon"],
  },
}

const DropdownInput = (props: SelectProps) => <Select {...publicProps} {...props} />

export default DropdownInput
