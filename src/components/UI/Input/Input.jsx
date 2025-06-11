import styles from "./Input.module.css";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md'; // Матеріал-дизайн

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
  showPasswordToggle = false,
  onTogglePassword,
  showPassword,
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
        <div className={styles.passwordInputWrapper}>
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={`${styles.input} ${
              error ? styles.error : hasSoftError ? styles.softError : ""
            } ${inputClassName} ${
              showPasswordToggle ? styles['input-with-toggle'] : ''
            }`}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={onTogglePassword}
              tabIndex="-1"
              aria-label={
                showPassword 
                  ? "Приховати пароль" 
                  : "Показати пароль"
              }
            >
              {showPassword ? <MdOutlineVisibility />  : <MdOutlineVisibilityOff  /> }
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;