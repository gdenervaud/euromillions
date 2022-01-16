import React from "react";

import { Stats as StatsComponent } from "../Stats/Stats";
import { Number } from "./Number";
import { Chance } from "./Chance";

export const Stats = ({ draws, favorites, onFavoritesChange }) => {

  const series = [
    {
      maxValue: 42,
      itemComponent: Number,
      getValue: draw => [...draw.numbers],
      favorites: favorites[0].list,
      onFavoriteToggle: favorites[0].onItemToggle
    },
    {
      maxValue: 6,
      itemComponent: Chance,
      getValue: draw => [draw.chance],
      favorites: favorites[1].list,
      onFavoriteToggle: favorites[1].onItemToggle
    }
  ];

  return (
    <StatsComponent draws={draws} series={series} />
  );
};

export default Stats;