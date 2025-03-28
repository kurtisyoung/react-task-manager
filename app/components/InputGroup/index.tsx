import { type InputHTMLAttributes } from "react";
import * as styles from "./InputGroup.css";

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function InputGroup({
  label,
  error,
  className,
  ...props
}: InputGroupProps) {
  return (
    <div className={styles.inputGroup}>
      {label && (
        <label htmlFor={props.id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        className={`${styles.input} ${error ? styles.error : ""} ${
          className || ""
        }`}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
