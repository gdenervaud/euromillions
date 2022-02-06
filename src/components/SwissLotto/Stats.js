import React, { useMemo } from "react";

import { Stats as StatsComponent } from "../Stats/Stats";
import { Number } from "./Number";
import { Chance } from "./Chance";

export const Stats = ({ draws, favorites }) => {

  const series = useMemo(() => [
    {
      maxValue: 42,
      drawSize: 6,
      itemComponent: Number,
      getValue: draw => [...draw.numbers],
      favorites: favorites[0].list,
      onFavoriteToggle: favorites[0].onItemToggle
    },
    {
      maxValue: 6,
      drawSize: 1,
      itemComponent: Chance,
      getValue: draw => [draw.chance],
      favorites: favorites[1].list,
      onFavoriteToggle: favorites[1].onItemToggle
    }
  ], [favorites]);

  return (
    <StatsComponent draws={draws} series={series} />
  );
};

export default Stats;