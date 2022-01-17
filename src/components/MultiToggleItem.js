import React from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = createUseStyles({
  container:{
    textAlign:"center",
    height:"34px",
    lineHeight:"34px",
    fontSize:"0.66em",
    transition:"all .2s ease",
    background:"none",
    "&:not(.readOnly)": {
      cursor:"pointer"
    },
    "&.selected":{
      background:"#454545",
      borderRadius:"50%",
      transform:"scale(1.12)",
      fontSize:"0.8em",
      "& svg": {
        transform:"scale(1.6)"
      }
    },
    "& svg": {
      transform:"translateY(-1px) scale(1.6)"
    }
  }
});

const MultiToggleItem = ({ selectedValue, value, icon, activeColor, inactiveColor, onSelect }) => {

  const classes = useStyles();

  const handleClick = () => {
    if(typeof onSelect === "function") {
      onSelect(value);
    }
  };

  const isSelected = selectedValue === value;

  const color = isSelected?activeColor:inactiveColor;

  return (
    <div onClick={handleClick} className={`${classes.container} ${isSelected?"selected":""}`} style={{color: color}}>
      <FontAwesomeIcon icon={icon || "dot-circle"}/>
    </div>
  );
};

export default MultiToggleItem;