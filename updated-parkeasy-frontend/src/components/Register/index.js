import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./index.module.scss";
import { loginPageImage } from "../../assets";

import useInput from "../../utils/hooks/useInput";
import isPassword from "../../utils/functions/isPassword";
import isEmail from "../../utils/functions/isEmail";
import { Input, PassWordInput } from "..";
import { register } from "../../api";
function Login() {
  const [email, setEmail, clearEmail] = useInput("");
  const [fullname, setFullName, clearFullName] = useInput("");
  const [fullnameError, setFullNameError] = useState(false);
  const [password, setPassword, clearPassword] = useInput("");
  const [password2, setPassword2, clearPassword2] = useInput("");
  const [emailError, setEmailError] = useState(false);
  const [passWordError, setPassWordError] = useState(false);
  const [passWordError2, setPassWordError2] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Please enter a valid email");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      String(fullname).split(" ").length < 2 ||
      String(fullname).split(" ")[0]?.length < 1 ||
      String(fullname).split(" ")[1]?.length < 1
    ) {
      setFullNameError(true);
      setTimeout(() => {
        setFullNameError(false);
      }, 3000);
      return;
    }
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
    if (String(password) !== String(password2)) {
      setPassWordError2(true);
      setTimeout(() => {
        setPassWordError2(false);
      }, 3000);
      return;
    }
    const res = await register({
      email,
      password,
      password2: password,
      first_name: fullname.split(" ")[0],
      last_name: fullname.split(" ")[1],
    });

    if (res?.status === 201) {
      navigate("/login");
    } else {
      setEmailError(true);
      setErrorMsg(
        res.response.data.email[0] === "is field must be unique."
          ? res.response.data.email[0]
          : "Email Already registered"
      );
      setTimeout(() => {
        setEmailError(false);
      }, 3000);
    }
  };

  return (
    <section className={style.LogIn}>
      <div className={style.LogIn__left}>
        {/* <Logo className={style.LogIn__left__logo}/> */}
        <img
          src={loginPageImage}
          className={style.LogIn__left__illustration}
          alt="SignIn illustration"
          role="presentation"
        />
      </div>
      <div className={style.LogIn__right}>
        <h2 className={style.LogIn__right__heading}>Register to Continue!</h2>
        <p className={style.LogIn__right__details}>Enter details to Register</p>
        <form onSubmit={handleSubmit} className={style.LogIn__right__form}>
          <Input
            {...{
              value: String(fullname),
              setValue: setFullName,
              clearValue: clearFullName,
              placeholder: "John Doe",
              label: "Full Name",
              type: "text",
              error: fullnameError,
              errorMessage: "Full name must be provided Eg. John Doe",
            }}
          />
          <Input
            {...{
              value: String(email),
              setValue: setEmail,
              label: "Email",
              clearValue: clearEmail,
              placeholder: "example@mail.com",
              type: "text",
              error: emailError,
              errorMessage: errorMsg,
            }}
          />
          <PassWordInput
            {...{
              value: String(password),
              setValue: setPassword,
              clearValue: clearPassword,
              label: "Password",

              type: "password",
              error: passWordError,
              errorMessage:
                "Please enter a password with an Uppercase, Lowercase, Number and a special character",
            }}
          />
          <PassWordInput
            {...{
              value: String(password2),
              setValue: setPassword2,
              clearValue: clearPassword2,
              label: "Confirm Password",

              type: "password",
              error: passWordError2,
              errorMessage: "Password and confirm passwords must match",
            }}
          />
          <span
            onClick={() => navigate("/login")}
            className={style.LogIn__right__form__forgot}
          >
            HAVE AN ACCOUNT? LOGIN
          </span>

          <button className={style.LogIn__right__form__button} type="submit">
            <h3 className={style.h3}>REGISTER</h3>
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
