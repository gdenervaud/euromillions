import React from "react";
import { createUseStyles } from "react-jss";

import MultiToggle from "./MultiToggle";

const useStyles = createUseStyles({
  option: {
    marginBottom: "20px",
    "&:last-child": {
      marginBottom: 0
    }
  },
  toggle: {
    display: "inline-block"
  },
  optionLabel: {
    display: "inline-block",
    marginBottom: "5px",
    marginLeft: "5px",
    "& small": {
      fontWeight: "normal",
      fontStyle: "italic"
    }
  }
});


const Toggle = ({ className, option, label, comment, show, onChange }) => {

  const classes = useStyles();

  const { name, value } = option;

  const isReadOnly = typeof onChange !== "function";

  const handleChange = newValue => onChange(name, newValue);

  if (!show) {
    return null;
  }

  return (
    <div className={`${classes.option} ${className?className:""}`}>
      <div className={classes.toggle}>
        <MultiToggle selectedValue={value} onChange={isReadOnly?null:handleChange}>
          <MultiToggle.Toggle color={"rgb(224, 224, 224)"} icon={"check"} value={true} />
          <MultiToggle.Toggle color={"rgb(224, 224, 224)"} icon={"times"} value={undefined} />
        </MultiToggle>
      </div>
      <div className={classes.optionLabel}>
        {label}{comment && (
          <small>({comment})</small>
        )}
      </div>
    </div>
  );
};

export default Toggle;