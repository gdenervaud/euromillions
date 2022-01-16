import React from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = createUseStyles({
  favorite: {
    display: "inline-block",
    verticalAlign: "text-top",
    width: "18px",
    height: "16px"
  },
  favoritePnl: {
    position: "relative"
  },
  favoriteShadow: {
    position: "absolute",
    top: 0,
    right: 0,
    color: "black"
  },
  favoriteColor: {
    position: "absolute",
    top: 0,
    right: 0,
    color: "yellow",
    transform: "scale(0.9) translate(-1px, -1px)"
  },
  close: {
    position: "absolute",
    top: 0,
    right: 0
  }
});

export const FavoriteIcon = ({className, show=true}) => {
  const classes = useStyles();
  if (!show) {
    return null;
  }
  return (
    <div className={`${classes.favorite} ${className?className:""}`}>
      <div className={classes.favoritePnl}>
        <FontAwesomeIcon icon="star" className={classes.favoriteShadow} />
        <FontAwesomeIcon icon="star" className={classes.favoriteColor} />
      </div>
    </div>
  );
};
