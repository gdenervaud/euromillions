import React from "react";
import { createUseStyles } from "react-jss";

import MultiToggle from "./MultiToggle";

const useStyles = createUseStyles({
  container: {
    "& > div": {
      position: "relative",
      "& > div": {
        display: "inline-block"
      }
    }
  }
});

const Toggle = ({ className, value, items, onChange }) => {

  const classes = useStyles();

  const selectedItem = items.find(item => item.value === value);

  return (
    <div className={`${classes.container} ${className?className:""}`}>
      <div>
        <div>
          <MultiToggle selectedValue={value} onChange={onChange}>
            {items.map(item => (
              <MultiToggle.Toggle key={item.value} {...item} />
            ))}
          </MultiToggle>
        </div>
        {selectedItem && selectedItem.label && (
          <div>&nbsp;{selectedItem.label}</div>
        )}
      </div>
    </div>
  );
};

export default Toggle;