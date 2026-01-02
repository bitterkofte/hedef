import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  calendarInitializer,
  initialCalendar,
  localSetItem,
  LocalStorageCorrection,
} from "../utils/functions";
// import { RamadanMonth } from "../utils/ramadanMonth";
import { toast } from "sonner";
import { CalendarType } from "../types";

LocalStorageCorrection();

// export const initialCalendar: CalendarType = {
//   id: 0,
//   title: "Your Goal",
//   calendar: calendarInitializer(),
//   color: "#eeeeee",
// };
// export const initialSettings: SettingsType = {
//   selectedCalendar: 0,
//   isPastLocked: true,
//   view: "grid",
// };
export interface GeneralStateType {
  calendars: CalendarType[];
  selectedCalendar: number;
  isPastLocked: boolean;
  view: "grid" | "list";
  ACM: boolean;
  hType: "daily" | "weekly";
  hFormat: "check" | "number" | "time";
}

const initialState: GeneralStateType = {
  calendars: JSON.parse(localStorage.getItem("calendars") || "null") || [
    initialCalendar,
  ],
  selectedCalendar:
    JSON.parse(localStorage.getItem("settings") || "{}").selectedCalendar ?? 0,
  isPastLocked:
    JSON.parse(localStorage.getItem("settings") || "{}").isPastLocked ?? true,
  view: JSON.parse(localStorage.getItem("settings") || "{}").view ?? "grid",
  ACM: false,
  hType: "daily",
  hFormat: "check"
};

// SECTION SLICE
export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    addCalendar: (state) => {
      if (state.calendars.length < 10) {
        state.calendars.push({
          id: Date.now(),
          title: "Your Goal",
          calendar: calendarInitializer(),
          color: "#eeeeee",
          habitType: state.hType,
          habitFormat: state.hFormat,
        });
        state.ACM = false;
        localSetItem("calendars", state.calendars);
        localSetItem("settings", {
          selectedCalendar: state.calendars.length - 1,
        });
        state.selectedCalendar = state.calendars.length - 1;
      } else toast.error("You cannot add more than 10 goals 😥");
    },
    setACM: (state, action: PayloadAction<boolean>) => {
      state.ACM = action.payload;
    },
    setHType: (state, action: PayloadAction<"daily" | "weekly">) => {
      state.hType = action.payload;
    },
    setHFormat: (state, action: PayloadAction<"check" | "number" | "time">) => {
      state.hFormat = action.payload;
    },
    setSelectedCalendar: (state, action: PayloadAction<number>) => {
      state.selectedCalendar = action.payload;
      localSetItem("settings", { selectedCalendar: action.payload });
    },
    completeDaily: (state, action: PayloadAction<number>) => {
      // console.log('data: ', typeof state.calendars)
      // const theDay = state.calendars[state.selectedCalendar].calendar.find(d => d.day === action.payload);
      // state.calendars[state.selectedCalendar].calendar = {...theDay, completed: "yes"}
      const calendarIndex = state.selectedCalendar;
      const dayIndex = state.calendars[calendarIndex].calendar.findIndex(
        (d) => d.day === action.payload
      );
      const currentState =
        state.calendars[calendarIndex].calendar[dayIndex].goal.completed;
      if (dayIndex !== -1)
        state.calendars[calendarIndex].calendar[dayIndex].goal.completed =
          currentState !== "yes" ? "yes" : "no";
      localSetItem("calendars", state.calendars);
    },
    updateTitle: (state, action: PayloadAction<string>) => {
      // const day0 = state.calendars[state.selectedCalendar].calendar.find(
      //   (d) => d.day === 0
      // );
      // const day30 = state.calendars[state.selectedCalendar].calendar.find(
      //   (d) => d.day === 30
      // );
      // const isTeravih = day0 && !day30;

      // const incTer = action.payload.toLowerCase().includes("teravih");

      // if (incTer && !isTeravih) {
      //   state.calendars[state.selectedCalendar].calendar = [
      //     {
      //       day: 0,
      //       completed: "not yet",
      //       timestamp: 1740690000000,
      //     },
      //     ...state.calendars[state.selectedCalendar].calendar,
      //   ];
      //   state.calendars[state.selectedCalendar].calendar = state.calendars[
      //     state.selectedCalendar
      //   ].calendar.filter((d) => d.day !== 30);
      // }
      // if (!incTer && isTeravih) {
      //   state.calendars[state.selectedCalendar].calendar = state.calendars[
      //     state.selectedCalendar
      //   ].calendar.filter((d) => d.day !== 0);
      //   state.calendars[state.selectedCalendar].calendar.push({
      //     day: 30,
      //     completed: "not yet",
      //     timestamp: 1743282000000,
      //   });
      // }
      state.calendars[state.selectedCalendar].title = action.payload;
      localStorage.setItem("calendars", JSON.stringify(state.calendars));
    },
    updateDescription: (state, action: PayloadAction<string>) => {
      state.calendars[state.selectedCalendar].description = action.payload;
      localStorage.setItem("calendars", JSON.stringify(state.calendars));
    },
    deleteCalendar: (state) => {
      if (state.calendars.length > 1) {
        state.calendars = state.calendars.filter(
          (_, i) => i !== state.selectedCalendar
        );
        state.selectedCalendar = 0;
        localStorage.setItem("calendars", JSON.stringify(state.calendars));
        localStorage.setItem(
          "settings",
          JSON.stringify({ selectedCalendar: 0 })
        );
      } else toast.error("You cannot delete all calendars");
    },
    deleteSelectedCalendar: (state, action: PayloadAction<number>) => {
      const wheeled = action.payload;
      if (state.calendars.length > 1) {
        state.calendars = state.calendars.filter((_, i) => i !== wheeled);
        localStorage.setItem("calendars", JSON.stringify(state.calendars));
        if (
          (state.selectedCalendar === wheeled &&
            state.selectedCalendar === 0) ||
          state.selectedCalendar < wheeled
        )
          return;
        state.selectedCalendar = state.selectedCalendar - 1;
        localSetItem("settings", { selectedCalendar: state.selectedCalendar });
      } else toast.error("You cannot delete all calendars");
    },
    togglePastLocked: (state) => {
      state.isPastLocked = !state.isPastLocked;
      localSetItem("settings", { isPastLocked: state.isPastLocked });
    },
    toggleView: (state) => {
      state.view = state.view === "grid" ? "list" : "grid";
      localSetItem("settings", { view: state.view });
    },
    // toggleDayZero: (state) => {
    //   const isDayZero = !!state.calendars[state.selectedCalendar].calendar.find(
    //     (d) => d.day === 0
    //   );
    //   if (isDayZero)
    //     state.calendars[state.selectedCalendar].calendar = state.calendars[
    //       state.selectedCalendar
    //     ].calendar.filter((d) => d.day !== 0);
    //   else
    //     state.calendars[state.selectedCalendar].calendar = [
    //       {
    //         day: 0,
    //         completed: "not yet",
    //         timestamp: 1710028800000,
    //       },
    //       ...state.calendars[state.selectedCalendar].calendar,
    //     ];
    //   localStorage.setItem("calendars", JSON.stringify(state.calendars));
    // },
  },
});

export const {
  addCalendar,
  setSelectedCalendar,
  completeDaily,
  updateTitle,
  updateDescription,
  deleteCalendar,
  deleteSelectedCalendar,
  // toggleDayZero,
  togglePastLocked,
  toggleView,
  setACM,
  setHType,
  setHFormat,
} = generalSlice.actions;
export default generalSlice.reducer;
