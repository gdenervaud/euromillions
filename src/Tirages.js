import React, { useState, useRef } from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Scrollbars } from "react-custom-scrollbars";

import { Value, Number, Star } from "./Number";

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
  tirages: {
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
  tirage: {
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
  tirageHead: {
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
    top: "-1px",
    right: "5px",
    margin: 0,
    border: 0,
    background: "transparent",
    fontSize: "x-large",
    "&:hover": {
      boxShadow: "1px 1px 2px #8f8a8a"
    },
    "@media screen and (min-width:1024px)": {
      top: "-15px",
      right: "-10px"
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
  numbers: {
    "& ul": {
      listStyleType: "none",
      padding: 0,
      "& > li": {
        display: "inline-block"
      }
    }
  },
  stars: {
    paddingTop: "5px",
    "& > ul": {
      listStyleType: "none",
      padding: 0,
      "& > li": {
        display: "inline-block"
      }
    }
  },
});

const Tirage = ({ tirage, isNew, onChange, onDelete }) => {

  const [editable, setEditable] = useState(isNew);
  const [deleteable, setDeleteable] = useState(false);

  const classes = useStyles();

  const handleDateChange = date => {
    onChange({
      ...tirage,
      date: date
    });
  };

  const handleNumberClick = (number, add) => {
    const numbers = [...tirage.numbers];
    if (add) {
      if (!numbers.includes(number)) {
        numbers.push(number);
        numbers.sort();
      }
    } else {
      const index = numbers.findIndex(n => n === number);
      if (index !== -1) {
        numbers.splice(index, 1);
      }
    }
    numbers.sort();
    onChange({
      ...tirage,
      numbers: numbers
    });
  };

  const handleStarClick = (star, add) => {
    const stars = [...tirage.stars];
    if (add) {
      if (!stars.includes(star)) {
        stars.push(star);
        stars.sort();
      }
    } else {
      const index = stars.findIndex(s => s === star);
      if (index !== -1) {
        stars.splice(index, 1);
      }
    }
    onChange({
      ...tirage,
      stars: stars
    });
  };

  const handleSetDeletable = e => {
    e && e.stopPropagation();
    setDeleteable(true);
  };

  const numbers = Array.from(Array(50)).map((_, index) => index+1).filter(index => editable?true:tirage.numbers.includes(index));
  const stars = Array.from(Array(12)).map((_, index) => index+1).filter(index => editable?true:tirage.stars.includes(index));

  return (
    <div className={classes.tirage} onClick={() => setDeleteable(false)}>
      <div className={`${classes.tirageHead} ${editable?"":"readOnly"}`} >
        <span className={classes.label}>Tirage du </span>
        <input className={`form-check-input ${classes.date}`} type="date" value={tirage.date} onChange={e => handleDateChange(e.target.value)} readOnly={!editable} />
        {editable &&
          <>
            <button className={classes.deleteBtn} type="button" onClick={handleSetDeletable}><FontAwesomeIcon icon="trash-alt" title="supprimer le tirage" /></button>
            <button className={`btn btn-danger ${classes.confirmDeleteBtn} ${deleteable?"active":""}`} type="button" onClick={onDelete}><FontAwesomeIcon icon="trash-alt" title="supprimer le tirage" /> Supprimer</button>
          </>
        }
      </div>
      <div className={classes.numbers}>
        <ul>
          {!!numbers.length && numbers.map(index => (
            <li key={index}>
              <Value Component={Number} value={index} checked={tirage.numbers.includes(index)} readOnly={!editable || !(tirage.numbers.length < 5 || tirage.numbers.includes(index))} onClick={handleNumberClick} />
            </li>
          ))}
        </ul>
      </div>
      <div className={classes.stars}>
        <ul>
          {!!stars.length && stars.map(index => (
            <li key={index}>
              <Value Component={Star} value={index} checked={tirage.stars.includes(index)} readOnly={!editable || !(tirage.stars.length < 2 || tirage.stars.includes(index))} onClick={handleStarClick} />
            </li>
          ))}
        </ul>
      </div>
      <button className={`${classes.editBtn} ${editable?"active":""}`} type="button" onClick={() => setEditable(!editable)}><FontAwesomeIcon icon={editable?"check":"pencil-alt"} title={editable?"valider le tirage":"editer le tirage"} /></button>
    </div>
  );
};

const Tirages = ({ tirages, onChange }) => {

  const classes = useStyles();

  const scrollIntoViewRef = useRef();

  const handleChange = (index, value) => {
    const list = [...tirages];
    list[index] = value;
    onChange(list);
  };

  const handleAdd = () => {
    const date = new Date();
    onChange([
      {
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        numbers: [],
        stars: []
      },
      ...tirages
    ]);
    if(scrollIntoViewRef.current && scrollIntoViewRef.current.view) {
      scrollIntoViewRef.current.view.scrollTo({
        top: 0//,
        //behavior: "smooth"
      });
    }
  };

  const handleDelete = index => {
    const list = [...tirages];
    list.splice(index, 1);
    onChange(list);
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <button className="btn btn-primary" type="button" onClick={handleAdd}><FontAwesomeIcon icon="plus" title="ajouter un tirage" /> Ajouter un tirage</button>
      </div>
      <div>
        <Scrollbars autoHide ref={scrollIntoViewRef}>
          <div className={classes.tirages} >
            <ul ref={scrollIntoViewRef}>
              {tirages.map((tirage, index) => (
                <li key={`${tirage.date}-${index}`} >
                  <Tirage tirage={tirage} isNew={tirage.numbers.length < 5 && tirage.stars.length < 2} onChange={value => handleChange(index, value)} onDelete={() => handleDelete(index)} />
                </li>
              ))}
            </ul>
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default Tirages;