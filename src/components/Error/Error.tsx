import React from "react"
import styles from "./Error.module.css"
interface ErrorProps {
  message?: string
}

const ErrorMsg: React.FC<ErrorProps> = ({ message }) => (
  <div className={styles.errorMsg}>{message || "Something went wrong"}</div>
)

export default ErrorMsg
