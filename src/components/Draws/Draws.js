import React, { useState, useRef } from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Scrollbars } from "react-custom-scrollbars";

import { Favorites } from "./Favorites";
import Toggle from "../Toggle";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    width: "100% ",
    height: "100%",
    display: "grid",
    gridTemplateRows: "min-content min-content 1fr",
    gridTemplateColumns: "1fr"
  },
  header: {
    padding: "20px",
    "& > button": {
      padding: "0.65rem 0.75rem",
      "@media screen and (min-width:1024px)": {
        padding: "0.375rem 0.75rem",
      }
    }
  },
  favoritesFilter: {
    padding: "20px 20px 0px 20px"
  },
  draws: {
    padding: "0 20px",
    "& > ul": {
      listStyleType: "none",
      margin: 0,
      padding: 0,
      "& > li": {
        display: "block"
      }
    }
  }
});

export const Draws = ({ draws, favorites, DrawComponent, canEdit, onAddDraw, onSaveDraw, onDeleteDraw, onResetFavorites }) => {

  const classes = useStyles();

  const scrollIntoViewRef = useRef();

  const [favoritesFilter, setFavoritesFilter] = useState(null);

  const hasFavorites = Array.isArray(favorites) && favorites.some(f => Array.isArray(f.list) && f.list.length);

  return (
    <div className={classes.container}>
      <div>
        {hasFavorites && (
          <>
            <Favorites favorites={favorites} onReset={onResetFavorites} />
            <Toggle
              className={classes.favoritesFilter}
              value={favoritesFilter}
              items={[
                {
                  value: "all",
                  label: "Afficher uniquement les tirages contenant tous les favoris",
                  icon: "star",
                  activeColor: "yellow",
                  inactiveColor: "rgb(224, 224, 224)"
                },
                {
                  value: "some",
                  label: "Afficher uniquement les tirages contenant un favoris",
                  icon: "star-half-alt",
                  activeColor: "yellow",
                  inactiveColor: "rgb(224, 224, 224)"
                },
                {
                  value: null,
                  label: "Afficher tous les tirages",
                  icon: "times",
                  activeColor: "red",
                  inactiveColor: "rgb(224, 224, 224)"
                }
              ]}
              onChange={setFavoritesFilter}
            />
          </>
        )}
      </div>
      <div className={classes.header}>
        {canEdit && (
          <button className="btn btn-primary" type="button" onClick={onAddDraw}><FontAwesomeIcon icon="plus" title="ajouter un draw" /> Ajouter un tirage</button>
        )}
      </div>
      <div>
        <Scrollbars autoHide>
          <div className={classes.draws} >
            <ul ref={scrollIntoViewRef}>
              {draws.map((draw, index) => (
                <li key={`${draw.date}-${index}`} >
                  <DrawComponent draw={draw} favorites={favorites} canEdit={canEdit} onSave={onSaveDraw} onDelete={onDeleteDraw} favoritesFilter={favoritesFilter} />
                </li>
              ))}
            </ul>
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default Draws;