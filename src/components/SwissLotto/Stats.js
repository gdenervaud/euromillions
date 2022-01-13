import React from "react";

import { getUpdatedList } from "../../helpers/DrawHelper";
import { Stats as StatsComponent } from "../Stats";
import { Number, Chance } from "./Draw";

export const Stats = ({ draws, favorites, onFavoritesChange }) => {

  const handleFavoriteNumberClick = (number, add) => {
    const list = getUpdatedList(favorites[0], number, add);
    onFavoritesChange([
      list,
      favorites[1]
    ]);
  };

  const handleFavoriteChanceClick = (chance, add) => {
    const list = getUpdatedList(favorites[1], chance, add);
    onFavoritesChange([
      favorites[0],
      list
    ]);
  };

  const series = [
    {
      maxValue: 42,
      itemComponent: Number,
      getValue: draw => [...draw.numbers],
      favorites: favorites[0],
      onItemFavorite: handleFavoriteNumberClick
    },
    {
      maxValue: 6,
      itemComponent: Chance,
      getValue: draw => [draw.chance],
      favorites: favorites[1],
      onItemFavorite: handleFavoriteChanceClick
    }
  ];

  return (
    <StatsComponent draws={draws} series={series} />
  );
};

export default Stats;