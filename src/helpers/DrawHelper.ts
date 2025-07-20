import { FC } from "react";
import { ValueComponentProps } from "../components/Value";

class StatsHelpers {
  static average(values: number[]): number {
    if (!Array.isArray(values) || values.length === 0) {
      return 0;
    }
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }
  static standardDeviation(values: number[]): number {
    if (!Array.isArray(values) || values.length === 0) {
      return 0;
    }

    const avg = StatsHelpers.average(values);
    const squareDiffs = values.map(value => value - avg).map(val => val * val);
    const avgSquareDiff = StatsHelpers.average(squareDiffs);
    const stdDev = Math.sqrt(avgSquareDiff);

    return stdDev;
  }
}

export enum SmoothingMethod {
  sma = "sma",
  ema = "ema"
}

export interface Draw {
  id: string;
  date: string;
  lastUpdated: number | null;
  setDraw: (draw: Draw) => void;
}

export interface Favorite {
  list: number[];
  itemComponent:  FC<ValueComponentProps>;
  onItemToggle: (value?: number, add?: boolean) => void;
}

export enum FavoritesFilter {
  all = "all",
  some = "some",
  off = "off"
}

export interface DrawProps<DrawType> {
  draw: DrawType;
  favorites: Favorite[];
  canEdit: boolean;
  onSave: (draw: DrawType) => void;
  onDelete: (draw: DrawType) => void;
  favoritesFilter?: FavoritesFilter;
}

export const isMatching = (list: number[] | number | null, values: number[], filter?: FavoritesFilter | undefined): boolean => {
  if (!filter) {
    return true;
  }
  if (!Array.isArray(values) || !values.length) {
    return false;
  }
  if (list === null) {
    return false;
  }
  const numbers = new Set(Array.isArray(list)?list:[list]);
  if (filter === FavoritesFilter.some) {
    return values.some(value => numbers.has(value));
  }
  if (filter === FavoritesFilter.all) {
    return values.every(value => numbers.has(value));
  }
  return true; // FavoritesFilter.off
};

export const toDateString = (date: Date): string => date instanceof Date?`${date.getFullYear()}-${date.getMonth() < 9?"0":""}${date.getMonth() + 1}-${date.getDate() < 10?"0":""}${date.getDate()}`:"";

export const getUpdatedList = (list: number[], number: number, add?: boolean) => {
  const result = Array.isArray(list)?[...list]:[];
  if (add) {
    if (!result.includes(number)) {
      result.push(number);
    }
  } else {
    const index = result.findIndex(n => n === number);
    if (index !== -1) {
      result.splice(index, 1);
    }
  }
  result.sort((a, b) => a-b);
  return result;
};

export interface Period {
  name: string;
  value: number;
}

export const getPeriods = (draws: Draw[], whiteList: number[]): Period[] => {
  const dates = draws.reduce((acc, draw: Draw, idx: number) => {
    const index = idx + 1;
    if (whiteList.includes(index)) {
      acc.push({
        name: `depuis ${index > 1?"les " + index + " derniers tirages":"le dernier tirage"} (${new Date(draw.date).toLocaleDateString()})`,
        value: index
      });
    }
    return acc;
  }, [{
    name: "pour l'ensemble des tirages",
    value: draws.length
  }]);
  return dates;
};

export interface Smoothing {
  name: string;
  value: number;
}

export const getSmoothings = (draws: Draw[], whiteList: number[]): Smoothing[] => {
  const dates = draws.reduce((acc: Smoothing[], _draw: Draw, idx: number) => {
    const index = idx + 1;
    if (whiteList.includes(index)) {
      acc.push({
        name: `sur ${index} tirage${index > 1?"s":""}`,
        value: index
      });
    }
    return acc;
  }, []);
  return dates;
};

interface DrawStats {
  average:  number;
  standardDeviation: number;
  above1: number;
  above2: number;
  below1: number;
  below2: number;
}

const getDrawStats = (values: number[]): DrawStats => {
  const average = StatsHelpers.average(values);
  const standardDeviation = StatsHelpers.standardDeviation(values);
  return {
    average: average,
    standardDeviation: standardDeviation,
    above1: average + standardDeviation,
    above2: average + 2 * standardDeviation,
    below1: average - standardDeviation,
    below2: average - 2 * standardDeviation
  };
};

export enum TrendValue {
  min = -2,
  low = -1,
  neutral = 0,
  high = 1,
  max = 2
}

const getTrend = (stats: DrawStats, value: number): TrendValue => {
  if (value > stats.above2) {
    return TrendValue.max;
  }
  if (value > stats.above1) {
    return TrendValue.high;
  }
  if (value < stats.below2) {
    return TrendValue.min;
  }
  if (value < stats.below1) {
    return TrendValue.low;
  }
  return TrendValue.neutral;
};

export interface MovingAverage {
  score: number,
  trend: TrendValue
}

export interface Trend extends MovingAverage {
  date: string;
}

