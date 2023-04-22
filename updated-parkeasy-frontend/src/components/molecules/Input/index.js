import React from "react";

import style from "./index.module.css";

const Input = ({
  placeholder,
  value,
  setValue,
  type,
  error = false,
  errorMessage = "",
  className,
  label,
}) => (
  <div className={`${style.Input} ${className}`} data-testid="input-container">
    {!!label && <div className={style.Input__label}>{label}</div>}

    
      <input
        className={`${style.Input__input} ${className}`}
        {...{ placeholder, value, type }}
        onChange={setValue}
        data-testid="input"
      />
  

    {!!error && (
      <p className={style.Input__error} data-testid="error-message">
        {errorMessage}
      </p>
    )}
  </div>
);
Input.defaultProps = {
  error: false,
  errorMessage: "",
  className: "",
  label: "",
};
export default Input;
