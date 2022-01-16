import React from "react";
import { createUseStyles } from "react-jss";

import { FavoriteIcon } from "./FavoriteIcon";

const useStyles = createUseStyles({
  valueBtn: {
    display: "inline-block",
    margin: 0,
    padding: 0,
    border: 0,
    background: "transparent",
    userSelect: "none",
    outline: 0,
    transition: "all 0.3s ease-in-out",
    "-webkit-tap-highlight-color": "transparent",
    "&:hover": {
      transform: "scale(1.2)",
      "& .number": {
        boxShadow: "1px 1px 2px #8f8a8a"
      }
    }
  },
  value: {
    display: "inline-block",
    position: "relative",
    margin: "6px",
    fontSize: "20px",
    fontWeight: "bold",
    verticalAlign: "middle"
  },
  favorite: {
    position: "absolute",
    top: "5px",
    right: "-5px"
  }
});

export const Value = ({ value, checked, isFavorite, readOnly, Component, onClick, onFavorite }) => {

  const classes = useStyles();

  if (readOnly) {
    if (typeof onFavorite !== "function") {
      return (
        <div className={classes.value} >
          <Component value={value} checked={checked} />
          <FavoriteIcon className={classes.favorite} show={isFavorite} />
        </div>
      );
    }

    const handleCLick = () => {
      onFavorite(value, !isFavorite);
    };

    return (
      <button type="button" className={`${classes.valueBtn} ${classes.value}`} onClick={handleCLick} >
        <Component value={value} checked={checked} />
        <FavoriteIcon className={classes.favorite} show={isFavorite} />
      </button>
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
