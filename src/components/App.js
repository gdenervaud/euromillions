import React, { useState } from "react";
import { createUseStyles } from "react-jss";

import EuroMillions from "./EuroMillions/EuroMillions";
import SwissLotto from "./SwissLotto/SwissLotto";

const useStyles = createUseStyles({
  container: {
    width: "100% ",
    height: "100%"
  },
  pannel: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    "@media (orientation: landscape)": {
      display: "flex"
    },
    "@media screen and (min-width:1024px) and (orientation:portrait)": {
      display: "block"
    },
    "@medias screen and (min-width:1024px) and (orientation:landscape)": {
      display: "flex !important"
    },
    "& button": {
      margin: "50px",
      padding: "50px",
      border: 0,
      borderRadius: "30px",
      background: "white",
      boxShadow: "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
      transition: "all 0.3s ease-in-out",
      "&:hover, &:focus, &:active": {
        transform: "scale(1.05)",
        boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"
      },
      "& img": {
        width: "150px",
        height: "50px",
        "@media screen and (min-width:768px) and (orientation: portrait)": {
          width: "300px",
          height: "100px",
        },
        "@media screen and (min-width:1024px)": {
          width: "300px",
          height: "100px",
        }
      }
    }
  }
});

const App = ({ db }) => {

  const classes = useStyles();

  const [lottery, setLottery] = useState(null);

  if (!lottery) {
    return (
      <div className={classes.container}>
        <div className={classes.pannel}>
          <button type="button" onClick={() => setLottery("euromillions")} title="EuroMillions">
            <img src="/euroMillions.jpg" alt="EuroMillions" />
          </button>
          <button type="button" onClick={() => setLottery("swisslotto")} title="Swiss Lotto">
            <img src="/swissLotto.png" alt="Swiss Lotto" />
          </button>
        </div>
      </div>
    );
  }
  if (lottery === "swisslotto") {
    return (
      <SwissLotto db={db} dbCollection="swisslotto-draws" onMenu={() => setLottery(null)} />
    );
  }

  return (
    <EuroMillions db={db} dbCollection="euromillions-draws" onMenu={() => setLottery(null)} />
  );
};

export default App;
