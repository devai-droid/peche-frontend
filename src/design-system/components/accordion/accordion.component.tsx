import React from "react"
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import cx from "classnames"
import Icon from "../icon/icon.component"
import { DropDownIcon } from "@/assets/icon"

import styles from "./accordion.component.module.scss"

export interface CommonAccordionProps extends AccordionProps {
  children: JSX.Element[]
  className?: string
  isExpandIconHidden?: boolean
  onClickSummary?: React.MouseEventHandler<HTMLDivElement>
}

const CommonAccordion: React.FC<CommonAccordionProps & AccordionProps> = ({
  className,
  children,
  isExpandIconHidden,
  onClickSummary,
  ...props
}) => (
  <MuiAccordion className={cx(styles.accordion, "CommonAccordionJSX", className)} {...props}>
    <AccordionSummary
      className={styles.summary}
      onClick={onClickSummary}
      expandIcon={
        <Icon
          className={cx(styles["accordion-expand-icon"], { isExpandIconHidden })}
          icon={DropDownIcon}
          size={24}
        />
      }>
      {children[0]}
    </AccordionSummary>
    <AccordionDetails className={styles.detail}>{children[1]}</AccordionDetails>
  </MuiAccordion>
)

export default CommonAccordion
