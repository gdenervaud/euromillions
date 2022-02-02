import React from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = createUseStyles({
  arrow: {
    display: "inline-block",
    marginLeft: "6px",
    "&.arrow-trend2": {
      transform: "rotate(-90deg)",
      color: "lime"
    },
    "&.arrow-trend1": {
      transform: "rotate(-45deg)",
      color: "greenyellow"
    },
    "&.arrow-trend-1": {
      transform: "rotate(45deg)",
      color: "darkorange"
    },
    "&.arrow-trend-2": {
      transform: "rotate(90deg)",
      color: "red"
    }
  },
});

export const TrendArrow = ({ trend }) => {

  const classes = useStyles();

  return (
    <div className={`${classes.arrow} arrow-trend${trend}`}>
      <FontAwesomeIcon icon="arrow-right" size="2x" />
    </div>
  );
};
