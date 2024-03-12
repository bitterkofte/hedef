import { ramadanMonth } from "./ramadanMonth";

export const calendarInitializer = () =>
  ramadanMonth.map((m) => ({
    ...m,
    timestamp: 1710018000000 + (m.day) * 86400000,
  }));

export const isToday = (timestamp: number, currentTime: number) => {
  return new Date(timestamp).toLocaleDateString('en-GB') === new Date(currentTime).toLocaleDateString('en-GB');
}

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
