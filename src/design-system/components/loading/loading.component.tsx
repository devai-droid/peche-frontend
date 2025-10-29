import React from "react"
import { CircularProgress } from "@mui/material"

import styles from "./loading.component.module.scss"

const Loading = () => <CircularProgress className={styles.loading} />

export default Loading
