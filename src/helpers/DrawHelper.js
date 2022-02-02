class StatsHelpers {
  static average(values) {
    if (!Array.isArray(values) || values.length === 0) {
      return 0;
    }
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }
  static standardDeviation(values){
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

export const isMatching = (list, filter, values) => {
  if (!filter) {
    return true;
  }
  if (!Array.isArray(values) || !values.length) {
    return false;
  }
  if (!list) {
    return false;
  }
  const numbers = new Set(Array.isArray(list)?list:[list]);
  if (filter === "some") {
    return values.some(value => numbers.has(value));
  }
  if (filter === "all") {
    return values.every(value => numbers.has(value));
  }
  return true;
};

export const toDateString = date => date instanceof Date?`${date.getFullYear()}-${date.getMonth() < 9?"0":""}${date.getMonth() + 1}-${date.getDate() < 10?"0":""}${date.getDate()}`:"";

export const getUpdatedList = (list, number, add) => {
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

export const getPeriods = (draws, whiteList, includeAll) => {
  const dates = draws.reduce((acc, draw, idx) => {
    const index = idx + 1;
    if (whiteList.includes(index)) {
      acc.push({
        name: `depuis ${index > 1?"les " + index + " derniers tirages":"le dernier tirage"} (${new Date(draw.date).toLocaleDateString()})`,
        value: index
      });
    }
    return acc;
  }, includeAll?[{
    name: "pour l'ensemble des tirages",
    value: draws.length
  }]:[]);
  return dates;
};

export const getSmoothings = (draws, whiteList, includeAll) => {
  const dates = draws.reduce((acc, draw, idx) => {
    const index = idx + 1;
    if (whiteList.includes(index)) {
      acc.push({
        name: `sur ${index} tirage${index > 1?"s":""}`,
        value: index
      });
    }
    return acc;
  }, includeAll?[{
    name: "pour l'ensemble des tirages",
    value: ""
  }]:[]);
  return dates;
};

const getStats = values => {
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

const getTrend = (stats, value) => {
  if (value > stats.above2) {
    return 2;
  }
  if (value > stats.above1) {
    return 1;
  }
  if (value < stats.below2) {
    return -2;
  }
  if (value < stats.below1) {
    return -1;
  }
  return 0;
};


export const getValuesStats = (maxValue, draws, getDrawValues, period, smoothing) => {

  const drawsByDate = draws.sort((a, b) => a.date - b.date);

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
      }))
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
    const smaScores = Array.from(values).map(([_, v]) => v.trends[index].sma.score);
    const emaScores = Array.from(values).map(([_, v]) => v.trends[index].ema.score);
    const smaStats = getStats(smaScores);
    const emaStats = getStats(emaScores);
    values.forEach(v => {
      const trend = v.trends[index];
      trend.sma.trend = getTrend(smaStats, trend.sma.score);
      trend.ema.trend = getTrend(emaStats, trend.ema.score);
    });
  });

  const result = Array.from(values).reduce((acc, [value, {success, trends}]) => {
    const percentage =  Math.round((success / period  + Number.EPSILON) * 100) / 100;
    acc.push({
      value: value,
      success: success,
      period: period,
      smoothing: smoothing,
      percentageOfSuccesses: percentage,
      trend: trends[0],
      trends: trends
    });
    return acc;
  }, []);
  return result;
};

export const sortValuesStats = (valuesStats, sortCriteria, sortAscending, smoothingMethod) => {
  const result = valuesStats.sort((a, b) => {
    switch (sortCriteria) {
    case "success": {
      if (a.success === b.success) {
        const aScore = a.trend[smoothingMethod].score;
        const bScore = b.trend[smoothingMethod].score;
        return sortAscending?aScore - bScore:bScore - aScore;
      }
      return sortAscending?a.success - b.success:b.success - a.success;
    }
    case "trend": {
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
    default: // "value"
      return sortAscending?a[sortCriteria] - b[sortCriteria]:b[sortCriteria] - a[sortCriteria];
    }
  });
  return result;
};
