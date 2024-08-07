import { FC } from "react";
import { createUseStyles } from "react-jss";

import { ValueComponentProps } from "../Value";
import { Number as Component } from "../Number";

const useStyles = createUseStyles({
  swissWin: {
    borderRadius: "50% !important",
    backgroundColor: "white !important",
    color: "red !important",
    //boxShadow: "inset 0 1px 2px 0 rgba(0,0,0,.5)",
    boxShadow: "0 5px 10px 0 hsl(0deg 0% 75% / 50%) !important",
    "&.checked": {
      backgroundColor: "red !important",
      backgroundImage: "linear-gradient(to bottom,#c60b12,#94080d),linear-gradient(#e4c95b,#e4c95b)",
      color: "white !important"
    }
  },
});

export const SwissWin: FC<ValueComponentProps> = ({ value, checked}) => {

  const classes = useStyles();

  return (
    <Component value={value} checked={checked} className={classes.swissWin} />
  );
};
