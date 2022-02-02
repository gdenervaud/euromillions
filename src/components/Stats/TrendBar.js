import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  bar: {
    position: "relative",
    width: "100%",
    display: "flex",
    height: "20px",
    boxShadow: "0 10px 40px -10px #000",
    borderRadius: "100px",
    background: "linear-gradient(to bottom, #A3E2EF 35%, #4F9CC0)",
    overflow: "hidden"
  },
  section: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    "&.from-2to2": {
      background: "linear-gradient(to right, red, lime)"
    },
    "&.from-1to2": {
      background: "linear-gradient(to right, darkorange, lime)"
    },
    "&.from0to2": {
      background: "linear-gradient(to right, rgba(0,0,0,0.1), lime)"
    },
    "&.from1to2": {
      background: "linear-gradient(to right, greenyellow, lime)"
    },
    "&.from2to2": {
      backgroundColor: "lime"
    },
    "&.from-2to1": {
      background: "linear-gradient(to right, red, greenyellow)"
    },
    "&.from-1to1": {
      background: "linear-gradient(to right, darkorange, greenyellow)"
    },
    "&.from0to1": {
      background: "linear-gradient(to right, rgba(0,0,0,0.1), greenyellow)"
    },
    "&.from1to1": {
      backgroundColor: "greenyellow"
    },
    "&.from2to1": {
      background: "linear-gradient(to right, lime, greenyellow)"
    },
    "&.from-2to0": {
      background: "linear-gradient(to right, red, rgba(0,0,0,0.1))"
    },
    "&.from-1to0": {
      background: "linear-gradient(to right, darkorange, rgba(0,0,0,0.1))"
    },
    "&.from0to0": {
      backgroundColor: "rgba(0,0,0,0.1)"
    },
    "&.from1to0": {
      background: "linear-gradient(to right, greenyellow, rgba(0,0,0,0.1))"
    },
    "&.from2to0": {
      background: "linear-gradient(to right, lime, rgba(0,0,0,0.1))"
    },
    "&.from-2to-1": {
      background: "linear-gradient(to right, red, darkorange)"
    },
    "&.from-1to-1": {
      backgroundColor: "darkorange"
    },
    "&.from0to-1": {
      background: "linear-gradient(to right, rgba(0,0,0,0.1), darkorange)"
    },
    "&.from1to-1": {
      background: "linear-gradient(to right, greenyellow, darkorange)"
    },
    "&.from2to-1": {
      background: "linear-gradient(to right, lime, darkorange)"
    },
    "&.from-2to-2": {
      backgroundColor: "red"
    },
    "&.from-1to-2": {
      background: "linear-gradient(to right, darkorange, red)"
    },
    "&.from0to-2": {
      background: "linear-gradient(to right, rgba(0,0,0,0.1), red)"
    },
    "&.from1to-2": {
      background: "linear-gradient(to right, greenyellow, red)"
    },
    "&.from2to-2": {
      background: "linear-gradient(to right, lime, red)"
    }
  }
});

export const TrendBar = ({ className, trends }) => {

  const classes = useStyles();

  if (!Array.isArray(trends) || !trends.length) {
    return null;
  }


  const values = trends.map((v, index) => ({
    from: index === trends.length-1?v.trend:trends[index+1].trend,
    to: v.trend,
    title: `tirage du ${new Date(v.date).toLocaleDateString()}`
  })).reverse();

  return (
    <div className={`${classes.bar} ${className?className:""}`} >
      {values.map(({from, to, title}, index) =>
        <div key={index} className={`${classes.section} from${from}to${to}`} title={title}></div>
      )}
    </div>
  );
};
