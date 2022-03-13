import React, { FC } from "react";
import { createUseStyles } from "react-jss";

import { ValueComponentProps } from "../Value";
import { Number as Component } from "../Number";

const useStyles = createUseStyles({
  number: {
    borderRadius: "50% !important",
    backgroundColor: "white !important",
    color: "#001367 !important",
    //boxShadow: "inset 0 1px 2px 0 rgba(0,0,0,.5)",
    boxShadow: "0 5px 10px 0 hsl(0deg 0% 75% / 50%) !important",
    "&.checked": {
      backgroundColor: "#1f485e !important",
      //backgroundImage: "linear-gradient(to bottom,#7db9e6,#004777),linear-gradient(#e4c95b,#e4c95b)",
      backgroundImage: "linear-gradient(to bottom,#0e587e,#173646),linear-gradient(#eee,#eee)",
      color: "white !important"
    }
  }
});

export const Number: FC<ValueComponentProps> = ({ value, checked}) => {

  const classes = useStyles();

  return (
    <Component value={value} checked={checked} className={classes.number} />
  );
};
