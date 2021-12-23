
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