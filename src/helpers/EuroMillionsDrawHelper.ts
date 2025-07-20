
import { EuroMillionsDraw, Favorite, FavoritesFilter } from "../types";
import { isMatching } from "./DrawHelper";



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
