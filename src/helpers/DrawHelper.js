
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
