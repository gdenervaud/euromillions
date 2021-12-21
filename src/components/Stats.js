

import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { Scrollbars } from "react-custom-scrollbars";

import { getValuesByCount } from "../helpers/DrawHelper";
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

const Serie = ({ draws, maxValue, itemComponent, date, getValue}) => {

  const classes = useStyles();

  const valuesByCount = getValuesByCount(maxValue, draws, date, getValue);

  return (
    <div>
      {valuesByCount.map(([counter, values]) =>
        <div key={counter}  className={classes.list}>
          <h5>{counter > 0?`${counter} fois`:"Jamais"}</h5>
          <ul>
            {values.map(value =>
              <li key={value}><Value Component={itemComponent} value={value} checked={counter > 0} readOnly={true} /></li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export const Stats = ({ draws, series}) => {

  const [date, setDate] = useState("");

  const classes = useStyles();

  const dates = draws.reduce((acc, draw, index) => {
    acc.push({
      name: `depuis ${index > 0?"les " + (index + 1) + " derniers tirages":"le dernier tirage"} (${new Date(draw.date).toLocaleDateString()})`,
      value: draw.date
    });
    return acc;
  }, [{
    name: "pour l'ensemble des tirages",
    value: ""
  }]);

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
            {series.map(({maxValue, itemComponent, getValue}, index) => (
              <Serie key={index} draws={draws} maxValue={maxValue} itemComponent={itemComponent} date={date} getValue={getValue} />
            ))}
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default Stats;
