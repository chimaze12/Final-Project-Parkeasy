export { default as isEmail } from "./isEmail";
export { default as isPassword } from "./isPassword";
export { default as ifCondition } from "./ifCondition";

export const sumObjectValues = (obj) => {
  let sum = 0;
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      sum += sumObjectValues(obj[key]);
    } else {
      sum += obj[key];
    }
  }
  return sum;
};

export const getMostRatedPark = (parks) => {
  const sortedParks = parks.sort((a, b) => b.user - a.user);
  return sortedParks[0];
};

export const getLeastRatedPark = (parks) => {
  const sortedParks = parks.sort((a, b) => a.no_of_stars - b.no_of_stars);
  return sortedParks[0];
};

export const getFavouriteParkingLot = (ratings, userId) => {
  const ratingCounts = {};
  const ratingSums = {};

  for (const rating of ratings) {
    if (rating.user !== userId) {
      continue;
    }

    if (!(rating.parkinglot in ratingCounts)) {
      ratingCounts[rating.parkinglot] = 0;
      ratingSums[rating.parkinglot] = 0;
    }

    ratingCounts[rating.parkinglot]++;
    ratingSums[rating.parkinglot] += rating.no_of_stars;
  }

  let maxAverage = -Infinity;
  let favoriteParkingLot = null;

  for (const parkinglot in ratingCounts) {
    const average = ratingSums[parkinglot] / ratingCounts[parkinglot];

    if (average > maxAverage) {
      maxAverage = average;
      favoriteParkingLot = parkinglot;
    }
  }

  return favoriteParkingLot;
};
