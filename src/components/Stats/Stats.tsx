

import React, { FC, useState, useCallback, useMemo } from "react";
import { createUseStyles } from "react-jss";
import { Scrollbars } from "react-custom-scrollbars";

import { Draw, SmoothingMethod, SortCriteria } from "../../helpers/DrawHelper";
import { ValueComponentProps } from "../Value";
import Toggle from "../Toggle";
import { Favorites } from "./Favorites";
import { Serie } from "./Serie";
import { PeriodSelector } from "./PeriodSelector";
import { SmoothingSelector } from "./SmoothingSelector";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    width: "100% ",
    height: "100%",
    display: "grid",
    gridTemplateRows: "min-content 1fr",
    gridTemplateColumns: "1fr"
  },
  header: {
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    "& > div + div": {
      marginTop: "15px"
    },
    "@media screen and (min-width:768px)": {
      padding: "10px 20px",
      flexDirection: "row",
      alignItems: "center",
      "& > div + div": {
        marginTop: 0,
        marginLeft: "20px"
      }
    },
    "@media screen and (min-width:1024px)": {
      padding: "20px"
    }
  },
  favoritesToggle: {
    marginTop: "15px !important",
    whiteSpace: "nowrap",
    "@media screen and (min-width:768px)": {
      marginTop: "0px !important",
    }
  },
  stats: {
    padding: "0 10px 10px 10px",
    overflowX: "hidden",
    "& > div + div": {
      marginTop: "20px"
    },
    "@media screen and (min-width:768px)": {
      padding: "0 20px 20px 20px",
    }
  },
  serie: {
    "& + $serie": {
      marginTop: "15px"
    }
  }
});

export interface Serie<DrawType extends Draw> {
  maxValue: number;
  drawSize: number;
  itemComponent: FC<ValueComponentProps>;
  getValue: (draw: DrawType) => number[];
  favorites: number[];
  onFavoriteToggle: (value?: number, add?: boolean) => void;
}

export interface StatsProps<DrawType extends Draw> {
  draws: DrawType[];
  series: Serie<DrawType>[];
}


export const Stats = <DrawType extends Draw, >({ draws, series}: StatsProps<DrawType>) => {

  const drawsByDate = draws.sort((a, b) => a.date.localeCompare(b.date));

  const [period, setPeriod] = useState(drawsByDate.length);
  const [smoothing, setSmoothing] = useState(drawsByDate.length >= 10?10:drawsByDate.length);
  const [smoothingMethod, setSmoothingMethod] = useState(SmoothingMethod.sma);

  const [sortAscending, setSortAscending] = useState(true);
  const [sortCriteria, setSortCriteria] = useState(SortCriteria.value);

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const handleOnSort = useCallback(criteria => {
    if (criteria === sortCriteria) {
      setSortAscending(!sortAscending);
    } else {
      setSortAscending(criteria === "value"?true:false);
      setSortCriteria(criteria);
    }
  }, [sortAscending, sortCriteria]);

  const hasFavorites = useMemo(() => series.some(serie => !!serie.favorites.length), [series]);

  const handleOnChange = useCallback((value: unknown): void => setShowOnlyFavorites(value as boolean), [setShowOnlyFavorites]);

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.header} >
        <PeriodSelector draws={draws} period={period} onChange={setPeriod} />
        <SmoothingSelector draws={draws} smoothing={smoothing} method={smoothingMethod} onSmoothingChange={setSmoothing} onMethodChange={setSmoothingMethod} />
        {hasFavorites && (
          <Toggle
            className={classes.favoritesToggle}
            value={showOnlyFavorites}
            items={[
              {
                value: true,
                label: "Uniquement les favoris",
                icon: "star",
                activeColor: "yellow",
                inactiveColor: "rgb(224, 224, 224)"
              },
              {
                value: false,
                label: "Tous les numéros",
                icon: "circle",
                activeColor: "#40a9f3",
                inactiveColor: "rgb(224, 224, 224)"
              }
            ]}
            onChange={handleOnChange}
          />
        )}
      </div>
      <div>
        <Scrollbars autoHide>
          <div className={classes.stats} >
            {series.map(({maxValue, drawSize, itemComponent, getValue, favorites, onFavoriteToggle}, index) => (
              <div  key={index} className={classes.serie} >
                {!showOnlyFavorites && (
                  <Favorites favorites={favorites} favoriteComponent={itemComponent} onFavoriteClick={onFavoriteToggle} />
                )}
                <Serie draws={draws} maxValue={maxValue} drawSize={drawSize} favorites={favorites} itemComponent={itemComponent} getValue={getValue} onFavoriteToggle={onFavoriteToggle} period={period} smoothing={smoothing} smoothingMethod={smoothingMethod} sortAscending={sortAscending} sortCriteria={sortCriteria} onSort={handleOnSort} showOnlyFavorites={showOnlyFavorites} />
              </div>
            ))}
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default Stats;
