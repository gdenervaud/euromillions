

import React, { FC, useMemo } from "react";
import { createUseStyles } from "react-jss";

import { Draw, SmoothingMethod, SortCriteria, getDrawsStats, sortValuesStats } from "../../helpers/DrawHelper";
import { ValueComponentProps } from "../Value";
import { SortButton } from "./SortButton";
import { Row as RowComponent, RowProp } from "./Row";

const useStyles = createUseStyles({
  container: {
    "& + $container": {
      marginTop: "15px"
    }
  }
});

interface SerieComponentProps {
  rows: RowProp[];
	onFavoriteToggle: (value?: number, add?: boolean) => void;
	sortAscending: boolean;
	sortCriteria: SortCriteria;
	onSort: (criteria: SortCriteria) => void;
}

const SerieComponent =  ({ rows, onFavoriteToggle, sortAscending, sortCriteria, onSort}: SerieComponentProps) => {

  const classes = useStyles();

  return (
    <table className={classes.container}>
      <thead>
        <tr>
          <th><SortButton value={SortCriteria.value}         selected={sortCriteria === SortCriteria.value}         isAscending={sortAscending} onClick={onSort} >Numéros</SortButton></th>
          <th><SortButton value={SortCriteria.lastSuccess}   selected={sortCriteria === SortCriteria.lastSuccess}   isAscending={sortAscending} onClick={onSort} >Pas vu depuis</SortButton></th>
          <th><SortButton value={SortCriteria.success}       selected={sortCriteria === SortCriteria.success}       isAscending={sortAscending} onClick={onSort} >Succès</SortButton></th>
          <th><SortButton value={SortCriteria.trend}         selected={sortCriteria === SortCriteria.trend}         isAscending={sortAscending} onClick={onSort} >Tendance</SortButton></th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <RowComponent key={row.value} row={row} onFavoriteToggle={onFavoriteToggle} />
        ))}
      </tbody>
    </table>
  );
};

interface SerieProps<DrawType extends Draw> {
  draws: DrawType[];
  maxValue: number;
	drawSize: number;
	favorites: number[];
	itemComponent: FC<ValueComponentProps>;
	getValue: (draw: DrawType) => number[];
	onFavoriteToggle: (value?: number, add?: boolean) => void;
	period: number;
	smoothing: number;
	smoothingMethod: SmoothingMethod;
	sortAscending: boolean;
	sortCriteria: SortCriteria;
	onSort: (criteria: SortCriteria) => void;
	showOnlyFavorites: boolean;
}

export const Serie = <DrawType extends Draw, >({ draws, maxValue, drawSize, favorites, itemComponent, getValue, onFavoriteToggle, period, smoothing, smoothingMethod, sortAscending, sortCriteria, onSort, showOnlyFavorites}: SerieProps<DrawType>) => {

  const values = useMemo(() => getDrawsStats(maxValue, drawSize, draws, getValue, period, smoothing), [maxValue, drawSize, draws, getValue, period, smoothing]);
  const rows = useMemo(() => sortValuesStats(values, sortCriteria, sortAscending, smoothingMethod)
    .map(row => (
      {
        ...row,
        isFavorite: favorites.includes(row.value),
        Component: itemComponent,
        smoothingMethod: smoothingMethod
      }
    )) as RowProp[], [values, sortCriteria, sortAscending, smoothingMethod, favorites, itemComponent]);
  const filteredRows = useMemo(() => rows.filter(row => (showOnlyFavorites && favorites.length)?row.isFavorite:true), [rows, favorites, showOnlyFavorites]);

  return (
    <SerieComponent rows={filteredRows} sortAscending={sortAscending} sortCriteria={sortCriteria} onSort={onSort} onFavoriteToggle={onFavoriteToggle} />
  );
};
