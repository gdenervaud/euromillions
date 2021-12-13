

import React, { useState } from "react";
import { createUseStyles } from "react-jss";

import Tirages from "./Tirages";
import Stats from "./Stats";

const useStyles = createUseStyles({
  container: {
    width: "100% ",
    height: "100%",
    margin: 0,
    display: "grid",
    gridTemplateRows: "min-content 1fr",
    gridTemplateColumns: "1fr",
    "& ul > li > button" : {
      borderTopWidth: 0
    },
    "& ul > li:first-child > button" : {
      borderLeftWidth: 0
    },
    "@media screen and (min-width:800px)": {
      width: "calc(100% - 40px)",
      height: "calc(100% - 40px)",
      margin: "20px",
      "& ul > li > button" : {
        borderTopWidth: "1px"
      },
      "& ul > li:first-child > button" : {
        borderLeftWidth: "1px"
      }
    }
  },
  content: {
    position: "relative",
    width: "100% ",
    height: "100%",
    overflow: "hidden",
    "@media screen and (min-width:800px)": {
      border: "1px solid #dee2e6",
      borderTop: 0
    }
  }
});

const App = () => {

  const classes = useStyles();

  let savedTirages = [];
  if (localStorage.getItem("tirages")) {
    try {
      savedTirages = JSON.parse(localStorage.getItem("tirages")).sort((a, b) => b.date.localeCompare(a.date));
      localStorage.setItem("tirages", JSON.stringify(savedTirages));
      if (!(savedTirages instanceof Array)) {
        savedTirages  = [];
      }
    } catch (e) {
      savedTirages = [];
    }
  }

  const [view, setView] = useState("TIRAGES");
  const [tirages, setTirages] = useState(savedTirages);

  const handleTiragesChange = list => {
    localStorage.setItem("tirages", JSON.stringify(list));
    setTirages(list);
  };

  return (
    <div className={classes.container}>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button className={`nav-link ${view === "TIRAGES"?"active":""}`} onClick={() => setView("TIRAGES")}>Tirages</button>
        </li>
        {!!tirages.length &&
          <li className="nav-item">
            <button className={`nav-link ${view === "STATISTICS"?"active":""}`} onClick={() => setView("STATISTICS")}>Statistiques</button>
          </li>
        }
      </ul>
      <div className={classes.content}>
        {view === "TIRAGES"?
          <Tirages tirages={tirages} onChange={handleTiragesChange} />
          :
          <Stats tirages={tirages} />
        }
      </div>
    </div>
  );
};

export default App;
