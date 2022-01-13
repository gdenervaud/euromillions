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
    transition: "all 0.3s ease-in-out",
    "-webkit-tap-highlight-color": "transparent",
    "&:hover": {
      transform: "scale(1.2)",
      "& $number": {
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
  },
  favorite: {
    position: "absolute",
    top: "5px",
    right: "-5px"
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
  }
});

const Favorite = ({show}) => {
  const classes = useStyles();
  if (!show) {
    return null;
  }
  return (
    <div className={classes.favorite}>
      <div className={classes.favoritePnl}>
        <FontAwesomeIcon icon="star" className={classes.favoriteShadow} />
        <FontAwesomeIcon icon="star" className={classes.favoriteColor} />
      </div>
    </div>
  );
};

export const Value = ({ value, checked, isFavorite, readOnly, Component, onClick, onFavorite }) => {

  const classes = useStyles();

  if (readOnly) {
    if (typeof onFavorite !== "function") {
      return (
        <div className={classes.value} >
          <Component value={value} checked={checked} />
          <Favorite show={isFavorite} />
        </div>
      );
    }

    const handleCLick = () => {
      onFavorite(value, !isFavorite);
    };

    return (
      <button type="button" className={`${classes.valueBtn} ${classes.value}`} onClick={handleCLick} >
        <Component value={value} checked={checked} />
        <Favorite show={isFavorite} />
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

export const Number = ({ value, checked, className}) => {

  const classes = useStyles();

  return (
    <div className={`${classes.number} ${className?className:""} ${checked?" checked":""}`}>{value}</div>
  );
};

export const Star = ({ value, checked, className }) => {

  const classes = useStyles();

  return (
    <div className={`${classes.star} ${className?className:""} ${checked?" checked":""}`}>
      <FontAwesomeIcon icon="star" size="2x"/>
      <div>{value}</div>
    </div>
  );
};
