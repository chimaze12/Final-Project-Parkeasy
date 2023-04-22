import React, { useEffect, useContext } from "react";
import style from "./index.module.scss";
import { RxAvatar } from "react-icons/rx";
import {
  getBalance,
  depositApi,
  getData,
  getIdFromLocalStorage,
} from "../../api";
import { UserContext } from "../../stroe";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const data = useContext(UserContext);
  const navigate = useNavigate();

  const [show, setShow] = React.useState(false);
  const [amount, setAmount] = React.useState(100);
  const [userData, setUserData] = React.useState({});
  const [showProfile, setShowProfile] = React.useState(false);
  const fetchData = async () => {
    const res = await getBalance();

    data.setBalance(res.data.balance);

    const res2 = await getData(getIdFromLocalStorage());
    setUserData(() => res2.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    data.setLoggedIn(false);
    navigate("/login");
  };

  const deposit = async (e) => {
    e.preventDefault();
    const res = await depositApi(amount);
    if (res.status === 201) {
      fetchData();
      setShow(false);
      alert("Deposit Successful");
    }
  };

  return (
    <div className={style.navbar}>
      <div className={style.navbar__logo}>
        <p className={style.navbar__logo__icon}>PARK</p>
        <p className={style.navbar__logo__ico}>EASY</p>
      </div>
      <div className={style.navbar__deposit}>
        {show ? (
          <form onSubmit={deposit}>
            <div className={style.navbar__deposit__form}>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={style.navbar__deposit__form__input}
              />
              <div className={style.navbar__deposit__form__buttonDiv}>
                <button
                  className={style.navbar__deposit__form__buttonDiv__submit}
                  type="submit"
                >
                  Submit
                </button>

                <button
                  className={style.navbar__deposit__form__buttonDiv__cancel}
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          <button
            className={style.navbar__deposit__button}
            onClick={() => setShow(true)}
          >
            Deposit
          </button>
        )}
      </div>
      <p className={style.navbar__balance}>${data.balance}</p>
      <div className={style.navbar__profile}>
        <RxAvatar
          className={style.navbar__profile__avatar}
          onMouseOver={() => setShowProfile(true)}
          onMouseLeave={() => setShowProfile(false)}
        />

        {showProfile && (
          <div className={style.navbar__profile__dropdown}>
            <p>{userData?.email}</p>
            <p>{userData?.first_name}</p>
            <p>{userData?.last_name}</p>
          </div>
        )}
      </div>

      <button onClick={logout} className={style.navbar__logout}>
        LogOut
      </button>
    </div>
  );
};

export default NavBar;
