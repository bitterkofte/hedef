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
  return `w-8 h-8 text-xs p-1 border flex justify-center items-center rounded-full relative overflow-hidden disabled:border-neutral-600 disabled:text-neutral-600 md:disabled:border-neutral-600 md:disabled:text-neutral-600 disabled:cursor-default smoother-2
  // ANCHOR PAST DAYS
  ${
    isPastLocked &&
    pastDays &&
    !isToDay
       ? "cursor-default opacity-60"
       : `cursor-pointer opacity-100 ${
           selCal.habitFormat === "check"
             ? "md:hover:border-green-600 md:hover:text-green-600"
             : "md:hover:border-yellow-600 md:hover:border-[3px] md:hover:font-black"
         }`
   }
  // ANCHOR COMPLETED DAYS
  ${
    day.goal.completed === "yes"
      ? `border-green-600 md:hover:border-white ${selCal.habitFormat === 'check' ? 'bg-green-600 md:hover:text-white' : 'bg-white'}`
      : ""
  } 
  // ANCHOR TODAY
  ${
    isToDay &&
    ((selCal.habitFormat === "check" && day.goal.completed !== "yes") ||
      ((selCal.habitFormat === "number" || selCal.habitFormat === "time") && day.goal.performed === 0))
      ? "border-gold text-gold"
      : ""
  } 
  ${
    (selCal.habitFormat === "number" || selCal.habitFormat === "time") && day.goal.performed > 0 && day.goal.completed !== "yes"
      ? "text-white"
      : ""
  }
  // ANCHOR FUTURE DAYS
  ${
    !isToDay && futureDays
      ? "border-neutral-400 text-neutral-400"
      : ""
  }`;
};

export const dayProgressStyle = (day: any, selCal: any) => {
  if ((selCal.habitFormat === "number" || selCal.habitFormat === "time")) {
    const percentage = Math.min((day.goal.performed / selCal.target) * 100, 100);
    const color = day.goal.completed === "yes" ? "#16a34a" : "#616161";
    return {
      height: `${percentage}%`,
      backgroundColor: color,
    };
  }
  return { height: "0%" };
};
