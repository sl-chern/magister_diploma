export const jwtExpToMilliseconds = (exp: string) => {
  const timeLabel = exp.at(-1);
  const time = Number(exp.slice(0, -1));
  switch (timeLabel) {
    case "s":
      return time * 1000;
    case "m":
      return time * 1000 * 60;
    case "h":
      return time * 1000 * 60 * 60;
  }
};
