

import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  sortBtn: {
    position: "relative",
    width: "100%",
    margin: 0,
    padding: "0.65rem 20px 0.65rem 0.35rem",
    border: 0,
    background: "rgba(0,0,0,0.05)",
    transition: "all 0.3s ease-in-out",
    fontSize: "0.65rem",
    whiteSpace: "nowrap",
    "@media screen and (min-width:768px)": {
      padding: "0.375rem 30px 0.65rem 0.75rem",
      fontSize: "1rem",
    },
    "&:hover": {
      background: "rgba(0,0,0,0.075)",
    },
    "&.sort-ascending:before, &.sort-descending:before": {
      content: "\" \"",
      display: "block",
      position: "absolute",
      top: "50%",
      right: "4px",
      width: 0,
      height: 0,
      transform: "translateY(-3px)",
      cursor: "pointer",
      pointerEvents: "none",
      "@media screen and (min-width:768px)": {
        right: "10px",
      }
    },
    "&.sort-ascending:before": {
      borderTop: "6px solid black",
      borderLeft: "6px solid transparent",
      borderRight: "6px solid transparent"
    },
    "&.sort-descending:before": {
      borderBottom: "6px solid black",
      borderLeft: "6px solid transparent",
      borderRight: "6px solid transparent"
    }
  }
});

export const SortButton =  ({ children, value, selected, isAscending, onClick}) => {

  const classes = useStyles();

  const handleClick = () => onClick(value);

  return (
    <button className={`${classes.sortBtn} ${selected?(isAscending?"sort-ascending":"sort-descending"):""}`} onClick={handleClick}>{children}</button>
  );
};
