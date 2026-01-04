// import { initialCalendar, initialSettings } from "../redux/generalSlice";
import { toast, Toaster } from "sonner";
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
        performed: 0
      },
    });
  }
  return days;
};

export const initialCalendar: CalendarType = {
  id: Date.now(),
  title: "Your Goal",
  calendar: calendarInitializer(),
  color: "#eeeeee",
  habitType: "daily",
  habitFormat: "check",
  target: 0,
};

export const initialSettings: SettingsType = {
  selectedCalendar: 0,
  isPastLocked: true,
  view: "grid",
  version: 1,
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
  try {
    const raw = localStorage.getItem(key);
    const item = raw ? JSON.parse(raw) : {};

    // If it's an array, we probably don't want to merge it like an object
    if (Array.isArray(value)) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, JSON.stringify({ ...item, ...value }));
    }
  } catch (e) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const LocalStorageCorrection = () => {
  try {
    // SECTION 1. Correct Settings
    const rawSettings = localStorage.getItem("settings");
    let settings = rawSettings ? JSON.parse(rawSettings) : null;

    if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
      settings = { ...initialSettings };
    } else {
      // Add missing keys from initialSettings
      Object.keys(initialSettings).forEach((key) => {
        if (!(key in settings)) {
          (settings as any)[key] = initialSettings[key as keyof SettingsType];
        }
      });

      // Remove extra keys not in initialSettings
      Object.keys(settings).forEach((key) => {
        if (!(key in initialSettings)) {
          delete (settings as any)[key];
        }
      });
    }
    localStorage.setItem("settings", JSON.stringify(settings));

    // SECTION 2. Correct Calendars
    const rawCalendars = localStorage.getItem("calendars");
    let calendars = rawCalendars ? JSON.parse(rawCalendars) : null;

    if (!Array.isArray(calendars) || calendars.length === 0) {
      calendars = [initialCalendar];
    } else {
      // Validate each calendar object in the array
      calendars = calendars.map((cal: any) => {
        const validatedCal = { ...cal };
        validatedCal.calendar = dayCheck(validatedCal.calendar);

        // Ensure required keys exist
        if (validatedCal.id === undefined) validatedCal.id = Date.now();
        if (!validatedCal.title) validatedCal.title = "Untitled Goal";
        if (!validatedCal.color) validatedCal.color = "#eeeeee";
        if (!validatedCal.habitType) validatedCal.habitType = "daily";
        if (!validatedCal.habitFormat) validatedCal.habitFormat = "check";
        if (!validatedCal.calendar)
          validatedCal.calendar = calendarInitializer();

        // Optional: Remove extra keys from individual calendar objects
        const allowedCalKeys = [
          "id",
          "title",
          "description",
          "calendar",
          "color",
          "habitType",
          "habitFormat",
          "target"
        ];
        Object.keys(validatedCal).forEach((key) => {
          if (!allowedCalKeys.includes(key)) {
            delete validatedCal[key];
          }
        });

        return validatedCal;
      });
    }
    localStorage.setItem("calendars", JSON.stringify(calendars));
  } catch (error) {
    toast.error("Local storage correction failed, resets might be necessary");
    // Fallback to defaults if everything is corrupted
    if (!localStorage.getItem("settings")) {
      localStorage.setItem("settings", JSON.stringify(initialSettings));
    }
    if (!localStorage.getItem("calendars")) {
      localStorage.setItem("calendars", JSON.stringify([initialCalendar]));
    }
  }
};

const dayCheck = (days: any) => {
  if (!days || !Array.isArray(days) || days.length === 0) return calendarInitializer();

  // If already migrated (has goal property), return as is to avoid resetting 'performed'
  if (days[0].goal) return days;

  const newDays = days.map((d: any) => {
    if (d.completed === "yes") {
      return {
        ...d,
        goal: {
          completed: "yes",
          performed: 0,
        },
      };
    } else {
      return {
        ...d,
        goal: {
          completed: "no",
          performed: 0,
        },
      };
    }
  });
  return newDays;
};

export const dayViewHandler = (currentCalendarData: any, day: any, currentTimestamp: number) => {
  if(currentCalendarData.habitFormat === "check") {
    return day.day
  }
  else if(currentCalendarData.habitFormat === "number") {
    if (currentTimestamp < day.timestamp) return day.day
    else return day.goal.performed
  }
  else if(currentCalendarData.habitFormat === "time"){
    if (currentTimestamp < day.timestamp) return day.day
    return day.goal.performed
  }
  else return day.day
}