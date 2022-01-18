
import { Timestamp, serverTimestamp } from "firebase/firestore";

import { toDateString, isMatching } from "./DrawHelper";

export class EuroMillionsDraw {
  constructor (id, date, numbers, stars, swissWin, lastUpdated) {
    this.id = id;
    this.date = date;
    this.numbers = Array.isArray(numbers)?numbers:[];
    this.stars = Array.isArray(stars)?stars:[];
    this.swissWin = Array.isArray(swissWin)?swissWin:[];
    this.lastUpdated = lastUpdated;
  }
  setDraw(draw) {
    this.id = draw.id;
    this.date = draw.date;
    this.numbers = draw.numbers;
    this.stars = draw.stars;
    this.swissWin = draw.swissWin;
    this.lastUpdated = draw.lastUpdated;
  }
}

// Firestore data converter
export const euroMillionsDrawConverter = {
  toFirestore: draw => {
    return {
      id: draw.id,
      date: Timestamp.fromDate(new Date(draw.date)),
      numbers: draw.numbers,
      stars: draw.stars,
      swissWin: draw.swissWin,
      lastUpdated: serverTimestamp()
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new EuroMillionsDraw(data.id, toDateString(data.date.toDate()), data.numbers, data.stars, data.swissWin, data.lastUpdated.toDate());
  }
};

export const isDrawMatching = (draw, favoritesFilter, favorites) => {
  if (!Array.isArray(favorites) || favorites.length !== 3) {
    return false;
  }
  if (!draw) {
    return false;
  }
  if (isMatching(draw.numbers, favoritesFilter, favorites[0].list)) {
    return true;
  }
  if (isMatching(draw.stars, favoritesFilter, favorites[1].list)) {
    return true;
  }
  return isMatching(draw.swissWin, favoritesFilter, favorites[2].list);
};
