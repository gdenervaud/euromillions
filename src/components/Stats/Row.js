
import React from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Value } from "../Value";

const useStyles = createUseStyles({
  row: {
    "& > td": {
      textAlign: "center"
    }
  },
  barPnl: {
    background: "rgba(0,0,0,0.1)",
    position: "relative",
    width: "100%",
    height: "30px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "0 5px",
    borderRadius: "100px"
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
  },
  arrow: {
    display: "inline-block",
    marginLeft: "6px",
    "&.arrow-trend2": {
      transform: "rotate(-90deg)",
      color: "lime"
    },
    "&.arrow-trend1": {
      transform: "rotate(-45deg)",
      color: "lime"
    },
    "&.arrow-trend-1": {
      transform: "rotate(45deg)",
      color: "red"
    },
    "&.arrow-trend-2": {
      transform: "rotate(90deg)",
      color: "red"
    }
  }
});


export const Row = ({ row: {value, success, numberOfDraws, percentageOfSuccesses, trend, isFavorite, Component}, onFavoriteToggle}) => {

  const classes = useStyles();

  return (
    <tr className={classes.row}>
      <td>
        <Value Component={Component} value={value} checked={true} isFavorite={isFavorite} readOnly={true} onFavorite={onFavoriteToggle} />
      </td>
      <td style={{width: "100%"}}>
        <div className={classes.barPnl}>
          <div className={classes.bar} style={{width: `${percentageOfSuccesses * 100}%`}}>
            <div className={`${classes.barValue} ${percentageOfSuccesses > 0.5?"inside":""}`}>{success} / {numberOfDraws}</div>
          </div>
        </div>
      </td>
      <td>
        <div className={`${classes.arrow} arrow-trend${trend}`}>
          <FontAwesomeIcon icon="arrow-right" size="2x" />
        </div>
      </td>
    </tr>
  );
};
