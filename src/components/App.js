

import React from "react";
import { createUseStyles } from "react-jss";

import EuroMillions from "./EuroMillions/EuroMillions";

const useStyles = createUseStyles({
  container: {
    width: "100% ",
    height: "100%"
  }
});

const App = ({ db }) => {

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <EuroMillions db={db} dbCollection="euromillions-draws" />
    </div>
  );
};

export default App;
