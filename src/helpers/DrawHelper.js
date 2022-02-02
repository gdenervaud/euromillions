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

export const getValuesStats = (maxValue, draws, getDrawValues, period, smoothing) => {

  const drawsByDate = draws.sort((a, b) => a.date - b.date);

  const values = Array.from(Array(maxValue)).map((_, index) => index+1).reduce((acc,index) => {
    acc.set(index, {
      success: 0,
      sma: Array.from(Array(period)).map((_, index) => ({
        success: 0,
        trend: 0,
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
      for (let j=i; j >= i-smoothing+1 && j >= 0; j--) {
        if (j < period) {
          counters.sma[j].success += 1;
        }
      }
    });
  }

  Array.from(Array(period)).forEach((_, index) => {
    const vals = Array.from(values).map(([_, v]) => v.sma[index].success);
    const average = StatsHelpers.average(vals);
    const standardDeviation = StatsHelpers.standardDeviation(vals);
    const above1 = average + standardDeviation;
    const above2 = average + 2 * standardDeviation;
    const below1 = average - standardDeviation;
    const below2 = average - 2 * standardDeviation;
    values.forEach(v => {
      const sma = v.sma[index];
      if (sma.success > above2) {
        sma.trend = 2;
      } else if (sma.success > above1) {
        sma.trend = 1;
      } else if (sma.success < below2) {
        sma.trend = -2;
      } else if (sma.success < below1) {
        sma.trend = -1;
      }
    });
  });

  const result = Array.from(values).reduce((acc, [value, {success, sma}]) => {
    const percentage =  Math.round((success / period  + Number.EPSILON) * 100) / 100;
    acc.push({
      value: value,
      success: success,
      period: period,
      smoothing: smoothing,
      percentageOfSuccesses: percentage,
      trendSuccess: sma[0].success,
      trend: sma[0].trend,
      sma: sma
    });
    return acc;
  }, []);
  return result;
};

export const sortValuesStats = (valuesStats, sortCriteria, sortAscending) => {
  const result = valuesStats.sort((a, b) => {
    if (sortCriteria !== "value" && a[sortCriteria] === b[sortCriteria]) {
      const secondCriteria = "trendSuccess";
      if (sortCriteria === "trend" && a[secondCriteria] === b[secondCriteria]) {
        const thirdCriteria = "success";
        return sortAscending?a[thirdCriteria] - b[thirdCriteria]:b[thirdCriteria] - a[thirdCriteria];
      }
      return sortAscending?a[secondCriteria] - b[secondCriteria]:b[secondCriteria] - a[secondCriteria];
    }
    return sortAscending?a[sortCriteria] - b[sortCriteria]:b[sortCriteria] - a[sortCriteria];
  });
  return result;
};
