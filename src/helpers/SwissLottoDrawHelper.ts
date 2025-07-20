
import { SwissLottoDraw, Favorite, FavoritesFilter } from "../types";
import { isMatching } from "./DrawHelper";



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
