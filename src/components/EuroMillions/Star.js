import React from "react";
import { createUseStyles } from "react-jss";

import { Star as Component } from "../Star";

const useStyles = createUseStyles({
  star: {
    "& svg": {
      color: "white"
    },
    "& div": {
      color: "#eebb05"
    },
    "&.checked": {
      "& svg": {
        color: "#eebb05"
      },
      "& div": {
        color: "white"
      }
    }
  }
});

export const Star = ({ value, checked}) => {

  const classes = useStyles();

  return (
    <Component value={value} checked={checked} className={classes.star} />
  );
};