export interface CombinedTrend {
  sma: MovingAverage;
  ema: MovingAverage;
  date: string;
}

export interface ValueStats {
  value: number;
  success: number;
  period: number;
  smoothing: number;
  percentageOfSuccesses: number;
  trend: CombinedTrend;
  trends: CombinedTrend[],
  lastSuccess: number;
  drawSize: number;
  maxValue: number;
}
export interface ItemStats extends ValueStats {
  isFavorite: boolean;
  Component: FC<ValueComponentProps>;
  smoothingMethod: SmoothingMethod;
}

export const compareDates = (a: string, b: string) => {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
};

export const getDrawsStats = <DrawType extends Draw, >(maxValue: number, drawSize: number, draws: DrawType[], getDrawValues: (draw: DrawType) => number[], period: number, smoothing: number): ValueStats[] => {

  const drawsByDate = [...draws].sort((a: Draw, b: Draw) => b.date.localeCompare(a.date));

  const values = Array.from(Array(maxValue)).map((_, index) => index+1).reduce((acc,index) => {
    acc.set(index, {
      success: 0,
      trends: Array.from(Array(period)).map((_, index) => ({
        //Simple Moving Average
        sma: {
          score: 0,
          trend: 0
        },
        //Exponential Moving Average
        ema: {
          score: 0,
          trend: 0
        },
        date: drawsByDate[index].date
      })),
      lastSuccess: Number.POSITIVE_INFINITY
    });
    return acc;
  }, new Map());

  for (let i=0; i<period+smoothing-1 && i<drawsByDate.length; i++) {
    const draw = drawsByDate[i];
    const vals = getDrawValues(draw);
    vals.forEach(value => {
      const counters = values.get(value);
      if (i < period) {
        counters.success += 1;
        if (counters.lastSuccess === Number.POSITIVE_INFINITY) {
          counters.lastSuccess = i + 1;
        }
      }
      for (let j=0; j<smoothing; j++) {
        const idx = i - j;
        if (idx < period && idx >= 0) {
          const trend = counters.trends[idx];
          trend.sma.score += 1;
          trend.ema.score += Math.pow(2, smoothing-j-1);
        }
      }
    });
  }

  Array.from(Array(period)).forEach((_, index) => {
    const smaScores = Array.from(values).map(([ , v]) => v.trends[index].sma.score);
    const emaScores = Array.from(values).map(([ , v]) => v.trends[index].ema.score);
    const smaStats = getDrawStats(smaScores);
    const emaStats = getDrawStats(emaScores);
    values.forEach(v => {
      const trend = v.trends[index];
      trend.sma.trend = getTrend(smaStats, trend.sma.score);
      trend.ema.trend = getTrend(emaStats, trend.ema.score);
    });
  });

  const result = Array.from(values).reduce((acc, [value, {success, trends, lastSuccess}]) => {
    const percentage =  Math.round((success / period  + Number.EPSILON) * 100) / 100;
    acc.push({
      value: value,
      success: success,
      period: period,
      smoothing: smoothing,
      percentageOfSuccesses: percentage,
      trend: trends[0],
      trends: trends,
      lastSuccess: lastSuccess,
      drawSize: drawSize,
      maxValue: maxValue
    });
    return acc;
  }, [] as ValueStats[]);
  return result;
};

export enum SortCriteria {
  success = "success",
  trend = "trend",
  lastSuccess = "lastSuccess",
  value = "value"
}

export const sortValuesStats = (valuesStats: ValueStats[], sortCriteria: SortCriteria, sortAscending: boolean, smoothingMethod: SmoothingMethod): ValueStats[] => {
  const result = valuesStats.sort((a, b) => {
    switch (sortCriteria) {
    case SortCriteria.success: {
      if (a.success === b.success) {
        const aScore = a.trend[smoothingMethod].score;
        const bScore = b.trend[smoothingMethod].score;
        return sortAscending?aScore - bScore:bScore - aScore;
      }
      return sortAscending?a.success - b.success:b.success - a.success;
    }
    case SortCriteria.trend: {
      const aTrend = a.trend[smoothingMethod].trend;
      const bTrend = b.trend[smoothingMethod].trend;
      if (aTrend === bTrend) {
        const aScore = a.trend[smoothingMethod].score;
        const bScore = b.trend[smoothingMethod].score;
        if (aScore === bScore) {
          return sortAscending?a.success - b.success:b.success - a.success;
        }
        return sortAscending?aScore - bScore:bScore - aScore;
      }
      return sortAscending?aTrend - bTrend:bTrend - aTrend;
    }
    case SortCriteria.lastSuccess: {
      if (a.lastSuccess === b.lastSuccess) {
        return a.value - b.value;
      }
      return sortAscending?a[sortCriteria] - b[sortCriteria]:b[sortCriteria] - a[sortCriteria];
    }
    default: // SortCriteria.value
      return sortAscending?a[sortCriteria] - b[sortCriteria]:b[sortCriteria] - a[sortCriteria];
    }
  });
  return result;
};
