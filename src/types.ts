import { FC } from "react";
import { ValueComponentProps } from "./components/Value";

// Base Draw interface
export interface Draw {
  id: string;
  date: string;
}

// Specific Draw types
export interface EuroMillionsDraw extends Draw {
  numbers: number[];
  stars: number[];
  swissWin: number[];
}

export interface SwissLottoDraw extends Draw {
  numbers: number[];
  chance: number | null;
}

// Enums
export enum SmoothingMethod {
  sma = "sma",
  ema = "ema"
}

export enum FavoritesFilter {
  all = "all",
  some = "some",
  off = "off"
}

export enum TrendValue {
  min = -2,
  low = -1,
  neutral = 0,
  high = 1,
  max = 2
}

export enum SortCriteria {
  success = "success",
  trend = "trend",
  lastSuccess = "lastSuccess",
  value = "value"
}

// Component interfaces
export interface Favorite {
  list: number[];
  itemComponent: FC<ValueComponentProps>;
  onItemToggle: (value?: number, add?: boolean) => void;
}

export interface DrawProps<DrawType> {
  draw: DrawType;
  favorites: Favorite[];
  canEdit: boolean;
  onSave: (draw: DrawType) => void;
  onDelete: (draw: DrawType) => void;
  favoritesFilter?: FavoritesFilter;
}

// Statistics interfaces
export interface Period {
  name: string;
  value: number;
}

export interface Smoothing {
  name: string;
  value: number;
}

export interface DrawStats {
  average: number;
  standardDeviation: number;
  above1: number;
  above2: number;
  below1: number;
  below2: number;
}

export interface MovingAverage {
  score: number;
  trend: TrendValue;
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
  trends: CombinedTrend[];
  lastSuccess: number;
  drawSize: number;
  maxValue: number;
}

export interface ItemStats extends ValueStats {
  isFavorite: boolean;
  Component: FC<ValueComponentProps>;
  smoothingMethod: SmoothingMethod;
}
