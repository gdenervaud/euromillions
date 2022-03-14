import React from "react";
import { createUseStyles } from "react-jss";

import { ItemStats }from "../../helpers/DrawHelper";
import { Value } from "../Value";
import { TrendArrow } from "./TrendArrow";
import { LastSuccess } from "./LastSuccess";

const useStyles = createUseStyles({
  container: {
    display: "inline-block",
    position: "relative"
  },
  trendArrow: {
    position: "absolute",
    top: "-3px",
    left: "10px",
    transform: "scale(0.4)",
    pointerEvents: "none"
  },
  lastSuccess: {
    position: "absolute",
    bottom: "-2px",
    left: "-5px",
    transform: "scale(0.6)",
    pointerEvents: "none",
    whiteSpace: "nowrap"
  }
});

interface ItemProps {
  item: ItemStats;
  onFavoriteToggle: (value?: number, add?: boolean) => void;
}

export const Item = ({ item: {value, isFavorite, lastSuccess, drawSize, maxValue, trend, smoothingMethod, Component}, onFavoriteToggle}: ItemProps) => {

  const classes = useStyles();

  const trendBySmoothingMethod = trend[smoothingMethod].trend;

  return (
    <div className={classes.container}>
      <Value Component={Component} value={value} checked={lastSuccess === 1} isFavorite={isFavorite} readOnly={true} onFavorite={onFavoriteToggle} />
      {lastSuccess !== 1 && trendBySmoothingMethod !== 0 && (
        <div className={classes.trendArrow}>
          <TrendArrow trend={trendBySmoothingMethod} />
        </div>
      )}
      {lastSuccess !== 1 && (
        <div className={classes.lastSuccess}>
          <LastSuccess lastSuccess={lastSuccess} drawSize={drawSize} maxValue={maxValue} />
        </div>
      )}
    </div>
  );
};
