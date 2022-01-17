import React from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = createUseStyles({
  container:{
    textAlign:"center",
    height:"24px",
    lineHeight:"24px",
    fontSize:"0.66em",
    transition:"all .2s ease",
    background:"none",
    "&:not(.readOnly)": {
      cursor:"pointer"
    },
    "&.selected":{
      background:"#141618",
      borderRadius:"50%",
      transform:"scale(1.12)",
      fontSize:"0.8em",
      /*backgroundColor:"currentColor",
      "& svg":{
        color:"white"
      },*/
      "&.noscale":{
        transform:"scale(1)",
      }
    }
  }
});

const MultiToggleItem = ({ selectedValue, value, color, icon, noscale, onSelect }) => {

  const classes = useStyles();

  const isReadOnly = typeof onSelect !== "function";

  const handleClick = () => {
    if(typeof onSelect === "function") {
      onSelect(value);
    }
  };

  const className = `${classes.container}${selectedValue === value?" selected":""}${noscale !== undefined?" noscale":""} ${isReadOnly?"readOnly":""}`;

  return(
    <div onClick={isReadOnly?null:handleClick} className={className} style={{color: color}}>
      <FontAwesomeIcon icon={icon || "dot-circle"}/>
    </div>
  );
};

export default MultiToggleItem;