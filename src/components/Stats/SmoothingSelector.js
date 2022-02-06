

import React, { useMemo } from "react";
import { createUseStyles } from "react-jss";

import Toggle from "../Toggle";
import { Selector } from "../Selector";
import { getSmoothings } from "../../helpers/DrawHelper";


const useStyles = createUseStyles({
  container: {
    display: "flex"
  },
  methodToggle: {
    marginTop: "2px",
    marginLeft: "15px",
    whiteSpace: "nowrap"
  }
});

export const SmoothingSelector = ({draws, smoothing, method, onSmoothingChange, onMethodChange}) => {

  const classes = useStyles();

  const smoothings =  useMemo(() => getSmoothings(draws, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], false), [draws]);

  return (
    <div className={classes.container}>
      <Selector title="Lissage" value={smoothing} list={smoothings} onChange={onSmoothingChange} />
      <Toggle
        className={classes.methodToggle}
        value={method}
        items={[
          {
            value: "sma",
            label: "SMA",
            icon: "balance-scale",
            activeColor: "#40a9f3",
            inactiveColor: "rgb(224, 224, 224)"
          },
          {
            value: "ema",
            label: "EMA",
            icon: "weight-hanging",
            activeColor: "#40a9f3",
            inactiveColor: "rgb(224, 224, 224)"
          }
        ]}
        onChange={onMethodChange}
      />
    </div>
  );
};

export default SmoothingSelector;
