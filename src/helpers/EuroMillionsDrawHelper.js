
import { Timestamp, serverTimestamp } from "firebase/firestore";


import { toDateString } from "./DrawHelper";

export class EuroMillionsDraw {
  constructor (id, date, numbers, stars, lastUpdated) {
    this.id = id;
    this.date = date;
    this.numbers = numbers;
    this.stars = stars;
    this.lastUpdated = lastUpdated;
  }
  setDraw(draw) {
    this.id = draw.id;
    this.date = draw.date;
    this.numbers = draw.numbers;
    this.stars = draw.stars;
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
      lastUpdated: serverTimestamp()
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new EuroMillionsDraw(data.id, toDateString(data.date.toDate()), data.numbers, data.stars, data.lastUpdated.toDate());
  }
};