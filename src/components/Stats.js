

import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { Scrollbars } from "react-custom-scrollbars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getValuesStats, getDates } from "../helpers/DrawHelper";
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
    display: "flex",
    flexDirection: "column",
    "& > div + div": {
      marginTop: "10px"
    },
    "@media screen and (min-width:768px)": {
      flexDirection: "row",
      "& > div + div": {
        marginTop: 0,
        marginLeft: "20px"
      }
    }
  },
  selector: {
    display: "inline-block"
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
  serie: {
    "& > tbody > tr > td": {
      textAlign: "center"
    },
    "& + $serie": {
      marginTop: "15px"
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
    display: "inline-block",
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
  },
  sortBtn: {
    position: "relative",
    width: "100%",
    margin: 0,
    padding: "0.65rem 30px 0.65rem 0.75rem",
    border: 0,
    background: "rgba(0,0,0,0.05)",
    transition: "all 0.3s ease-in-out",
    "@media screen and (min-width:768px)": {
      padding: "0.375rem 30px 0.65rem 0.75rem"
    },
    "&:hover": {
      background: "rgba(0,0,0,0.075)",
    },
    "&.sort-ascending:before": {
      content: "\" \"",
      display: "block",
      position: "absolute",
      top: "50%",
      right: "10px",
      width: 0,
      height: 0,
      transform: "translateY(-3px)",
      borderTop: "6px solid black",
      borderLeft: "6px solid transparent",
      borderRight: "6px solid transparent",
      cursor: "pointer",
      pointerEvents: "none"
    },
    "&.sort-descending:before": {
      content: "\" \"",
      display: "block",
      position: "absolute",
      top: "50%",
      right: "10px",
      width: 0,
      height: 0,
      transform: "translateY(-3px)",
      borderBottom: "6px solid black",
      borderLeft: "6px solid transparent",
      borderRight: "6px solid transparent",
      cursor: "pointer",
      pointerEvents: "none"
    }
  }
});

const Serie =  ({ draws, maxValue, itemComponent, getValue, date, trendDate}) => {

  const classes = useStyles();

  const [sortAscending, setSortAscending] = useState(true);
  const [sortCriteria, setSortCriteria] = useState("value");

  const valuesStats = getValuesStats(maxValue, draws, getValue, date, trendDate);
  const sortedValuesStats = valuesStats.sort((a, b) => {
    if (sortCriteria !== "value" && a[sortCriteria] === b[sortCriteria]) {
      const secondCriteria = "trendSuccess";
      if (sortCriteria === "trend" && a[secondCriteria] === b[secondCriteria]) {
        const thirdCriteria = "success";
        return sortAscending?a[thirdCriteria] - b[thirdCriteria]:b[thirdCriteria] - a[thirdCriteria];
      }
      return sortAscending?a[secondCriteria] - b[secondCriteria]:b[secondCriteria] - a[secondCriteria];
    }
    return sortAscending?a[sortCriteria] - b[sortCriteria]:b[sortCriteria] - a[sortCriteria];
  });

  const handleSortByValue = () => {
    setSortAscending(sortCriteria === "value"?!sortAscending:true);
    setSortCriteria("value");
  };

  const handleSortBySuccess = () => {
    setSortAscending(sortCriteria === "success"?!sortAscending:false);
    setSortCriteria("success");
  };

  const handleSortByTrend = () => {
    setSortAscending(sortCriteria === "trend"?!sortAscending:false);
    setSortCriteria("trend");
  };

  return (
    <table className={classes.serie}>
      <thead>
        <tr>
          <th><button className={`${classes.sortBtn} ${sortCriteria === "value"?(sortAscending?"sort-ascending":"sort-descending"):""}`} onClick={handleSortByValue}>Nombre</button></th>
          <th><button className={`${classes.sortBtn} ${sortCriteria === "success"?(sortAscending?"sort-ascending":"sort-descending"):""}`} onClick={handleSortBySuccess}>Tirages</button></th>
          <th><button className={`${classes.sortBtn} ${sortCriteria === "trend"?(sortAscending?"sort-ascending":"sort-descending"):""}`} onClick={handleSortByTrend}>Tendance</button></th>
        </tr>
      </thead>
      <tbody>
        {sortedValuesStats.map(({value, success, numberOfDraws, percentageOfSuccesses, trend}) => (
          <tr key={value}>
            <td>
              <Value Component={itemComponent} value={value} checked={true} readOnly={true} />
            </td>
            <td style={{width: "100%"}}>
              <div className={classes.barPnl}>
                <div className={classes.bar} style={{width: `${percentageOfSuccesses * 100}%`}}>
                  <div className={`${classes.barValue} ${percentageOfSuccesses > 0.5?"inside":""}`}>{success} / {numberOfDraws}</div>
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
      </tbody>
    </table>
  );
};

const Selector = ({title, value, list, onChange}) => {

  const classes = useStyles();

  const handleChange = e => onChange(e.target.value);

  return (
    <div className={classes.selector}>
      {title}:&nbsp;
      <div className={classes.selectBox} >
        <select className={classes.select} value={value} onChange={handleChange} >
          {list.map(item => <option key={item.value} value={item.value}>{item.name}</option>)}
        </select>
      </div>
    </div>
  );
};

const DateSelector = ({className, draws, date, onChange}) => {

  const dates = getDates(draws, [1,2,3,4,5,10,15,20,30,50,100], true);

  return (
    <Selector title="Période" value={date} list={dates} onChange={onChange} />
  );
};

const TrendDateSelector = ({className, draws, date, onChange}) => {

  const dates =  getDates(draws, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], false);

  return (
    <Selector title="Tendance" value={date} list={dates} onChange={onChange} />
  );
};

export const Stats = ({ draws, series}) => {

  const drawsByDate = draws.sort((a, b) => a.date - b.date);

  const [date, setDate] = useState("");
  const [trendDate, setTrendDate] = useState(drawsByDate.length > 5?drawsByDate[5].date:drawsByDate.length?drawsByDate[drawsByDate.length-1].date:"");

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.header} >
        <DateSelector draws={draws} date={date} onChange={setDate} />
        <TrendDateSelector draws={draws} date={trendDate} onChange={setTrendDate} />
      </div>
      <div>
        <Scrollbars autoHide>
          <div className={classes.stats} >
            {series.map(({maxValue, itemComponent, getValue}, index) => (
              <Serie key={index} draws={draws} maxValue={maxValue} itemComponent={itemComponent} getValue={getValue} date={date} trendDate={trendDate} />
            ))}
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default Stats;
