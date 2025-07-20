
import { Draw, Favorite, FavoritesFilter, toDateString, isMatching } from "./DrawHelper";

export class SwissLottoDraw implements Draw {
  id: string;
  date: string;
  numbers: number[];
  chance: number | null;
  lastUpdated: number | null;

  constructor (id: string, date: string, numbers: number[], chance: number | null, lastUpdated: number | null) {
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
