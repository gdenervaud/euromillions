

import React, { useState } from "react";
import { createUseStyles } from "react-jss";

import {tirages as defaultTirages} from "./data/tirages";
import Tirages from "./Tirages";
import Stats from "./Stats";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpeHiDEKPpY0chqTUR4ywSOdKv89UEbfw",
  authDomain: "euromillions-stats.firebaseapp.com",
  projectId: "euromillions-stats",
  storageBucket: "euromillions-stats.appspot.com",
  messagingSenderId: "927975251473",
  appId: "1:927975251473:web:2dc5c9e4c9a9d74a831bb0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);

const useStyles = createUseStyles({
  container: {
    width: "100% ",
    height: "100%",
    margin: 0,
    display: "grid",
    gridTemplateRows: "min-content 1fr",
    gridTemplateColumns: "1fr",
    "& > ul > li > button" : {
      borderTopWidth: 0,
      padding: "0.75rem"
    },
    "& > ul > li:first-child > button" : {
      borderLeftWidth: 0
    },
    "@media screen and (min-width:1024px)": {
      width: "calc(100% - 40px)",
      height: "calc(100% - 40px)",
      margin: "20px",
      "& > ul > li > button" : {
        borderTopWidth: "1px",
        padding: "0.5rem"
      },
      "& > ul > li:first-child > button" : {
        borderLeftWidth: "1px"
      }
    }
  },
  content: {
    position: "relative",
    width: "100% ",
    height: "100%",
    overflow: "hidden",
    "@media screen and (min-width:1024px)": {
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
      if (!(savedTirages instanceof Array)) {
        savedTirages  = [];
      }
    } catch (e) {
      savedTirages = [];
    }
  }
  if (!savedTirages.length) {
    savedTirages = defaultTirages;
  }
  localStorage.setItem("tirages", JSON.stringify(savedTirages));

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
