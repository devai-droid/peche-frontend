import React, { ForwardRefRenderFunction } from "react"
import TouchRipple, { TouchRippleActions } from "@mui/material/ButtonBase/TouchRipple"

import styles from "./checkbox.component.module.scss"
import { CheckboxIcon } from "@/assets/icon"
import { HTMLInputProps } from "@/lib/types/html-element-type"

interface Props extends HTMLInputProps {
  label?: React.ReactNode
  checked: boolean
}

// TODO: active & disabled 디자인 없음, disabled 디자인이 애매함. 디자인 수정되면 작업
const Checkbox: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  { label, checked, ...props },
  ref,
) => {
  const rippleRef = React.useRef<TouchRippleActions>(null)

  const onRippleStart = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
    rippleRef.current?.start(e)
  }
  const onRippleStop = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
    rippleRef.current?.stop(e)
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <label onMouseDown={onRippleStart} onMouseUp={onRippleStop}>
      <input ref={ref} className={styles.input} type="checkbox" {...props} checked={checked} />
      <div className={styles["checkbox-container"]}>
        <div className={styles["ripple-wrapper"]}>
          <div className={styles["checkbox-custom"]}>
            {checked ? <CheckboxIcon /> : <div className={styles["checkbox-unchecked"]} />}
          </div>
          <TouchRipple ref={rippleRef} center />
        </div>
        {label}
      </div>
    </label>
  )
}

export default React.forwardRef(Checkbox)
