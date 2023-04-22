
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './index.module.scss';
import { loginPageImage } from '../../assets';

import useInput from '../../utils/hooks/useInput';
import isPassword from '../../utils/functions/isPassword';
import isEmail from '../../utils/functions/isEmail';
import { Input, PassWordInput } from '..';
import { login } from "../../api"
function Login() {
  const [email, setEmail, clearEmail] = useInput('');
  const [password, setPassword, clearPassword] = useInput('');
  const [emailError, setEmailError] = useState(false);
  const [passWordError, setPassWordError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Please enter a valid email")
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmail(String(email)) || !isPassword(String(password))) {
      if (!isEmail(String(email))) {
        setEmailError(true);
        setTimeout(() => {
          setEmailError(false);
        }, 3000);
      }
      if (!isPassword(String(password))) {
        setPassWordError(true);
        setTimeout(() => {
          setPassWordError(false);
        }, 3000);
      }
      return;
    }
    const res = await login({
      username: email, password
    })
    if (res.status === 200) {
      navigate('/dashboard', {
        state: {
          access: res.data.token.access,
          userId: res.data.userid
        }
      });
    }
    else {
      console.log(res)
      setErrorMsg(res?.message)
      setEmailError(true);
      setTimeout(() => {
        setEmailError(false);
      }, 3000);
    }


  };

  const nav = () => {
    navigate('/register');
  };
  return (
    <section className={style.LogIn}>
      <div className={style.LogIn__left}>
        <img
          src={loginPageImage}
          className={style.LogIn__left__illustration}
          alt="SignIn illustration"
          role="presentation"
        />
      </div>
      <div className={style.LogIn__right}>
        <h2 className={style.LogIn__right__heading}>Welcome!</h2>
        <p className={style.LogIn__right__details}>Enter details to login.</p>
        <form onSubmit={handleSubmit} className={style.LogIn__right__form}>
          <Input
            {...{
              value: String(email),
              setValue: setEmail,
              clearValue: clearEmail,
              placeholder: 'Email',
              type: 'text',
              error: emailError,
              errorMessage: errorMsg,
            }}
          />
          <PassWordInput
            {...{
              value: String(password),
              setValue: setPassword,
              clearValue: clearPassword,
              placeholder: 'Password',
              type: 'password',
              error: passWordError,
              errorMessage:
                'Please enter a password with an Uppercase, Lowercase, Number and a special character',
            }}
          />
          <span
            onClick={nav}
            role="button"
            tabIndex={0}
            className={style.LogIn__right__form__forgot}
          >
            DON&apos;T HAVE AN ACCOUNT? REGISTER
          </span>
          <span className={style.LogIn__right__form__forgot}>
            FORGOT PASSWORD?
          </span>
          <button className={style.LogIn__right__form__button} type="submit">
            <h3 className={style.h3}>LOG IN</h3>
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
