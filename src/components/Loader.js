import React from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = createUseStyles({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    textAlign: "center",
    zIndex: 100
  },
  shadow: {
    background: "rgba(0, 0, 0, 0.15)",
    "& $panel": {
      background: "white",
      border: "1px solid transparent",
      borderRadius: "5px",
      boxShadow: "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
    }
  },
  panel: {
    display: "inline-block",
    position: "relative",
    top: "50%",
    transform: "translateY(-50%)",
    padding: "20px 15px",
  }
});

export const Loader = ({ text, shadow=true }) => {

  const classes = useStyles();

  return (
    <div className={`${classes.container} ${shadow?classes.shadow:""}`}>
      <div className={classes.panel}>
        <FontAwesomeIcon icon="circle-notch" spin /> {text}
      </div>
    </div>
  );
};
