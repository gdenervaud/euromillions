import React, { useRef } from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Scrollbars } from "react-custom-scrollbars";

import { Favorites } from "./Favorites";

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
  draws: {
    padding: "0 20px 20px 20px",
    "& > ul": {
      listStyleType: "none",
      margin: 0,
      padding: 0,
      "& > li": {
        display: "block",
        "& + li ": {
          marginTop: "20px"
        }
      }
    }
  }
});

export const Draws = ({ draws, favorites, DrawComponent, canEdit, onAddDraw, onSaveDraw, onDeleteDraw, onResetFavorites }) => {

  const classes = useStyles();

  const scrollIntoViewRef = useRef();

  return (
    <div className={classes.container}>
      <div>
        <Favorites favorites={favorites} onReset={onResetFavorites} />
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
                  <DrawComponent draw={draw} favorites={favorites} canEdit={canEdit} onSave={onSaveDraw} onDelete={onDeleteDraw} />
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