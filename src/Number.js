import React from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = createUseStyles({
  valueBtn: {
    display: "inline-block",
    margin: 0,
    padding: 0,
    border: 0,
    background: "transparent",
    userSelect: "none",
    outline: 0,
    "-webkit-tap-highlight-color": "transparent",
    "& $number:hover": {
      boxShadow: "1px 1px 2px #8f8a8a"
    }
  },
  value: {
    display: "inline-block",
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
  },
  star: {
    position: "relative",
    height: "50px",
    width: "50px",
    lineHeight: "50px",
    "& svg": {
      position: "absolute",
      top: 0,
      left: "50%",
      color: "white",
      transform: "translate(-50%, 3px) scale(1.2)"
    },
    "& div": {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
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

export const Value = ({ value, checked, readOnly, Component, onClick }) => {

  const classes = useStyles();

  if (readOnly) {
    return (
      <div className={classes.value} >
        <Component value={value} checked={checked} />
      </div>
    );
  }

  const handleCLick = () => {
    onClick(value, !checked);
  };

  return (
    <button type="button" className={`${classes.valueBtn} ${classes.value}`} onClick={handleCLick} >
      <Component value={value} checked={checked} />
    </button>
  );
};

export const Number = ({ value, checked}) => {

  const classes = useStyles();

  return (
    <div className={`${classes.number} ${checked?" checked":""}`}>{value}</div>
  );
};

export const Star = ({ value, checked }) => {

  const classes = useStyles();

  return (
    <div className={`${classes.star} ${checked?" checked":""}`}>
      <FontAwesomeIcon icon="star" size="2x"/>
      <div>{value}</div>
    </div>
  );
};
