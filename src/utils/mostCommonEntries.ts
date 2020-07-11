interface History {
  [key: string]: number;
}

function mostCommonEntries (array: string[], limit?: number): string[] {
  const history: History = {}

  array.forEach((item) => {
    if (history.hasOwnProperty(item)) {
      history[item] = history[item] + 1;
    } else {
      history[item] = 1;
    }
  })

  const sorted = Object.entries(history)
    .sort((a, b) => {
      if (a[1] > b[1]) return -1;

      if (a[1] < b[1]) return 1;

      return 0;
    })

  const withMultipleTopEntries = sorted
    .filter((item, index) => !sorted[index - 1] || item[1] === sorted[0][1])
    .map(item => item[0])
  
  if (limit) return withMultipleTopEntries.slice(0, limit)

  return withMultipleTopEntries;
};

export default mostCommonEntries;
