

import React from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    "& > ul > li:first-child" : {
      marginLeft: "100px"
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
  },
  logo: {
    position: "absolute",
    top: "12px",
    left: "10px",
    width: "75px",
    height: "25px",
    "@media screen and (min-width:1024px)": {
      top: "25px",
      left: "30px"
    }
  },
  menuBtn: {
    position: "absolute",
    top: "-5px",
    right: "5px",
    border: 0,
    background: "transparent",
    fontSize: "x-large",
    padding: "0.75rem",
    color: "#454545",
    "&:hover": {
      boxShadow: "1px 1px 2px #8f8a8a"
    },
    "@media screen and (min-width:1024px)": {
      top: "10px",
      right: "10px",
      padding: "0.375rem 0.75rem"
    }
  }
});

export const Tabs = ({ title, logo, tabs, selected, onClick, onMenu, children }) => {

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
      <img className={classes.logo} src={logo} alt={title} />
      <button className={classes.menuBtn} type="button" onClick={onMenu}><FontAwesomeIcon icon="bars" title="menu" /></button>
    </div>
  );
};

export default Tabs;
