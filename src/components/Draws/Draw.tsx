import React, { FC, FormEvent, useState } from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {ValueComponentProps} from "../Value";
import { Loader } from "../Loader";
import { Value } from "../Value";

interface Theme {
  color?: string;
  backgroundImage?: string,
}

const useStyles = createUseStyles((theme: Theme) => ({
  container: {
    position: "relative",
    width: "100% ",
    height: "100%",
    marginBottom: "15px",
    overflow: "hidden",
    "&.readOnly": {
      "& $header $label:after": {
        content: "\" \"",
        display: "block",
        position: "absolute",
        width: "20px",
        height: "16px",
        left: "207px",
        top: "15px",
        background: theme.color?theme.color: "#001367",
        backgroundImage: theme.backgroundImage?theme.backgroundImage: "unset",
        zIndex: 1
      }
    },
    "@media screen and (min-width:1024px)": {
      marginBottom: "20px",
    }
  },
  header: {
    position: "relative",
    padding: "12px 20px",
    borderTopRightRadius: "4px",
    borderTopLeftRadius: "4px",
    background: theme.color?theme.color: "#001367",
    backgroundImage: theme.backgroundImage?theme.backgroundImage: "unset",
    color: "white",
    fontSize: "18px",
    lineHeight: "18px"
  },
  body: {
    position: "relative",
    padding: "10px", /* 15px 20px 15px 20px */
    border: "1px solid #dee2e6", /* #1f485e; */
    borderTop: 0,
    borderBottomRightRadius: "4px",
    borderBottomLeftRadius: "4px",
    background: "linear-gradient(0deg,#f8f8f8,#fff)"
  },
  label: {
    fontSize: "18px"
  },
  date: {
    display: "inline-block",
    position: "relative",
    width: "auto",
    margin: 0,
    padding: "0.375rem",
    border: "1px solid black",
    borderRadius: "2px",
    backgroundColor: "white",
    lineHeight: "20px",
    "&[readOnly]": {
      padding: 0,
      border: 0,
      backgroundColor: "transparent",
      color: "white",
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
    bottom: "15px",
    left: "18px",
    margin: 0,
    padding: "0.375rem 0.75rem",
    border: 0,
    background: "transparent",
    fontSize: "x-large",
    color: "#454545",
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "1px 1px 2px #8f8a8a"
    },
    "@media screen and (min-width:1024px)": {
      bottom: "10px"
    }
  },
  confirmDeleteBtn: {
    position: "absolute",
    bottom: "15px",
    left: "-130px",
    padding: "0.65rem 0.75rem",
    transition: "left 0.3s ease-in-out",
    "&.active": {
      left: "15px"
    },
    "@media screen and (min-width:1024px)": {
      bottom: "10px",
      left: "-140px",
      padding: "0.375rem 0.75rem",
      "&.active": {
        left: "25px"
      }
    }
  },
  editBtn: {
    position: "absolute",
    top: "4px",
    right: "6px",
    margin: "0",
    padding: "8px",
    border: 0,
    background: "transparent",
    color: "white",
    fontSize: "x-large",
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "1px 1px 2px black"
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
    },
    "&.inline": {
      display: "inline",
      "& ul": {
        display: "inline"
      }
    }
  }
}));

export interface Item {
  value: number,
  checked?: boolean,
  readOnly?: boolean,
  isFavorite?: boolean
}

export interface List {
  items: Item[];
  itemComponent: FC<ValueComponentProps>;
  onItemClick: (value: number, add?: boolean) => void;
  onItemFavorite: (value: number, add?: boolean) => void;
  inline?: boolean;
}

interface DrawProps {
  date: string;
  lists: List[];
  canEdit?: boolean;
  readOnly?: boolean;
  isNew?: boolean;
  onDateChange: (date: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onCancelEdit: () => void;
  isSaving?: boolean;
  isDeleting?: boolean;
  theme: Theme;
}

export const Draw = ({
  date,
  lists,
  canEdit=false,
  readOnly=true,
  isNew=false,
  onDateChange,
  onEdit,
  onSave,
  onDelete,
  onCancelEdit,
  isSaving=false,
  isDeleting=false,
  theme={}
}: DrawProps) => {

  const [deleteMode, setDeleteMode] = useState(false);

  const classes = useStyles({theme: theme});

  const handleSetDeletable = (e: FormEvent<HTMLButtonElement>) => {
    e && e.stopPropagation();
    setDeleteMode(true);
  };

  return (
    <div className={`${classes.container} ${readOnly?"readOnly":""}`} onClick={() => setDeleteMode(false)}>
      <div className={classes.header} >
        <span className={classes.label}>Tirage du </span>
        <input className={`form-control ${classes.date}`} type="date" value={date} aria-label="date du tirage" onChange={e => onDateChange(e.target.value)} readOnly={readOnly} />
        {readOnly && canEdit && !isSaving && !isDeleting && (
          <button className={classes.editBtn} aria-label="editer le tirage" onClick={onEdit}><FontAwesomeIcon icon={"pencil-alt"} title={"editer le tirage"} /></button>
        )}
      </div>
      <div className={classes.body} >
        {lists.map(({items, itemComponent, onItemClick, onItemFavorite, inline}, index) =>
          <div key={index} className={`${classes.list} ${(readOnly && inline)?"inline":""}`}>
            <ul>
              {!!items.length && items.map(item => (
                <li key={item.value}>
                  <Value Component={itemComponent} value={item.value} checked={item.checked} readOnly={item.readOnly} isFavorite={item.isFavorite} onClick={onItemClick} onFavorite={readOnly?onItemFavorite:undefined} />
                </li>
              ))}
            </ul>
          </div>
        )}
        {!readOnly && (
          <>
            {!isNew && (
              <>
                <button className={classes.deleteBtn} aria-label="supprimer le tirage" onClick={handleSetDeletable}><FontAwesomeIcon icon="trash-alt" title="supprimer le tirage" /></button>
                <button className={`btn btn-danger ${classes.confirmDeleteBtn} ${deleteMode?"active":""}`}  aria-label="confirmer la suppression du tirage" onClick={onDelete}><FontAwesomeIcon icon="trash-alt" title="supprimer le tirage" /> Supprimer</button>
              </>
            )}
            <div className={classes.editBtns}>
              <button className="btn btn-secondary" onClick={onCancelEdit}><FontAwesomeIcon icon="undo-alt" title={isNew?"Annuler la création du tirage":"annuler les changements"} /> Annuler</button>
              <button className="btn btn-primary" onClick={onSave}><FontAwesomeIcon icon="check" title="sauvegarder le tirage" /> Sauvegarder</button>
            </div>
          </>
        )}
        {isSaving && (
          <Loader text="Sauvergarde du tirage..." />
        )}
        {isDeleting && (
          <Loader text="Suppression du tirage..." />
        )}
      </div>
    </div>
  );
};
