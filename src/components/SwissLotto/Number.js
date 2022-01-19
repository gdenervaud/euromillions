import React from "react";
import { createUseStyles } from "react-jss";

import { Number as Component } from "../Number";

const useStyles = createUseStyles({
  number: {
    borderRadius: "0 !important",
    backgroundColor: "white !important",
    color: "red !important",
    boxShadow: "0 5px 10px 0 hsl(0deg 0% 75% / 50%) !important",
    "&.checked": {
      borderRadius: "50% !important",
      backgroundColor: "#c60b12 !important",//"#001367",
      color: "white !important"
    }
  }
});

export const Number = ({ value, checked}) => {

  const classes = useStyles();

  return (
    <Component value={value} checked={checked} className={classes.number} />
  );
};
