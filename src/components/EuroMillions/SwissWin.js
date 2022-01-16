import React from "react";
import { createUseStyles } from "react-jss";

import { Number as Component } from "../Number";

const useStyles = createUseStyles({
  swissWin: {
    borderRadius: "50%",
    backgroundColor: "white",
    color: "red",
    boxShadow: "0 5px 10px 0 hsl(0deg 0% 75% / 50%)",
    "&.checked": {
      backgroundColor: "red",
      color: "white"
    }
  },
});

export const SwissWin = ({ value, checked}) => {

  const classes = useStyles();

  return (
    <Component value={value} checked={checked} className={classes.swissWin} />
  );
};
