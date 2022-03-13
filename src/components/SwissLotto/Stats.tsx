import React, { useMemo } from "react";

import { Favorite } from "../../helpers/DrawHelper";
import { SwissLottoDraw } from "../../helpers/SwissLottoDrawHelper";
import { Stats as StatsComponent, Serie } from "../Stats/Stats";
import { Number } from "./Number";
import { Chance } from "./Chance";

interface StatsProps {
  draws: SwissLottoDraw[];
  favorites: Favorite[];
}

export const Stats = ({ draws, favorites }: StatsProps) => {

  const series = useMemo((): Serie<SwissLottoDraw>[] => [
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
      getValue: draw => draw.chance?[draw.chance]:[],
      favorites: favorites[1].list,
      onFavoriteToggle: favorites[1].onItemToggle
    }
  ], [favorites]);

  return (
    <StatsComponent<SwissLottoDraw> draws={draws} series={series} />
  );
};

export default Stats;