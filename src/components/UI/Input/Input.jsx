import { useTranslation } from "react-i18next";
import styles from "./Input.module.css";

const Input = ({
  label,
  labelIsCentered = false,
  isTextarea = false,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  disabled = false,
  error = null,
  hasSoftError = false,
  width = "100%",
  required = false,
  className = "",
  inputClassName = "",
  ...props
}) => {
  const { t } = useTranslation("homePage");

  return (
    <div className={`${styles.container} ${className}`} style={{ width }}>
      <div className={styles.topRow}>
        {label && (
          <label
            className={`${styles.label} ${
              labelIsCentered ? styles.center : ""
            }`}
          >
            {t(label)}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
      {isTextarea ? (
        <textarea
          className={styles.textarea}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          {...props}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`${styles.input} ${
            error ? styles.error : hasSoftError ? styles.softError : ""
          } ${inputClassName}`}
          {...props}
        />
      )}
    </div>
  );
};

export default Input;
