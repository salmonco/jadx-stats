export const getKeyByValue = <T extends Record<string, string>>(obj: T, value: T[keyof T]): keyof T | undefined => {
  return (Object.keys(obj) as (keyof T)[]).find((k) => obj[k] === value);
};
