import React from "react";
import { createUseStyles } from "react-jss";

import { StylableValueComponentProps } from "./Value";

const useStyles = createUseStyles({
  number: {
    position: "relative",
    height: "50px",
    width: "50px",
    lineHeight: "50px",
    borderRadius: "50%",
    backgroundColor: "white",
    color: "#001367",
    textAlign: "center",
    //boxShadow: "inset 0 1px 2px 0 rgba(0,0,0,.5)",
    boxShadow: "0 5px 10px 0 hsl(0deg 0% 75% / 50%)",
    "&.checked": {
      backgroundColor: "#001367",
      color: "white"
    }
  }
});

export const Number = ({ value, checked=false, className}: StylableValueComponentProps) => {

  const classes = useStyles();

  return (
    <div className={`number ${classes.number} ${className?className:""} ${checked?" checked":""}`}>{value}</div>
  );
};
