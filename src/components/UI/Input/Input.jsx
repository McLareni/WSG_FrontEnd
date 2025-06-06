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
  placeholder,
  ...props
}) => {
  return (
    <div className={`${styles.container} ${className}`} style={{ width }}>
      <div className={styles.topRow}>
        {label && (
          <label
            className={`${styles.label} ${
              labelIsCentered ? styles.center : ""
            }`}
          >
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>

      {isTextarea ? (
        <textarea
          className={`${styles.textarea} ${inputClassName}`}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
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
          placeholder={placeholder}
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
