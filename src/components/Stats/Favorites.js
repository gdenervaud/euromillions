import React from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Value } from "../Value";
import { FavoriteIcon } from "../FavoriteIcon";


const useStyles = createUseStyles({
  container: {
    position: "relative",
    border: "1px solid lightgrey",
    margin: "15px 0",
    padding: "15px 10px 10px 10px",
    borderRadius: "15px",
    "& ul": {
      listStyleType: "none",
      margin: 0,
      padding: 0,
      "& > li": {
        display: "inline-block"
      }
    },
  },
  title: {
    position: "absolute",
    top: "-12px",
    left: "15px",
    "& > div": {
      position: "relative",
      background: "white",
      padding: "0 6px"
    }
  },
  favorite: {
    color: "yellow",
  },
  closeBtn: {
    position: "absolute",
    top: "-20px",
    right: "-20px",
    margin: 0,
    padding: "0.15rem 0.75rem",
    border: 0,
    borderRadius: "50%",
    background: "white",
    fontSize: "x-large",
    color: "#454545",
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "1px 1px 2px #8f8a8a"
    },
    "@media screen and (min-width:1024px)": {
      top: "-18px",
      right: "-18px",
      padding: "1px 11px"
    }
  }
});

export const Favorites = ({ favorites, favoriteComponent, onFavoriteClick }) => {

  const classes = useStyles();

  const handleRemoveFavorites = () => onFavoriteClick();

  if (!Array.isArray(favorites) || !favorites.length) {
    return null;
  }

  return (
    <div className={classes.container}>
      <ul>
        {favorites.map(favorite => (
          <li key={favorite}>
            <Value Component={favoriteComponent} value={favorite} checked={true} isFavorite={true} readOnly={true} onFavorite={onFavoriteClick} />
          </li>
        ))}
      </ul>
      <div className={classes.title}>
        <div>
          <FavoriteIcon />
          <span> Favoris</span>
        </div>
      </div>
      <button className={classes.closeBtn} onClick={handleRemoveFavorites} title="Supprimer tous les favoris"><FontAwesomeIcon icon="times" /></button>
    </div>
  );
};
