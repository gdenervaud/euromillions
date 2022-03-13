import React, { FC, useState, useRef, useMemo } from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Scrollbars } from "react-custom-scrollbars";

import { Draw, DrawProps, Favorite, FavoritesFilter } from "../../helpers/DrawHelper";
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
    padding: "15px 10px 15px 10px",
    "& > button": {
      padding: "0.65rem 0.75rem",
      "@media screen and (min-width:1024px)": {
        padding: "0.375rem 0.75rem"
      }
    },
    "@media screen and (min-width:1024px)": {
      padding: "20px"
    }
  },
  favoritesFilter: {
    padding: "15px 10px 0px 10px",
    "@media screen and (min-width:1024px)": {
      padding: "20px 20px 0px 20px"
    }
  },
  draws: {
    padding: "0 10px",
    "& > ul": {
      listStyleType: "none",
      margin: 0,
      padding: 0,
      "& > li": {
        display: "block"
      }
    },
    "@media screen and (min-width:1024px)": {
      padding: "0 20px",
    }
  },
  noDraws: {
    padding: "20px",
    textAlign: "center"
  },
  noDrawsMatching: {
    padding: "20px",
    textAlign: "center"
  }
});

interface DrawsProps<DrawType extends Draw> {
  draws: DrawType[];
  favorites: Favorite[];
	DrawComponent: FC<DrawProps<DrawType>>;
	canEdit: boolean;
	onAddDraw: () => void;
	onSaveDraw: (draw: DrawType) => void;
	onDeleteDraw: (draw: DrawType) => void;
	onResetFavorites: () => void;
	isDrawMatching: (draw: DrawType, favoritesFilter: FavoritesFilter, favorites: Favorite[]) => boolean;
}

export const Draws = <DrawType extends Draw, >(
  { draws, favorites, DrawComponent, canEdit, onAddDraw, onSaveDraw, onDeleteDraw, onResetFavorites, isDrawMatching}: DrawsProps<DrawType>
) => {

  const classes = useStyles();

  const scrollIntoViewRef = useRef(null);

  const [favoritesFilter, setFavoritesFilter] = useState(FavoritesFilter.off);

  const hasDraws = Array.isArray(draws) && !!draws.length;

  const hasFavorites = useMemo(() => Array.isArray(favorites) && favorites.some(f => Array.isArray(f.list) && f.list.length), [favorites]);

  const hasFilteredDraws =  useMemo(() => !hasDraws || !hasFavorites || draws.some(draw => isDrawMatching(draw, favoritesFilter, favorites)), [draws, favorites, hasDraws, hasFavorites, favoritesFilter, isDrawMatching]);

  const handleOnChange = (value: unknown): void => setFavoritesFilter(value as FavoritesFilter);

  return (
    <div className={classes.container}>
      <div>
        {hasDraws && hasFavorites && (
          <>
            <Favorites favorites={favorites} onReset={onResetFavorites} />
            <Toggle
              className={classes.favoritesFilter}
              value={favoritesFilter}
              items={[
                {
                  value: FavoritesFilter.all,
                  label: "Les tirages avec tous les favoris",
                  icon: "star",
                  activeColor: "yellow",
                  inactiveColor: "rgb(224, 224, 224)"
                },
                {
                  value: FavoritesFilter.some,
                  label: "Les tirages avec au moins un favoris",
                  icon: "star-half-alt",
                  activeColor: "yellow",
                  inactiveColor: "rgb(224, 224, 224)"
                },
                {
                  value: FavoritesFilter.off,
                  label: "Tous les tirages",
                  icon: "circle",
                  activeColor: "#40a9f3",
                  inactiveColor: "rgb(224, 224, 224)"
                }
              ]}
              onChange={handleOnChange}
            />
          </>
        )}
      </div>
      <div className={classes.header}>
        {canEdit && (
          <button className="btn btn-primary" onClick={onAddDraw}><FontAwesomeIcon icon="plus" title="ajouter un draw" /> Ajouter un tirage</button>
        )}
      </div>
      <div>
        <Scrollbars autoHide>
          <div className={classes.draws} >
            {!hasDraws && (
              <div className={classes.noDraws}>
                <FontAwesomeIcon icon={"exclamation-triangle"} /> Aucun tirage
              </div>
            )}
            {!hasFilteredDraws && (
              <div className={classes.noDrawsMatching}>
                <FontAwesomeIcon icon={"exclamation-triangle"} /> Aucun tirage ne correspond au filtre
              </div>
            )}
            <ul ref={scrollIntoViewRef}>
              {draws.map((draw, index) => (
                <li key={`${draw.date}-${index}`} >
                  <DrawComponent draw={draw} favorites={favorites} canEdit={canEdit} onSave={onSaveDraw} onDelete={onDeleteDraw} favoritesFilter={hasFavorites?favoritesFilter:undefined} />
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