

import React, { FC, useMemo } from "react";

import { Draw, ItemStats, SmoothingMethod, SortCriteria, getDrawsStats, sortValuesStats } from "../../helpers/DrawHelper";
import { ValueComponentProps } from "../Value";
import { Grid } from "./Grid";
import { List } from "./List";

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
  showAsGrid: boolean;
  columns: number;
}

export const Serie = <DrawType extends Draw, >({ draws, maxValue, drawSize, favorites, itemComponent, getValue, onFavoriteToggle, period, smoothing, smoothingMethod, sortAscending, sortCriteria, onSort, showOnlyFavorites, showAsGrid, columns}: SerieProps<DrawType>) => {

  const values = useMemo(() => getDrawsStats(maxValue, drawSize, draws, getValue, period, smoothing), [maxValue, drawSize, draws, getValue, period, smoothing]);
  const items = useMemo(() => sortValuesStats(values, sortCriteria, sortAscending, smoothingMethod)
    .map(row => (
      {
        ...row,
        isFavorite: favorites.includes(row.value),
        Component: itemComponent,
        smoothingMethod: smoothingMethod
      }
    )) as ItemStats[], [values, sortCriteria, sortAscending, smoothingMethod, favorites, itemComponent]);

  const filteredItems = useMemo(() => items.filter(row => (!showAsGrid && showOnlyFavorites && favorites.length)?row.isFavorite:true), [items, favorites, showOnlyFavorites]);

  if (showAsGrid) {
    return (
      <Grid items={items} onFavoriteToggle={onFavoriteToggle} theme={{columns: columns}} />
    );
  }

  return (
    <List rows={filteredItems} sortAscending={sortAscending} sortCriteria={sortCriteria} onSort={onSort} onFavoriteToggle={onFavoriteToggle} />
  );
};
