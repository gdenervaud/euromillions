import { FC } from "react";
import { createUseStyles } from "react-jss";

import { ValueComponentProps } from "../Value";
import { Number as Component } from "../Number";

const useStyles = createUseStyles({
  number: {
    height: "45px",
    width: "45px",
    lineHeight: "45px",
    borderRadius: "0 !important",
    backgroundColor: "white !important",
    color: "red !important",
    //boxShadow: "inset 0 1px 2px 0 rgba(0,0,0,.5)",
    boxShadow: "0 5px 10px 0 hsl(0deg 0% 75% / 50%) !important",
    "&.checked": {
      borderRadius: "50% !important",
      backgroundColor: "#c60b12 !important",//"#001367",
      backgroundImage: "linear-gradient(to bottom,#c60b12,#94080d),linear-gradient(#e4c95b,#e4c95b)",
      color: "white !important"
    },
    "@media screen and (min-width:380px)": {
      height: "48px",
      width: "48px",
      lineHeight: "48px"
    },
    "@media screen and (min-width:410px)": {
      height: "50px",
      width: "50px",
      lineHeight: "50px"
    }
  }
});

export const Number: FC<ValueComponentProps> = ({ value, checked}) => {

  const classes = useStyles();

  return (
    <Component value={value} checked={checked} className={classes.number} />
  );
};
