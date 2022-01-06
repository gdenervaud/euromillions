import React from "react";

import { Stats as StatsComponent } from "../Stats";
import { Number, Star, SwissWin } from "./Draw";

export const Stats = ({ draws }) => {

  const series = [
    {
      maxValue: 50,
      itemComponent: Number,
      getValue: draw => [...draw.numbers]
    },
    {
      maxValue: 12,
      itemComponent: Star,
      getValue: draw => [...draw.stars]
    },
    {
      maxValue: 50,
      itemComponent: SwissWin,
      getValue: draw => [...draw.swissWin]
    }
  ];

  return (
    <StatsComponent draws={draws} series={series} />
  );
};

export default Stats;