import React from "react";
import { createUseStyles } from "react-jss";

import MultiToggleItem from "./MultiToggleItem";

const useStyles = createUseStyles({
  container:{
    display:"inline-grid",
    background:"#4f5658",
    borderRadius:"20px",
    height:"24px"
  }
});

const MultiToggle = ({ children, selectedValue, onChange }) => {

  const classes = useStyles();

  const isReadOnly = typeof onChange !== "function";

  const childrenWithProps = React.Children.map(children, child => child && React.cloneElement(child, { selectedValue: selectedValue, onSelect: isReadOnly?null:onChange }));

  return(
    <div className={classes.container} style={{gridTemplateColumns:`repeat(${childrenWithProps.length}, 24px)`}}>
      {childrenWithProps}
    </div>
  );
};

MultiToggle.Toggle = MultiToggleItem;

export default MultiToggle;