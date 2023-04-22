
import React, { useContext } from 'react';
import style from './dashboard.module.scss';
import data from '../../canadaparkks.json';
import { getBalance, bookParkingLot } from "../../api"
import { UserContext } from '../../stroe';


import Map from '../Map';
import PersonalDetails from '../PersonalDetails';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
  const data = useContext(UserContext);


  const bookLot = async () => {
    const idEl = document.getElementById("fav-id");
    const res = await bookParkingLot(idEl.innerHTML)
    if (res.status === 201) {
      alert("parking lot booked")
      const balres = await getBalance();
      data.setBalance(balres.data.balance);
      data.getRatingsData()
    }
  }
  return (
    <div className={style.App}>
      <div className={style.dashboard}>

        <h2 className={style.dashboard__subhero}>
          Closest Parking Spot From Your Location
        </h2>
        <div className={style.closestParkTab}>
          <div id="closestPark" className={style.closestPark}>
            <p id="a-title" className={style.closestPark__a} />
            <p id="b-title" className={style.closestPark__b} />
            <p id="c-title" className={style.closestPark__c} />
            <p id="fav-id" className={style.closestPark__favId}></p>

          </div>
          <button onClick={bookLot} className={style.closestParkTab__button}>Book Now!</button>

        </div>
        <div className="sidebar">
          <div className="heading">
            <h1>Park locations</h1>
            <PersonalDetails />
          </div>
          <div id="listings" className="listings" />
        </div>
      </div>

      <Map />
    </div>
  );
}

const value = [{ label: 'The Shawshank Redemption', year: 1994 }];

data.features.forEach((lot) => {
  if (lot.properties.brz_name !== null) {
    const index = value.findIndex((o) => o.label === lot.properties.brz_name);
    if (index === -1) {
      value.push({ label: lot.properties.brz_name, year: 43434 });
    }
  }
});
export default Dashboard;
