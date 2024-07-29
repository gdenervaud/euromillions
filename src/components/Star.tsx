
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { StylableValueComponentProps } from "./Value";

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
      filter: "drop-shadow( 3px 3px 2px rgba(0, 0, 0, .3))",
      transform: "translate(-50%, 3px) scale(1.1)",
      "@media screen and (min-width:380px)": {
        transform: "translate(-50%, 3px) scale(1.2)"
      }
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

export const Star = ({ value, checked=false, className }: StylableValueComponentProps) => {

  const classes = useStyles();

  return (
    <div className={`star ${classes.star} ${className?className:""} ${checked?" checked":""}`}>
      <FontAwesomeIcon icon="star" size="2x"/>
      <div>{value}</div>
    </div>
  );
};
