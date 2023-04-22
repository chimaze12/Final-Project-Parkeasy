import { createContext, useState, useEffect } from "react";
import {
  getRatings,
  getIdFromLocalStorage,
  getParkingLot,
  getAccount,
} from "../api";
import {
  sumObjectValues,
  getMostRatedPark,
  getLeastRatedPark,
  getFavouriteParkingLot,
} from "../utils/functions";

export const UserContext = createContext();

function AppContext({ children }) {
  const [balance, setBalance] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [statData, setData] = useState({});

  const getRatingsData = async () => {
    const res = await getRatings();
    const myData = getFavouriteParkingLot(
      res.data,
      Number(getIdFromLocalStorage())
    );
    const favParkRes = await getParkingLot(myData);
    const leastRated = getLeastRatedPark(res.data);
    const mostRated = getMostRatedPark(res.data);
    const lspark = await getParkingLot(leastRated.parkinglot);
    const mspark = await getParkingLot(mostRated.parkinglot);

    const account = await getAccount();

    const totals = account.data.reduce(
      (acc, booking) => {
        const date = new Date(booking.date_booked);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const week = Math.floor((date.getDate() - 1) / 7) + 1; // Calculate the week number of the month
        acc.weekly[year] = acc.weekly[year] || {};
        acc.weekly[year][month] = acc.weekly[year][month] || {};
        acc.weekly[year][month][week] =
          (acc.weekly[year][month][week] || 0) + booking.amount;
        acc.monthly[year] = acc.monthly[year] || {};
        acc.monthly[year][month] =
          (acc.monthly[year][month] || 0) + booking.amount;
        acc.yearly[year] = (acc.yearly[year] || 0) + booking.amount;
        return acc;
      },
      { weekly: {}, monthly: {}, yearly: {} }
    );

    setData({
      favPark: favParkRes?.data?.name,
      leastRated: lspark.data.name,
      mostRated: mspark.data.name,
      yearAmount: sumObjectValues(totals.yearly),
      monthAmount: sumObjectValues(totals.yearly),
      weekAmount: sumObjectValues(totals.yearly),
    });
  };
  useEffect(() => {
    getRatingsData();
  }, []);

  const data = {
    balance,
    setBalance,
    loggedIn,
    setLoggedIn,
    statData,
    getRatingsData,
  };

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
}

export default AppContext;
