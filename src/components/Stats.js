

import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { Scrollbars } from "react-custom-scrollbars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getValuesStats, getValuesByCount } from "../helpers/DrawHelper";
import { Value } from "./Number";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    width: "100% ",
    height: "100%",
    display: "grid",
    gridTemplateRows: "1fr min-content 1fr",
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
  },
  barPnl: {
    background: "rgba(0,0,0,0.1)",
    position: "relative",
    width: "100%",
    height: "30px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "0 5px",
    borderRadius: "100px"
  },
  bar: {
    position: "relative",
    width: 0,
    height: "20px",
    boxShadow: "0 10px 40px -10px #000",
    borderRadius: "100px",
    background: "linear-gradient(to bottom, #A3E2EF 35%, #4F9CC0)"
  },
  barValue: {
    position: "absolute",
    top: "-2px",
    left: "calc(100% + 6px)",
    whiteSpace: "nowrap",
    textAlign: "right",
    "&.inside": {
      left: "calc(100% - 10px)",
      transform: "translateX(-100%)"
    }
  },
  arrow: {
    marginLeft: "6px",
    "&.arrow-trend2": {
      transform: "rotate(-90deg)",
      color: "lime"
    },
    "&.arrow-trend1": {
      transform: "rotate(-45deg)",
      color: "lime"
    },
    "&.arrow-trend-1": {
      transform: "rotate(45deg)",
      color: "red"
    },
    "&.arrow-trend-2": {
      transform: "rotate(90deg)",
      color: "red"
    }
  }
});

const Evolution =  ({ draws, maxValue, itemComponent, getValue}) => {

  const classes = useStyles();

  const valuesStats = getValuesStats(maxValue, draws, getValue, 10, 50);

  return (
    <table>
      {valuesStats.map(({value, successes, numberOfDraws, percentageOfSuccesses, trend}) => (
        <tr key={value}>
          <td>
            <Value Component={itemComponent} value={value} checked={true} readOnly={true} />
          </td>
          <td style={{width: "100%"}}>
            <div className={classes.barPnl}>
              <div className={classes.bar} style={{width: `${percentageOfSuccesses * 100}%`}}>
                <div className={`${classes.barValue} ${percentageOfSuccesses > 0.5?"inside":""}`}>{successes} / {numberOfDraws}</div>
              </div>
            </div>
          </td>
          <td>
            <div className={`${classes.arrow} arrow-trend${trend}`}>
              <FontAwesomeIcon icon="arrow-right" size="2x" />
            </div>
          </td>
        </tr>
      ))}
    </table>
  );
};

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

  const dates = draws.reduce((acc, draw, idx) => {
    const index = idx + 1;
    if ([1,2,3,4,5,10,15,20,30,50,100].includes(index)) {
      acc.push({
        name: `depuis ${index > 1?"les " + index + " derniers tirages":"le dernier tirage"} (${new Date(draw.date).toLocaleDateString()})`,
        value: draw.date
      });
    }
    return acc;
  }, [{
    name: "pour l'ensemble des tirages",
    value: ""
  }]);

  return (
    <div className={classes.container}>
      <div>
        <Scrollbars autoHide>
          <div className={classes.stats} >
            {series.map(({maxValue, itemComponent, getValue}, index) => (
              <Evolution key={index} draws={draws} maxValue={maxValue} itemComponent={itemComponent} getValue={getValue} />
            ))}
          </div>
        </Scrollbars>
      </div>
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
