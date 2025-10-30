export const generateColorFromString = (string: string, opacity: number = 0.9) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = Math.abs(hash) % 360;

  const s = 60 + (Math.abs(hash >> 8) % 30);

  const l = 35 + (Math.abs(hash >> 16) % 30);

  return `hsla(${h}, ${s}%, ${l}%, ${opacity})`;
};
