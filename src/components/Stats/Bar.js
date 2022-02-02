import React from "react";
import { createUseStyles } from "react-jss";
const useStyles = createUseStyles({
  container: {
    position: "relative",
    width: "100%"
  },
  bar: {
    position: "relative",
    width: 0,
    height: "20px",
    boxShadow: "0 10px 40px -10px #000",
    borderRadius: "100px",
    background: "linear-gradient(to bottom, #A3E2EF 35%, #4F9CC0)"
  },
  barValue: {
    position: "absolute",
    top: "-2px",
    left: "calc(100% + 6px)",
    whiteSpace: "nowrap",
    textAlign: "right",
    "&.inside": {
      left: "calc(100% - 10px)",
      transform: "translateX(-100%)"
    }
  }
});


export const Bar = ({ className, value, total, percentage }) => {

  const classes = useStyles();

  return (
    <div className={`${classes.container} ${className?className:""}`}>
      <div className={classes.bar} style={{width: `${percentage * 100}%`}}>
        <div className={`${classes.barValue} ${percentage > 0.5?"inside":""}`}>{value} / {total}</div>
      </div>
    </div>
  );
};
