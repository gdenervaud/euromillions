import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  value: {
    display: "inline-block",
    position: "relative",
    margin: "6px",
    fontSize: "20px",
    fontWeight: "bold",
    verticalAlign: "middle"
  },
  number: {
    position: "relative",
    height: "50px",
    width: "50px",
    lineHeight: "50px",
    borderRadius: "50%",
    backgroundColor: "white",
    color: "#001367",
    textAlign: "center",
    boxShadow: "0 5px 10px 0 hsl(0deg 0% 75% / 50%)",
    "&.checked": {
      backgroundColor: "#001367",
      color: "white"
    }
  }
});

export const Number = ({ value, checked, className}) => {

  const classes = useStyles();

  return (
    <div className={`number ${classes.number} ${className?className:""} ${checked?" checked":""}`}>{value}</div>
  );
};
