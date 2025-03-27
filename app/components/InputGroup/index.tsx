import * as styles from "./InputGroup.css";
import { type ChangeEvent } from "react";

interface InputGroupProps {
  id: string;
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  error?: string;
  name?: string;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>;
}

export default function InputGroup({
  id,
  type,
  placeholder,
  value,
  onChange,
  label,
  required = false,
  error,
  name,
  onBlur,
  ref,
  ...props
}: InputGroupProps) {
  return (
    <div className={styles.inputGroup}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={`${styles.input} ${error ? styles.error : ""}`}
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        onBlur={onBlur}
        ref={ref}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
