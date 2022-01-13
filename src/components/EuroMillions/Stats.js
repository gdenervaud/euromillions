import React from "react";

import { getUpdatedList } from "../../helpers/DrawHelper";
import { Stats as StatsComponent } from "../Stats";
import { Number, Star, SwissWin } from "./Draw";

export const Stats = ({ draws, favorites, onFavoritesChange }) => {

  const handleFavoriteNumberClick = (number, add) => {
    const list = getUpdatedList(favorites[0], number, add);
    onFavoritesChange([
      list,
      favorites[1],
      favorites[2]
    ]);
  };

  const handleFavoriteStarClick = (star, add) => {
    const list = getUpdatedList(favorites[1], star, add);
    onFavoritesChange([
      favorites[0],
      list,
      favorites[2]
    ]);
  };

  const handleFavoriteSwissWinClick = (swissWin, add) => {
    const list = getUpdatedList(favorites[2], swissWin, add);
    onFavoritesChange([
      favorites[0],
      favorites[1],
      list
    ]);
  };

  const series = [
    {
      maxValue: 50,
      itemComponent: Number,
      getValue: draw => [...draw.numbers],
      favorites: favorites[0],
      onItemFavorite: handleFavoriteNumberClick
    },
    {
      maxValue: 12,
      itemComponent: Star,
      getValue: draw => [...draw.stars],
      favorites: favorites[1],
      onItemFavorite: handleFavoriteStarClick
    },
    {
      maxValue: 50,
      itemComponent: SwissWin,
      getValue: draw => [...draw.swissWin],
      favorites: favorites[2],
      onItemFavorite: handleFavoriteSwissWinClick
    }
  ];

  return (
    <StatsComponent draws={draws} series={series} />
  );
};

export default Stats;