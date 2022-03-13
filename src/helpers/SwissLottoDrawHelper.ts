
import { Timestamp, serverTimestamp, SnapshotOptions, DocumentSnapshot, DocumentData, FirestoreDataConverter } from "firebase/firestore";


import { Draw, Favorite, FavoritesFilter, toDateString, isMatching } from "./DrawHelper";

export class SwissLottoDraw implements Draw {
  id: string;
  date: string;
  numbers: number[];
  chance: number | null;
  lastUpdated: Date | null;

  constructor (id: string, date: string, numbers: number[], chance: number | null, lastUpdated: Date | null) {
    this.id = id;
    this.date = date;
    this.numbers = Array.isArray(numbers)?numbers:[];
    this.chance = chance;
    this.lastUpdated = lastUpdated;
  }
  setDraw(draw: Draw) {
    const swissLottoDraw = draw as SwissLottoDraw;
    this.id = draw.id;
    this.date = draw.date;
    this.numbers = swissLottoDraw.numbers;
    this.chance = swissLottoDraw.chance;
    this.lastUpdated = draw.lastUpdated;
  }
}

// Firestore data converter
export const swissLottoDrawConverter: FirestoreDataConverter<SwissLottoDraw> = {
  toFirestore: (draw: SwissLottoDraw) => {
    return {
      id: draw.id,
      date: Timestamp.fromDate(new Date(draw.date)),
      numbers: draw.numbers,
      chance: draw.chance,
      lastUpdated: serverTimestamp()
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot<unknown>, options?: SnapshotOptions) => {
    const data = snapshot.data(options) as DocumentData;
    return new SwissLottoDraw(data.id, toDateString(data.date.toDate()), data.numbers, data.chance, data.lastUpdated.toDate());
  }
};

export const isDrawMatching = (draw: SwissLottoDraw, favoritesFilter: FavoritesFilter | undefined, favorites: Favorite[]): boolean => {
  if (!Array.isArray(favorites) || favorites.length !== 2) {
    return false;
  }
  if (!draw) {
    return false;
  }
  if (isMatching(draw.numbers, favorites[0].list, favoritesFilter)) {
    return true;
  }
  return isMatching(draw.chance, favorites[2].list, favoritesFilter);
};
