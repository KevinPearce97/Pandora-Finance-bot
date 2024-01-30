export const convertSecondsToMinuteSecond = (time: number) => {
  const minutes: string = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds: string = (time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const convertTimestampToMMDDYYYY = (timestamp: number): string => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  return date.toLocaleDateString("en-US", options);
};
