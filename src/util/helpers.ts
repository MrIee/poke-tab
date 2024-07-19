export const getDistinctValuesFromArrayOfObjects = (
  array: Array<any>,
  key: string
): Array<string> => {
  const unique: Array<any> = [];
  const distinct: Array<any> = [];

  for (let i = 0; i < array.length; i++) {
    if (!unique[array[i][key]]) {
      distinct.push(array[i][key]);
      unique[array[i][key]] = 1;
    }
  }
  return distinct;
};
