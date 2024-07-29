

import { useMemo } from "react";

import { Draw, getPeriods } from "../../helpers/DrawHelper";
import { Selector } from "../Selector";

interface PeriodSelectorProps {
  draws: Draw[];
  period: number;
  onChange: (period: number) => void;
}

export const PeriodSelector = ({draws, period, onChange}: PeriodSelectorProps) => {

  const periods = useMemo(() => getPeriods(draws, [1,2,3,4,5,10,15,20,30,50,100]), [draws]);

  return (
    <Selector title="Période" value={period} list={periods} onChange={onChange} />
  );
};

export default PeriodSelector;
