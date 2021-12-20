import React, { useState, useRef } from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Scrollbars } from "react-custom-scrollbars";

import { Value } from "./Number";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    width: "100% ",
    height: "100%",
    display: "grid",
    gridTemplateRows: "min-content 1fr",
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
  },
  draw: {
    position: "relative",
    width: "100% ",
    height: "100%",
    padding: "10px 5px",
    border: "1px solid #dee2e6",
    borderRadius: "4px",
    background: "linear-gradient( 0deg,#f8f8f8,#fff)",
    overflow: "hidden",
    "@media screen and (min-width:1024px)": {
      padding: "20px"
    }
  },
  drawHead: {
    position: "relative",
    paddingBottom: "20px",
    "&.readOnly": {
      paddingBottom: "10px",
    }
  },
  label: {
    marginLeft: "10px",
    fontSize: "18px"
  },
  date: {
    display: "inline-block",
    position: "relative",
    margin: 0,
    padding: "0.375rem",
    border: "1px solid #4d4d4d",
    borderRadius: "2px",
    backgroundColor: "white",
    "&[readOnly]": {
      padding: 0,
      border: 0,
      backgroundColor: "transparent",
      fontSize: "18px",
      maxWidth: "150px",
      cursor: "text",
      "&:focus": {
        outline: 0
      },
    }
  },
  deleteBtn: {
    position: "absolute",
    top: "-5px",
    right: "5px",
    margin: 0,
    padding: "0.375rem 0.75rem",
    border: 0,
    background: "transparent",
    fontSize: "x-large",
    "&:hover": {
      boxShadow: "1px 1px 2px #8f8a8a"
    },
    "@media screen and (min-width:1024px)": {
      top: "-15px",
      right: "-10px",
      padding: "1px 6px"
    }
  },
  confirmDeleteBtn: {
    position: "absolute",
    top: "-3px",
    right: "-130px",
    padding: "0.65rem 0.75rem",
    transition: "right 0.3s ease-in-out",
    "&.active": {
      right: 0
    },
    "@media screen and (min-width:1024px)": {
      top: "-10px",
      right: "-140px",
      padding: "0.375rem 0.75rem",
      "&.active": {
        right: "-10px"
      }
    }
  },
  editBtn: {
    margin: 0,
    position: "absolute",
    bottom: "10px",
    right: "10px",
    border: 0,
    background: "transparent",
    fontSize: "x-large",
    "&.active": {
      color: "#28a745"
    },
    "&:hover": {
      boxShadow: "1px 1px 2px #8f8a8a"
    }
  },
  editBtns: {
    padding: "10px 10px 5px 0",
    textAlign: "right",
    "@media screen and (min-width:1024px)": {
      padding: "10px 0 0 0",
    },
    "& > button": {
      padding: "0.65rem 0.75rem",
      "@media screen and (min-width:1024px)": {
        padding: "0.375rem 0.75rem",
      }
    },
    "& button + button": {
      marginLeft: "20px"
    }
  },
  list: {
    "& ul": {
      listStyleType: "none",
      padding: 0,
      "& > li": {
        display: "inline-block"
      }
    },
    "& $list": {
      paddingTop: "5px"
    }
  }
});

export const Draw = ({
  date,
  list1,
  list2,
  readOnly,
  isNew,
  list1ItemComponent,
  list2ItemComponent,
  onDateChange,
  onList1ItemClick,
  onList2ItemClick,
  onEdit,
  onSave,
  onDelete,
  onCancelEdit
}) => {

  const [deleteMode, setDeleteMode] = useState(false);

  const classes = useStyles();

  const handleSetDeletable = e => {
    e && e.stopPropagation();
    setDeleteMode(true);
  };

  return (
    <div className={classes.draw} onClick={() => setDeleteMode(false)}>
      <div className={`${classes.drawHead} ${readOnly?"readOnly":""}`} >
        <span className={classes.label}>Tirage du </span>
        <input className={`form-check-input ${classes.date}`} type="date" value={date} onChange={e => onDateChange(e.target.value)} readOnly={readOnly} />
        {!readOnly && !isNew &&
          <>
            <button className={classes.deleteBtn} type="button" onClick={handleSetDeletable}><FontAwesomeIcon icon="trash-alt" title="supprimer le tirage" /></button>
            <button className={`btn btn-danger ${classes.confirmDeleteBtn} ${deleteMode?"active":""}`} type="button" onClick={onDelete}><FontAwesomeIcon icon="trash-alt" title="supprimer le tirage" /> Supprimer</button>
          </>
        }
      </div>
      <div className={classes.list}>
        <ul>
          {!!list1.length && list1.map(item => (
            <li key={item.value}>
              <Value Component={list1ItemComponent} value={item.value} checked={item.checked} readOnly={item.readOnly} onClick={onList1ItemClick} />
            </li>
          ))}
        </ul>
      </div>
      <div className={classes.list}>
        <ul>
          {!!list2.length && list2.map(item => (
            <li key={item.value}>
              <Value Component={list2ItemComponent} value={item.value} checked={item.checked} readOnly={item.readOnly} onClick={onList2ItemClick} />
            </li>
          ))}
        </ul>
      </div>
      {readOnly?
        <button className={classes.editBtn} type="button" onClick={onEdit}><FontAwesomeIcon icon={"pencil-alt"} title={"editer le tirage"} /></button>
        :
        <div className={classes.editBtns}>
          <button className="btn btn-secondary" type="button" onClick={onCancelEdit}><FontAwesomeIcon icon="undo-alt" title={isNew?"Annuler la création du tirage":"annuler les changements"} /> Annuler</button>
          <button className="btn btn-primary" type="button" onClick={onSave}><FontAwesomeIcon icon="check" title="sauvegarder le tirage" /> Sauvegarder</button>
        </div>
      }
    </div>
  );
};

export const Draws = ({ draws, DrawComponent, onAddDraw, onSaveDraw, onDeleteDraw }) => {

  const classes = useStyles();

  const scrollIntoViewRef = useRef();

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <button className="btn btn-primary" type="button" onClick={onAddDraw}><FontAwesomeIcon icon="plus" title="ajouter un draw" /> Ajouter un tirage</button>
      </div>
      <div>
        <Scrollbars autoHide ref={scrollIntoViewRef}>
          <div className={classes.draws} >
            <ul ref={scrollIntoViewRef}>
              {draws.map((draw, index) => (
                <li key={`${draw.date}-${index}`} >
                  <DrawComponent draw={draw} onSave={onSaveDraw} onDelete={onDeleteDraw} />
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