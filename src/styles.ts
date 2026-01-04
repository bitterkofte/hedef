import { isToday } from "./utils/functions";

export const dayStyles = (
  isPastLocked: boolean,
  day: any,
  currentTimestamp: number,
  selCal: any
) => {
  const pastDays = day.timestamp < currentTimestamp
  const isToDay = isToday(day.timestamp, currentTimestamp)
  const futureDays = day.timestamp > currentTimestamp
  return `w-8 h-8 text-xs p-1 border flex justify-center items-center rounded-full  disabled:border-neutral-600 disabled:text-neutral-600 md:disabled:border-neutral-600 md:disabled:text-neutral-600 disabled:cursor-default smoother-2
  // ANCHOR PAST DAYS
  ${
    isPastLocked &&
    pastDays &&
    !isToDay
      ? "cursor-default opacity-60"
      : "cursor-pointer opacity-100 md:hover:border-green-600 md:hover:text-green-600"
  }
  // ANCHOR COMPLETED DAYS
  ${
    day.goal.completed === "yes"
      ? "border-green-600 text-green-600 hover:border-green-600 hover:text-green-600"
      : ""
  } 
  // ANCHOR TODAY
  ${
    isToDay &&
    ((selCal.habitFormat === "check" && day.goal.completed !== "yes") ||
      (selCal.habitFormat === "number" && day.goal.performed === 0))
      ? "border-gold text-gold"
      : ""
  } 
  // ANCHOR FUTURE DAYS
  ${
    !isToDay && futureDays
      ? "border-neutral-400 text-neutral-400"
      : ""
  }`;
};
