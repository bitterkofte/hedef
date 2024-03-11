import { ramadanMonth } from "./ramadanMonth";

export const timestampGenerator = () =>
  ramadanMonth.map((m) => ({
    ...m,
    timestamp: 1710018000000 + (m.day) * 86400000,
  }));

export const dateFormatter = (timestamp: number) => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // era: "narrow",
  };
  const formattedDate = new Intl.DateTimeFormat("tr-tr", options).format(date);
  return formattedDate;
};
