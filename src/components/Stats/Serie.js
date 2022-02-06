

import React, { useMemo } from "react";
import { createUseStyles } from "react-jss";

import { getDrawsStats, sortValuesStats } from "../../helpers/DrawHelper";

import { SortButton } from "./SortButton";
import { Row } from "./Row";

const useStyles = createUseStyles({
  container: {
    "& + $container": {
      marginTop: "15px"
    }
  }
});

const SerieComponent =  ({ rows, onFavoriteToggle, sortAscending, sortCriteria, onSort}) => {

  const classes = useStyles();

  return (
    <table className={classes.container}>
      <thead>
        <tr>
          <th><SortButton value="value"         selected={sortCriteria === "value"}         isAscending={sortAscending} onClick={onSort} >Numéros</SortButton></th>
          <th><SortButton value="lastSuccess"   selected={sortCriteria === "lastSuccess"}   isAscending={sortAscending} onClick={onSort} >Pas vu depuis</SortButton></th>
          <th><SortButton value="success"       selected={sortCriteria === "success"}       isAscending={sortAscending} onClick={onSort} >Succès</SortButton></th>
          <th><SortButton value="trend"         selected={sortCriteria === "trend"}         isAscending={sortAscending} onClick={onSort} >Tendance</SortButton></th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <Row key={row.value} row={row} onFavoriteToggle={onFavoriteToggle} />
        ))}
      </tbody>
    </table>
  );
};


export const Serie =  ({ draws, maxValue, drawSize, favorites, itemComponent, getValue, onFavoriteToggle, period, smoothing, smoothingMethod, sortAscending, sortCriteria, onSort, showOnlyFavorites}) => {

  const values = useMemo(() => getDrawsStats(maxValue, drawSize, draws, getValue, period, smoothing), [maxValue, drawSize, draws, getValue, period, smoothing]);
  const rows = useMemo(() => sortValuesStats(values, sortCriteria, sortAscending, smoothingMethod)
    .map(row => (
      {
        ...row,
        isFavorite: favorites.includes(row.value),
        Component: itemComponent,
        smoothingMethod: smoothingMethod
      }
    )), [values, sortCriteria, sortAscending, smoothingMethod, favorites, itemComponent]);
  const filteredRows = useMemo(() => rows.filter(row => (showOnlyFavorites && favorites.length)?row.isFavorite:true), [rows, favorites, showOnlyFavorites]);

  return (
    <SerieComponent rows={filteredRows} sortAscending={sortAscending} sortCriteria={sortCriteria} onSort={onSort} onFavoriteToggle={onFavoriteToggle} />
  );
};
