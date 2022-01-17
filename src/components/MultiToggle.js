import React from "react";
import { createUseStyles } from "react-jss";

import MultiToggleItem from "./MultiToggleItem";

const useStyles = createUseStyles({
  container:{
    display:"inline-grid",
    background:"rgba(0,0,0,0.45)",
    borderRadius:"20px",
    height:"34px"
  }
});

const MultiToggle = ({ children, selectedValue, onChange }) => {

  const classes = useStyles();

  const childrenWithProps = React.Children.map(children, child => child && React.cloneElement(child, { selectedValue: selectedValue, onSelect: onChange }));

  return(
    <div className={classes.container} style={{gridTemplateColumns:`repeat(${childrenWithProps.length}, 34px)`}}>
      {childrenWithProps}
    </div>
  );
};

MultiToggle.Toggle = MultiToggleItem;

export default MultiToggle;