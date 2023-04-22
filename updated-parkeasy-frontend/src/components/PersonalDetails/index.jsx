import React, { useEffect } from 'react'
import style from './index.module.scss'
import { useContext } from 'react';
import { UserContext } from '../../stroe';

const PersonalDetails = () => {

    const context = useContext(UserContext);

    return (
        <div className={style.PersonalDetails}>
            <div className={style.PersonalDetails__stats}>
                <h2 className={style.PersonalDetails__stats__header}>Stats</h2>
                <h2 className={style.PersonalDetails__stats__data}>Favourite Park <p>{context.statData?.favPark}</p></h2>
                <h2 className={style.PersonalDetails__stats__header}>Amount Spent on Parking </h2>
                <h3 className={style.PersonalDetails__stats__data}>week 20/03/2023 <p>${context.statData?.weekAmount}</p></h3>
                <h3 className={style.PersonalDetails__stats__data}>month Apr <p>${context.statData?.monthAmount}</p></h3>
                <h3 className={style.PersonalDetails__stats__data}>Year 2023<p>${context.statData?.yearAmount}</p></h3>
                <h2 className={style.PersonalDetails__stats__header}>Other Stats </h2>
                <h3 className={style.PersonalDetails__stats__data}>Most Rated Park<p>{context.statData?.mostRated}</p></h3>
                <h3 className={style.PersonalDetails__stats__data}>Least Rated Park<p>{context.statData?.leastRated}</p></h3>
            </div>
        </div>
    )
}

export default PersonalDetails