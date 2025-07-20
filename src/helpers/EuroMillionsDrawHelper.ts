
import { Draw, Favorite, FavoritesFilter, toDateString, isMatching } from "./DrawHelper";

export class EuroMillionsDraw implements Draw {
  id: string;
  date: string;
  numbers: number[];
  stars: number[];
  swissWin: number[];
  lastUpdated: number | null;

  constructor (id: string, date: string, numbers: number[], stars: number[], swissWin: number[], lastUpdated: number | null) {
    this.id = id;
    this.date = date;
    this.numbers = Array.isArray(numbers)?numbers:[];
    this.stars = Array.isArray(stars)?stars:[];
    this.swissWin = Array.isArray(swissWin)?swissWin:[];
    this.lastUpdated = lastUpdated;
  }
  setDraw(draw: Draw) {
    const euroMillionsDraw = draw as EuroMillionsDraw;
    this.id = draw.id;
    this.date = draw.date;
    this.numbers = euroMillionsDraw.numbers;
    this.stars = euroMillionsDraw.stars;
    this.swissWin = euroMillionsDraw.swissWin;
    this.lastUpdated = draw.lastUpdated;
  }
}

export const isDrawMatching = (draw: EuroMillionsDraw, favoritesFilter: FavoritesFilter | undefined, favorites: Favorite[]): boolean => {
  if (!Array.isArray(favorites) || favorites.length !== 3) {
    return false;
  }
  if (!draw) {
    return false;
  }
  if (isMatching(draw.numbers, favorites[0].list, favoritesFilter)) {
    return true;
  }
  if (isMatching(draw.stars, favorites[1].list, favoritesFilter)) {
    return true;
  }
  return isMatching(draw.swissWin, favorites[2].list, favoritesFilter);
};
