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

export const getDates = (draws, whiteList, includeAll) => {
  const dates = draws.reduce((acc, draw, idx) => {
    const index = idx + 1;
    if (whiteList.includes(index)) {
      acc.push({
        name: `depuis ${index > 1?"les " + index + " derniers tirages":"le dernier tirage"} (${new Date(draw.date).toLocaleDateString()})`,
        value: draw.date
      });
    }
    return acc;
  }, includeAll?[{
    name: "pour l'ensemble des tirages",
    value: ""
  }]:[]);
  return dates;
};

export const getValuesStats = (maxValue, draws, getDrawValues, date, trendDate) => {

  const values = Array.from(Array(maxValue)).map((_, index) => index+1).reduce((acc,index) => {
    acc.set(index, {
      success: 0,
      trendSuccess: 0
    });
    return acc;
  }, new Map());

  const drawsForTrend = draws.filter(draw => draw.date >= trendDate);
  drawsForTrend.forEach(draw => {
    const vals = getDrawValues(draw);
    vals.forEach(value => {
      const counters = values.get(value);
      counters.trendSuccess += 1;
    });
  });

  const drawsForPeriod = draws.filter(draw => draw.date >= date);
  drawsForPeriod.forEach(draw => {
    const vals = getDrawValues(draw);
    vals.forEach(value => {
      const counters = values.get(value);
      counters.success += 1;
    });
  });

  const trendPeriodSuccesses = Array.from(values).map(([_, {trendSuccess}]) => trendSuccess);
  const average = StatsHelpers.average(trendPeriodSuccesses);
  const standardDeviation = StatsHelpers.standardDeviation(trendPeriodSuccesses);
  const above1 = average + standardDeviation;
  const above2 = average + 2 * standardDeviation;
  const below1 = average - standardDeviation;
  const below2 = average - 2 * standardDeviation;

  const result = Array.from(values).reduce((acc, [value, {success, trendSuccess}]) => {
    let trend = 0;
    if (trendSuccess > above2) {
      trend = 2;
    } else if (trendSuccess > above1) {
      trend = 1;
    } else if (trendSuccess < below2) {
      trend = -2;
    } else if (trendSuccess < below1) {
      trend = -1;
    }
    const percentage =  Math.round((success / drawsForPeriod.length  + Number.EPSILON) * 100) / 100;
    acc.push({
      value: value,
      success: success,
      numberOfDraws: drawsForPeriod.length,
      percentageOfSuccesses: percentage,
      trendSuccess: trendSuccess,
      trend: trend
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
