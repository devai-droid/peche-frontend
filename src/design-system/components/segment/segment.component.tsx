import React from "react"

import cx from "classnames"
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
  ToggleButtonProps,
} from "@mui/material"

import styles from "./segment.component.module.scss"

interface ButtonProp extends ToggleButtonProps {
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
}

export interface SegmentProps {
  segmentContents: ButtonProp[]
}

const Segment: React.FC<SegmentProps & ToggleButtonGroupProps> = ({
  className,
  segmentContents,
  fullWidth = true,
  exclusive = true,
  ...props
}) => (
  <ToggleButtonGroup
    className={cx(styles["segment-group"], className)}
    {...props}
    exclusive={exclusive}
    fullWidth={fullWidth}>
    {segmentContents.map((item) => (
      <ToggleButton
        {...item}
        className={cx(styles["segment-button"], item.className)}
        value={item.value}
        key={item.label}
        disableRipple>
        {item.label}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
)
export default Segment
