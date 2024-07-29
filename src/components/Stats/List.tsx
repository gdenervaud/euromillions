


import { createUseStyles } from "react-jss";

import { SortCriteria, ItemStats } from "../../helpers/DrawHelper";
import { SortButton } from "./SortButton";
import { Row } from "./Row";

const useStyles = createUseStyles({
  container: {
    "& + $container": {
      marginTop: "15px"
    }
  }
});

interface ListProps {
  rows: ItemStats[];
	onFavoriteToggle: (value?: number, add?: boolean) => void;
	sortAscending: boolean;
	sortCriteria: SortCriteria;
	onSort: (criteria: SortCriteria) => void;
}

export const List =  ({ rows, onFavoriteToggle, sortAscending, sortCriteria, onSort}: ListProps) => {

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
          <Row key={row.value} row={row} onFavoriteToggle={onFavoriteToggle} />
        ))}
      </tbody>
    </table>
  );
};