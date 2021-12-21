import React from "react";

import { Stats as StatsComponent } from "../Stats";
import { Number, Chance } from "./Draw";

export const Stats = ({ draws }) => {

  const series = [
    {
      maxValue: 42,
      itemComponent: Number,
      getValue: draw => [...draw.numbers]
    },
    {
      maxValue: 6,
      itemComponent: Chance,
      getValue: draw => [draw.chance]
    }
  ];

  return (
    <StatsComponent draws={draws} series={series} />
  );
};

export default Stats;