
import { Timestamp, serverTimestamp } from "firebase/firestore";


import { toDateString } from "./DrawHelper";

export class SwissLottoDraw {
  constructor (id, date, numbers, chance, lastUpdated) {
    this.id = id;
    this.date = date;
    this.numbers = Array.isArray(numbers)?numbers:[];
    this.chance = chance;
    this.lastUpdated = lastUpdated;
  }
  setDraw(draw) {
    this.id = draw.id;
    this.date = draw.date;
    this.numbers = draw.numbers;
    this.chance = draw.chance;
    this.lastUpdated = draw.lastUpdated;
  }
}

// Firestore data converter
export const swissLottoDrawConverter = {
  toFirestore: draw => {
    return {
      id: draw.id,
      date: Timestamp.fromDate(new Date(draw.date)),
      numbers: draw.numbers,
      chance: draw.chance,
      lastUpdated: serverTimestamp()
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new SwissLottoDraw(data.id, toDateString(data.date.toDate()), data.numbers, data.chance, data.lastUpdated.toDate());
  }
};