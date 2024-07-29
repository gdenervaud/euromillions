import { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";

import { ItemStats, SmoothingMethod, Trend }from "../../helpers/DrawHelper";
import { Value } from "../Value";
import { LastSuccess } from "./LastSuccess";
import { Bar } from "./Bar";
import { TrendBar } from "./TrendBar";
import { TrendArrow } from "./TrendArrow";


const useStyles = createUseStyles({
  row: {
    "& > td": {
      textAlign: "center"
    }
  },
  barCell: {
    width: "100%"
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

interface RowProps {
  row: ItemStats;
  onFavoriteToggle: (value?: number, add?: boolean) => void;
}

export const Row = ({ row: {value, success, period, smoothing, percentageOfSuccesses, trends, trend, lastSuccess, drawSize, maxValue, smoothingMethod, isFavorite, Component}, onFavoriteToggle}: RowProps) => {

  const classes = useStyles();

  const [showTrends, toggleTrends] = useState<boolean>(false);
  const [isTrendsInitialized, setTrendsInitialized] = useState<boolean>(false);
  const [trendsBySmoothingMethod, setTrendsBySmoothingMethod] = useState<Trend[]>([]);

  const getTrends = (smoothingMethod: SmoothingMethod): Trend[] => trends.map(t => ({
    ...t[smoothingMethod],
    date: t.date
  }));

  useEffect(() => {
    if (isTrendsInitialized) {
      setTrendsBySmoothingMethod(getTrends(smoothingMethod));
    }
  }, [trends, smoothingMethod, period, smoothing, isTrendsInitialized]);

  const handleTrendToggle = () => {
    const show = !showTrends;
    if (show && !isTrendsInitialized) {
      setTrendsBySmoothingMethod(getTrends(smoothingMethod));
      setTrendsInitialized(true);
    }
    toggleTrends(show);
  };

  const trendBySmoothingMethod = trend[smoothingMethod].trend;

  return (
    <tr className={classes.row}>
      <td>
        <Value Component={Component} value={value} checked={true} isFavorite={isFavorite} readOnly={true} onFavorite={onFavoriteToggle} />
      </td>
      <td>
        <LastSuccess lastSuccess={lastSuccess} drawSize={drawSize} maxValue={maxValue} />
      </td>
      <td className={classes.barCell}>
        <div className={`${classes.barPnl} ${showTrends?"show-trend":""}`} >
          <Bar className="bar" value={success} total={period} percentage={percentageOfSuccesses} />
          <TrendBar className="trend" trends={trendsBySmoothingMethod} />
        </div>
      </td>
      <td onClick={handleTrendToggle} className={classes.trendToggleBtn} title={showTrends?"voir le nombre de tirages à succès":"voir l'évolution de la tendance sur toute la période"}>
        <TrendArrow trend={trendBySmoothingMethod} />
      </td>
    </tr>
  );
};
