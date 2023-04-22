import React, { useRef } from "react";

import style from "./index.module.css";

const PassWordInput = ({
  placeholder,
  value,
  setValue,
  type,
  error,
  errorMessage,
  label,
}) => {
  const inputEl = useRef(null);
  return (
    <div className={style.PassWordInput} data-testid="password-input-container">
      {!!label && <div className={style.PasswordInput__label}>{label}</div>}
      <div className={style.PassWordInput__container}>
        <input
          ref={inputEl}
          className={style.PassWordInput__container__input}
          {...{ value, placeholder, type }}
          onChange={setValue}
          data-testid="password-input"
        />
        <span
          onClick={() => {
            if (!value) return;
            if (inputEl.current) {
              inputEl.current.type =
                inputEl.current.type === type ? "text" : "password";
            }
          }}
          onKeyDown={() => {
            if (!value) return;
            if (inputEl.current) {
              inputEl.current.type =
                inputEl.current.type === type ? "text" : "password";
            }
          }}
          className={style.PassWordInput__container__show}
          role="button"
          tabIndex={0}
        >
          show
        </span>
      </div>
      {error && (
        <p className={style.PassWordInput__error} data-testid="error-message">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default PassWordInput;
