import React, { useMemo } from "react";

import { Stats as StatsComponent } from "../Stats/Stats";
import { Number } from "./Number";
import { Star } from "./Star";
import { SwissWin } from "./SwissWin";

export const Stats = ({ draws, favorites }) => {

  const series = useMemo(() => [
    {
      maxValue: 50,
      drawSize: 5,
      itemComponent: Number,
      getValue: draw => [...draw.numbers],
      favorites: favorites[0].list,
      onFavoriteToggle: favorites[0].onItemToggle
    },
    {
      maxValue: 12,
      drawSize: 2,
      itemComponent: Star,
      getValue: draw => [...draw.stars],
      favorites: favorites[1].list,
      onFavoriteToggle: favorites[1].onItemToggle
    },
    {
      maxValue: 50,
      drawSize: 5,
      itemComponent: SwissWin,
      getValue: draw => [...draw.swissWin],
      favorites: favorites[2].list,
      onFavoriteToggle: favorites[2].onItemToggle
    }
  ], [favorites]);

  return (
    <StatsComponent draws={draws} series={series} />
  );
};

export default Stats;