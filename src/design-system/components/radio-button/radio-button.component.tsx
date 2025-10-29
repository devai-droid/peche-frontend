import React from "react"
import cx from "classnames"
import { HTMLInputProps } from "@/lib/types/html-element-type"

import styles from "./radio-button.component.module.scss"

interface Props extends HTMLInputProps {
  text: React.ReactNode
  subText?: React.ReactNode
  label?: React.ReactNode
}

const RadioButton: React.ForwardRefRenderFunction<HTMLInputElement, Props> = (
  { text, subText, label, ...props },
  ref,
) => (
  <label>
    <input className={styles.input} type="radio" {...props} ref={ref} />
    <div className={cx(styles.container)}>
      <div className={styles["radio-button"]} />
      <div className={styles["text-container"]}>
        <h2 className={styles.text}>{text}</h2>
        {subText && (
          <div>
            <span className={styles["sub-text"]}>{subText}</span>
            <span className={styles.label}>{label}</span>
          </div>
        )}
      </div>
    </div>
  </label>
)

export default React.forwardRef(RadioButton)
