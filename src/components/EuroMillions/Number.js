import React from "react";
import { createUseStyles } from "react-jss";

import { Number as Component } from "../Number";

const useStyles = createUseStyles({
  number: {
    borderRadius: "50%",
    backgroundColor: "white",
    color: "#001367",
    boxShadow: "0 5px 10px 0 hsl(0deg 0% 75% / 50%)",
    "&.checked": {
      backgroundColor: "#001367",
      color: "white"
    }
  }
});

export const Number = ({ value, checked}) => {

  const classes = useStyles();

  return (
    <Component value={value} checked={checked} className={classes.number} />
  );
};
