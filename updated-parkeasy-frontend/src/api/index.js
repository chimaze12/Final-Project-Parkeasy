import axios from "axios";
const baseURL = "http://localhost:8000/";

const customFetch = axios.create({
  baseURL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

customFetch.interceptors.request.use(
  async (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = ` Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getIdFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user.id;
};

export const register = async (data) => {
  try {
    const response = await axios.post(baseURL + "register/", data);
    return response;
  } catch (error) {
    return error;
  }
};

export const refreshToken = async () => {
  try {
    const resp = await axios.post(baseURL + "login/refresh/", {
      refresh: localStorage.getItem("refresh"),
    });
    return resp.data;
  } catch (e) {
    console.log("Error", e);
  }
};

customFetch.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const resp = await refreshToken();

      const access_token = resp.access;

      sessionStorage.setItem("token", access_token);
      customFetch.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;
      return customFetch(originalRequest);
    }
    return Promise.reject(error);
  }
);

export const login = async (data) => {
  try {
    const response = await axios.post(baseURL + "login/", data);
    localStorage.setItem("refresh", response.data.token.refresh);
    sessionStorage.setItem("token", response.data.token.access);

    const user = await getData(response.data.userid);

    localStorage.setItem("user", JSON.stringify(user.data));
    return response;
  } catch (error) {
    return error;
  }
};

export const getData = async (id) => {
  try {
    const response = await customFetch.get(`user/${Number(id)}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const getBalance = async () => {
  try {
    const response = await customFetch.get(
      `account/${Number(getIdFromLocalStorage())}`
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const depositApi = async (amount) => {
  try {
    const response = await customFetch.post(`account/`, {
      amount,
    });
    return response;
  } catch (error) {
    console.error("error", error.response.data.detail);
    return error;
  }
};

export const registerLots = async (data) => {
  try {
    const response = await customFetch.post(`parkinglots/`, data);
    return response;
  } catch (error) {
    return error;
  }
};

export const rateParkingLot = async (data) => {
  try {
    const response = await customFetch.post(`rate/`, {
      parkinglot: data.parkinglot,
      no_of_stars: Number(data.noOfStars),
      user: Number(getIdFromLocalStorage()),
    });
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
};

export const getRatings = async () => {
  try {
    const response = await customFetch.get(`rate/`);
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
};

export const getNumberOfStars = async (id) => {
  try {
    const response = await customFetch.get(
      `rate/${Number(getIdFromLocalStorage(id))}-${Number(id)}`
    );
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
};

export const getParkingLot = async (id) => {
  try {
    const response = await customFetch.get(`parkinglots/${Number(id)}`);
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
};

export const bookParkingLot = async (parkinglot) => {
  const lot = await getParkingLot(parkinglot);
  console.log(lot);
  try {
    const response = await customFetch.post(`booklots/`, {
      parkinglot,
      user: Number(getIdFromLocalStorage()),
      amount: lot.data.price,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getAccount = async () => {
  try {
    const response = await customFetch.get(`booklots`);
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
};
