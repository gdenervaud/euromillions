

import React, { useMemo } from "react";

import { getPeriods } from "../../helpers/DrawHelper";
import { Selector } from "../Selector";


export const PeriodSelector = ({draws, period, onChange}) => {

  const periods = useMemo(() => getPeriods(draws, [1,2,3,4,5,10,15,20,30,50,100], true), [draws]);

  return (
    <Selector title="Période" value={period} list={periods} onChange={onChange} />
  );
};

export default PeriodSelector;