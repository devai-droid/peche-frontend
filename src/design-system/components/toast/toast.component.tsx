import React from "react"
import { ToastContainer, toast as toastify } from "react-toastify"
import cx from "classnames"
import { throttle } from "lodash"

import "react-toastify/dist/ReactToastify.css"
import styles from "./toast.component.module.scss"
import { InfoIcon, DoneIcon, CloseOneIcon } from "@/assets/icon"
import { ToastType } from "./toast.component.type"
import Icon from "../icon/icon.component"

const Toast: React.FC = () => (
  <ToastContainer
    position="top-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    className={styles["toast-container"]}
    bodyClassName={styles.body}
    progressClassName={styles.progress}
  />
)

export default React.memo(Toast)

interface ToastParams {
  title?: string
  message: string
  type?: ToastType
}

const toast = throttle(
  ({ message, title, type = ToastType.Information }: ToastParams) => {
    const iconMapping = {
      info: InfoIcon,
      warning: InfoIcon,
      success: DoneIcon,
      error: CloseOneIcon,
    }

    return toastify(
      <div className={styles["content-container"]}>
        <aside>
          <Icon className={styles.icon} icon={iconMapping[type]} />
        </aside>

        <section>
          {!!title && <h2 className={styles.title}>{title}</h2>}
          <p className={styles.message}>{message}</p>
        </section>
      </div>,
      {
        className: cx(styles.toast, styles[type]),
      },
    )
  },
  2000,
  {
    leading: true,
    trailing: false,
  },
)

export { toast }
