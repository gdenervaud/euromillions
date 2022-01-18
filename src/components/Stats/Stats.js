

import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { Scrollbars } from "react-custom-scrollbars";

import { getDates } from "../../helpers/DrawHelper";
import Toggle from "../Toggle";
import { Favorites } from "./Favorites";
import { Serie } from "./Serie";

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
      alignItems: "center",
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
  favoritesToggle: {
    marginTop: "25px !important",
    "@media screen and (min-width:768px)": {
      marginTop: "0px !important",
    }
  },
  stats: {
    padding: "0 20px 20px 20px",
    "& > div + div": {
      marginTop: "20px"
    }
  },
  serie: {
    "& + $serie": {
      marginTop: "15px"
    }
  }
});

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

  const [sortAscending, setSortAscending] = useState(true);
  const [sortCriteria, setSortCriteria] = useState("value");

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const handleOnSort = criteria => {
    if (criteria === sortCriteria) {
      setSortAscending(!sortAscending);
    } else {
      setSortAscending(criteria === "value"?true:false);
      setSortCriteria(criteria);
    }
  };

  const hasFavorites = series.some(serie => !!serie.favorites.length);

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.header} >
        <DateSelector draws={draws} date={date} onChange={setDate} />
        <TrendDateSelector draws={draws} date={trendDate} onChange={setTrendDate} />
        {hasFavorites && (
          <Toggle
            className={classes.favoritesToggle}
            value={showOnlyFavorites}
            items={[
              {
                value: true,
                label: "Uniquement les favoris",
                icon: "star",
                activeColor: "yellow",
                inactiveColor: "rgb(224, 224, 224)"
              },
              {
                value: false,
                label: "Tous les numéros",
                icon: "times",
                activeColor: "red",
                inactiveColor: "rgb(224, 224, 224)"
              }
            ]}
            onChange={setShowOnlyFavorites}
          />
        )}
      </div>
      <div>
        <Scrollbars autoHide>
          <div className={classes.stats} >
            {series.map(({maxValue, itemComponent, getValue, favorites, onFavoriteToggle}, index) => (
              <div  key={index} className={classes.serie} >
                {!showOnlyFavorites && (
                  <Favorites favorites={favorites} favoriteComponent={itemComponent} onFavoriteClick={onFavoriteToggle} />
                )}
                <Serie draws={draws} maxValue={maxValue} favorites={favorites} itemComponent={itemComponent} getValue={getValue} onFavoriteToggle={onFavoriteToggle} date={date} trendDate={trendDate} sortAscending={sortAscending} sortCriteria={sortCriteria} onSort={handleOnSort} showOnlyFavorites={showOnlyFavorites} />
              </div>
            ))}
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default Stats;
