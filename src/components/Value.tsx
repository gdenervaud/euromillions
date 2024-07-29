import { FC, useCallback } from "react";
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
    margin: "2px",
    fontSize: "20px",
    fontWeight: "bold",
    verticalAlign: "middle",
    "@media screen and (min-width:370px)": {
      margin: "3px"
    },
    "@media screen and (min-width:420px)": {
      margin: "6px"
    }
  },
  favorite: {
    position: "absolute",
    top: "5px",
    right: "-5px"
  }
});

export interface ValueComponentProps {
  value: number;
  checked?: boolean;
}

export interface StylableValueComponentProps extends ValueComponentProps {
  className?: string;
}

interface ValueProps {
  value: number;
	checked?: boolean;
	isFavorite?: boolean;
	readOnly?: boolean;
	Component: FC<ValueComponentProps>;
	onClick?: (value: number, add?: boolean) => void;
	onFavorite?: (value: number, add?: boolean) => void;
}

export const Value = ({ value, checked=false, isFavorite=false, readOnly=false, Component, onClick, onFavorite }: ValueProps) => {

  const classes = useStyles();

  const handleFavorite = useCallback(() => {
    onFavorite && onFavorite(value, !isFavorite);
  }, [value, isFavorite, onFavorite]);

  const handleCLick = useCallback(() => {
    onClick && onClick(value, !checked);
  }, [value, checked, onClick]);

  if (readOnly) {
    if (typeof onFavorite !== "function") {
      return (
        <div className={classes.value} >
          <Component value={value} checked={checked} />
          <FavoriteIcon className={classes.favorite} show={isFavorite} />
        </div>
      );
    }

    return (
      <button className={`${classes.valueBtn} ${classes.value}`} title={isFavorite?"Retirer des favoris":"Ajouter aux favoris"} onClick={handleFavorite} >
        <Component value={value} checked={checked} />
        <FavoriteIcon className={classes.favorite} show={isFavorite} />
      </button>
    );
  }

  return (
    <button className={`${classes.valueBtn} ${classes.value}`} title={checked?"Désélectionner":"Sélectionner"} onClick={handleCLick} >
      <Component value={value} checked={checked} />
    </button>
  );
};
