

import React from "react";
import { createUseStyles } from "react-jss";

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

export const Tabs = ({ tabs, selected, onClick, children }) => {

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ul className="nav nav-tabs">
        {tabs.filter(tab => tab.visible).map(tab =>
          <li key={tab.value} className="nav-item">
            <button className={`nav-link ${tab.value === selected?"active":""}`} onClick={() => onClick(tab.value)}>{tab.name}</button>
          </li>
        )}
      </ul>
      <div className={classes.content}>
        {children}
      </div>
    </div>
  );
};

export default Tabs;
