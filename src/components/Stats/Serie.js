

import React from "react";
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

  const values = getDrawsStats(maxValue, drawSize, draws, getValue, period, smoothing);
  const rows = sortValuesStats(values, sortCriteria, sortAscending, smoothingMethod)
    .map(row => (
      {
        ...row,
        isFavorite: favorites.includes(row.value),
        Component: itemComponent,
        smoothingMethod: smoothingMethod
      }
    ))
    .filter(row => (showOnlyFavorites && favorites.length)?row.isFavorite:true);

  const props = {
    rows: rows,
    onFavoriteToggle: onFavoriteToggle,
    sortAscending: sortAscending,
    sortCriteria: sortCriteria,
    onSort: onSort,
  };

  return (
    <SerieComponent {...props} />
  );
};
