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
  result.sort();
  return result;
};

export const getValuesByCount = (maxValue, draws, date, getDrawValues) => {

  const values = Array.from(Array(maxValue)).map((_, index) => index+1).reduce((acc,index) => {
    acc.set(index, 0);
    return acc;
  }, new Map());

  draws.filter(draw => draw.date >= date).forEach(draw => {
    const vals = getDrawValues(draw);
    vals.forEach(value => values.set(value, values.get(value) + 1));
  });

  const result = Array.from(Array.from(values).reduce((acc, [value, counter]) => {
    if (!acc.has(counter)) {
      acc.set(counter, []);
    }
    const list = [...(acc.get(counter)), value];
    list.sort((valueA, valueB) => {
      if (valueA > valueB) {
        return 1;
      }
      if (valueB > valueA) {
        return -1;
      }
      return 0;
    });
    acc.set(counter, list);
    return acc;
  }, new Map())).sort(([counterA], [counterB]) => {
    if (counterA > counterB) {
      return -1;
    }
    if (counterB > counterA) {
      return 1;
    }
    return 0;
  });
  return result;
};

export const getValuesStats = (maxValue, draws, getDrawValues, numberOfDrawsForTrend, numberOfPeriodsForTrend) => {

  const values = Array.from(Array(maxValue)).map((_, index) => index+1).reduce((acc,index) => {
    acc.set(index, {
      successes: 0,
      weightings: Array.from(Array(numberOfPeriodsForTrend)).map(() => 0)
    });
    return acc;
  }, new Map());

  const drawsByDate = draws.sort((a, b) => a.date - b.date).slice(0, numberOfDrawsForTrend + numberOfPeriodsForTrend + 1);

  drawsByDate.forEach((draw, index) => {
    const vals = getDrawValues(draw);
    vals.forEach(value => {
      const stats = values.get(value);
      stats.successes += 1;
      stats.weightings.forEach((weighting, idx) => {
        if (index < numberOfDrawsForTrend + idx && index >= idx) {
          stats.weightings[idx] =  weighting + numberOfDrawsForTrend + idx - index;
        }
      });
    });
  });

  const result = Array.from(values).reduce((acc, [value, {successes, weightings}]) => {
    const average = StatsHelpers.average(weightings);
    const standardDeviation = StatsHelpers.standardDeviation(weightings);
    const above1 = average + standardDeviation;
    const above2 = average + 2 * standardDeviation;
    const below1 = average - standardDeviation;
    const below2 = average - 2 * standardDeviation;
    const weighting = weightings[0];
    let trend = 0;
    if (weighting > above2) {
      trend = 2;
    } else if (weighting > above1) {
      trend = 1;
    } else if (weighting < below2) {
      trend = -2;
    } else if (weighting < below1) {
      trend = -1;
    }
    const percentage =  Math.round((successes / numberOfDrawsForTrend  + Number.EPSILON) * 100) / 100;
    acc.push({
      value: value,
      successes: successes,
      numberOfDraws: numberOfDrawsForTrend,
      percentageOfSuccesses: percentage,
      trend: trend
    });
    return acc;
  }, []);
  return result;
};