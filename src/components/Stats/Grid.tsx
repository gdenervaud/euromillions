


import { createUseStyles } from "react-jss";

import { ItemStats } from "../../helpers/DrawHelper";
import { Item } from "./Item";

interface Theme {
  columns?: number
}

const useStyles = createUseStyles((theme: Theme) => ({
  container: {
    display: theme.columns?"grid":"block",
    gridTemplateColumns: theme.columns?`repeat(${theme.columns}, 1fr)`:"unset",
    "& + $container": {
      marginTop: "15px"
    },
    "@media screen and (min-width:420px)": {
      gridTemplateColumns: theme.columns?`repeat(${theme.columns}, max-content)`:"unset",
    }
  }
}));

interface GridProps {
  items: ItemStats[];
	onFavoriteToggle: (value?: number, add?: boolean) => void;
  theme?: Theme;
}

export const Grid =  ({ items, onFavoriteToggle, theme={}}: GridProps) => {

  const classes = useStyles({theme: theme});

  return (
    <div className={classes.container}>
      {items.map(item => (
        <Item key={item.value} item={item} onFavoriteToggle={onFavoriteToggle} />
      ))}
    </div>
  );
};