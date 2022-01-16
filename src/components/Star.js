import React from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = createUseStyles({
  star: {
    position: "relative",
    height: "50px",
    width: "50px",
    lineHeight: "50px",
    "& svg": {
      position: "absolute",
      top: 0,
      left: "50%",
      color: "white",
      transform: "translate(-50%, 3px) scale(1.2)"
    },
    "& div": {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      color: "#eebb05"
    },
    "&.checked": {
      "& svg": {
        color: "#eebb05"
      },
      "& div": {
        color: "white"
      }
    }
  }
});

export const Star = ({ value, checked, className }) => {

  const classes = useStyles();

  return (
    <div className={`star ${classes.star} ${className?className:""} ${checked?" checked":""}`}>
      <FontAwesomeIcon icon="star" size="2x"/>
      <div>{value}</div>
    </div>
  );
};
