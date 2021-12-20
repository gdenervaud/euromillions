

import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { Scrollbars } from "react-custom-scrollbars";

import { Value } from "../Number";
import { Number, Star } from "./Draw";

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
    padding: "20px"
  },
  selectBox: {
    display: "inline-block",
    position: "relative",
    "&:not(.disabled):after": {
      content: "\"\"",
      position: "absolute",
      top: "50%",
      right: "10px",
      width: 0,
      height: 0,
      marginTop: "-3px",
      borderTop: "6px solid #4d4d4d",
      borderRight: "6px solid transparent",
      borderLeft: "6px solid transparent",
      pointerEvents: "none"
    }
  },
  select: {
    marginBottom: 0,
    display: "inline-block",
    minWidth: "100px",
    width: "100%",
    padding: "0.375rem 20px 0.75rem 6px",
    color: "#4d4d4d",
    border:"1px solid #4d4d4d",
    borderRadius: "2px",
    backgroundColor: "white",
    "-webkit-appearance": "none",
    "&:not(.disabled):not(:disabled):hover": {
      //backgroundColor: "#5a6268",
      //borderColor: "#5a6268"
    },
    "&:focus": {
      color: "var(--ft-color-loud)",
      borderColor: "rgba(64, 169, 243, 0.5)",
      backgroundColor: "transparent",
      outline: 0,
      boxShadow: "0 0 0 0.2rem rgb(0 123 255 / 25%)"
    },
    "&.disabled,&:disabled":{
      backgroundColor: "var(--bg-color-blend-contrast1)",
      color: "var(--ft-color-normal)",
      cursor: "text"
    }
  },
  stats: {
    padding: "0 20px 20px 20px",
    "& > div + div": {
      marginTop: "20px"
    }
  },
  list: {
    padding: "15px 10px 10px 10px",
    borderRadius: "3px",
    border: "1px solid #dee2e6",
    background: "linear-gradient( 0deg,#f8f8f8,#fff)",
    "& + $list": {
      marginTop: "20px"
    },
    "& h5": {
      paddingLeft: "10px"
    },
    "& > div": {
      display: "inline-block"
    },
    "& > ul": {
      listStyleType: "none",
      margin: 0,
      padding: 0,
      "& > li": {
        display: "inline-block"
      }
    }
  }
});

export const Stats = ({ draws }) => {

  const [date, setDate] = useState("");

  const classes = useStyles();

  const dates = draws.reduce((acc, tirage, index) => {
    acc.push({
      name: `depuis ${index > 0?"les " + (index + 1) + " derniers tirages":"le dernier tirage"} (${new Date(tirage.date).toLocaleDateString()})`,
      value: tirage.date
    });
    return acc;
  }, [{
    name: "pour l'ensemble des tirages",
    value: ""
  }]);

  const numbers = Array.from(Array(50)).map((_, index) => index+1).reduce((acc,index) => {
    acc.set(index, 0);
    return acc;
  }, new Map());
  const stars = Array.from(Array(12)).map((_, index) => index+1).reduce((acc,index) => {
    acc.set(index, 0);
    return acc;
  }, new Map());
  draws.filter(tirage => tirage.date >= date).forEach(tirage => {
    tirage.numbers.forEach(number => numbers.set(number, numbers.get(number) + 1));
    tirage.stars.forEach(star => stars.set(star, stars.get(star) + 1));
  });

  const oftenNumbers = Object.entries(Array.from(numbers).reduce((acc, [number, counter]) => {
    if (!acc[counter]) {
      acc[counter] = [];
    }
    const list = [...acc[counter], number];
    list.sort((numberA, numberB) => {
      if (numberA > numberB) {
        return 1;
      }
      if (numberB > numberA) {
        return -1;
      }
      return 0;
    });
    acc[counter] = list;
    return acc;
  }, {})).sort(([counterA], [counterB]) => {
    if (counterA > counterB) {
      return -1;
    }
    if (counterB > counterA) {
      return 1;
    }
    return 0;
  });

  const oftenStars = Object.entries(Array.from(stars).reduce((acc, [star, counter]) => {
    if (!acc[counter]) {
      acc[counter] = [];
    }
    const list = [...acc[counter], star];
    list.sort((starA, starB) => {
      if (starA > starB) {
        return 1;
      }
      if (starB > starA) {
        return -1;
      }
      return 0;
    });
    acc[counter] = list;
    return acc;
  }, {})).sort(([counterA], [counterB]) => {
    if (counterA > counterB) {
      return -1;
    }
    if (counterB > counterA) {
      return 1;
    }
    return 0;
  });

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        Calculer:&nbsp;
        <div className={classes.selectBox} >
          <select className={classes.select} value={date} onChange={e => setDate(e.target.value)} >
            {dates.map(d => <option key={d.value} value={d.value}>{d.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <Scrollbars autoHide>
          <div className={classes.stats} >
            <div>
              {oftenNumbers.map(([counter, numbers]) =>
                <div key={counter}  className={classes.list}>
                  <h5>{counter > 0?`${counter} fois`:"Jamais"}</h5>
                  <ul>
                    {numbers.map(number =>
                      <li key={number}><Value Component={Number} value={number} checked={counter > 0} readOnly={true} /></li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div>
              {oftenStars.map(([counter, stars]) =>
                <div key={counter} className={classes.list}>
                  <h5>{counter > 0?`${counter} fois`:"Jamais"}</h5>
                  <ul>
                    {stars.map(star =>
                      <li key={star}><Value Component={Star} value={star} checked={counter > 0} readOnly={true} /></li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default Stats;
