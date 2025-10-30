import * as React from "react"
import cx from "classnames"
import Menu, { MenuProps } from "@mui/material/Menu"

import styles from "./dropdown.component.module.scss"

export type DropdownElement = ({
  open,
  openDropdown,
}: {
  openDropdown: (event: React.MouseEvent<HTMLElement>) => void
  open: boolean
}) => React.ReactNode

interface Props
  extends Pick<MenuProps, "transformOrigin" | "anchorOrigin" | "slotProps" | "disablePortal"> {
  element: DropdownElement
  className?: string
  onClickClose?: boolean
  children: (closeDropdown: () => void) => React.ReactNode
  hideTriangle?: boolean
}

const Dropdown: React.FC<Props> = ({
  element,
  children,
  className,
  onClickClose = false,
  hideTriangle,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <>
      {element({ openDropdown: handleClick, open })}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={
          onClickClose
            ? handleClose
            : (event: React.MouseEvent<HTMLElement>) => event.stopPropagation()
        }
        classes={{
          root: "!z-[9999]",
        }}
        slotProps={{
          paper: {
            classes: {
              root: cx(styles["dropdown-root"], className),
            },
          },
        }}
        MenuListProps={{
          disablePadding: true,
        }}
        tw="translate-x-[-5px]"
        transformOrigin={{ horizontal: "center", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        {...props}>
        {children(handleClose)}
      </Menu>
    </>
  )
}

export default Dropdown
