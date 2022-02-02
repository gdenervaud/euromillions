import React, { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";

import { Value } from "../Value";
import { Bar } from "./Bar";
import { TrendBar } from "./TrendBar";
import { TrendArrow } from "./TrendArrow";


const useStyles = createUseStyles({
  row: {
    "& > td": {
      textAlign: "center"
    }
  },
  barPnl: {
    background: "rgba(0,0,0,0.1)",
    position: "relative",
    width: "100%",
    height: "30px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "0 5px",
    borderRadius: "100px",
    "& .bar": {
      width: "100%",
      transition: "width 0.3s ease-out"
    },
    "& .trend": {
      width: "0%",
      transition: "width 0.3s ease-out"
    },
    "&.show-trend": {
      "& .bar": {
        width: "0%"
      },
      "& .trend": {
        width: "100%"
      }
    }
  },
  trendToggleBtn: {
    cursor: "pointer"
  }
});

export const Row = ({ row: {value, success, period, smoothing, percentageOfSuccesses, sma, trend, isFavorite, Component}, onFavoriteToggle}) => {

  const classes = useStyles();

  const [showTrends, toggleTrends] = useState(false);
  const [trends, setTrends] = useState(null);

  useEffect(() => {
    if (trends) {
      setTrends(sma);
    }
  }, [trends, sma, period, smoothing]);

  const handleTrendToggle = () => {
    const show = !showTrends;
    if (show && !trends) {
      setTrends(sma);
    }
    toggleTrends(show);
  };

  return (
    <tr className={classes.row}>
      <td>
        <Value Component={Component} value={value} checked={true} isFavorite={isFavorite} readOnly={true} onFavorite={onFavoriteToggle} />
      </td>
      <td style={{width: "100%"}}>
        <div className={`${classes.barPnl} ${showTrends?"show-trend":""}`} >
          <Bar className="bar" value={success} total={period} percentage={percentageOfSuccesses} />
          <TrendBar className="trend" trends={trends} />
        </div>
      </td>
      <td onClick={handleTrendToggle} className={classes.trendToggleBtn} title={showTrends?"voir le nombre de tirages à succès":"voir l'évolution de la tendance sur toute la période"}>
        <TrendArrow trend={trend} />
      </td>
    </tr>
  );
};
