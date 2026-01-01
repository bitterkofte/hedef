// import { initialCalendar, initialSettings } from "../redux/generalSlice";
import { CalendarType, SettingsType } from "../types";
// import { ramadanMonth } from "./ramadanMonth";

// export const calendarInitializer = () =>
//   ramadanMonth.map((m) => ({
//     ...m,
//     // timestamp: 1710018000000 + (m.day) * 86400000,
//     //PIN reactiveolmalı
//     timestamp: 1740733200000 + m.day * 86400000,
//   }));

export const calendarInitializer = () => {
  const days = [];
  // const year = 2026;
  const year = new Date().getFullYear();
  for (let i = 0; i < 365; i++) {
    const date = new Date(year, 0, 1 + i);
    days.push({
      day: i + 1,
      timestamp: date.getTime(),
      goal: {
        completed: "no",
      },
    });
  }
  return days;
};

export const initialCalendar: CalendarType = {
  id: 0,
  title: "Your Goal",
  calendar: calendarInitializer(),
  color: "#eeeeee",
};

export const initialSettings: SettingsType = {
  selectedCalendar: 0,
  isPastLocked: true,
  view: "grid",
};

export const isToday = (timestamp: number, currentTime: number) => {
  return (
    new Date(timestamp).toLocaleDateString("en-GB") ===
    new Date(currentTime).toLocaleDateString("en-GB")
  );
};

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

export const localSetItem = (key: string, value: object) => {
  const item = JSON.parse(localStorage.getItem(key) || "{}");
  localStorage.setItem(key, JSON.stringify({ ...item, ...value }));
};

export const LocalStorageCorrection = () => {
  const calendars = JSON.parse(localStorage.getItem("calendars") || "{}");
  const settings = JSON.parse(localStorage.getItem("settings") || "{}");

  // calendars
  if (!calendars) localSetItem("calendars", [initialCalendar]);

  // settings
  if (!settings) localSetItem("settings", initialSettings);
  if (!settings.view) localSetItem("settings", { view: "grid" });
  if (!settings.isPastLocked) localSetItem("settings", { isPastLocked: false });
  if (!settings.selectedCalendar)
    localSetItem("settings", { selectedCalendar: 0 });
};
