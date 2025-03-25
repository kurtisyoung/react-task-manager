import * as styles from "./InputGroup.css";

type InputGroupProps = {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
};

export default function InputGroup({
  id,
  type,
  placeholder,
  value,
  onChange,
  label,
  required = false,
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
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.input}
        required={required}
      />
    </div>
  );
}
