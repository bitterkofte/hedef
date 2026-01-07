import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  calendarInitializer,
  initialCalendar,
  localSetItem,
  LocalStorageCorrection,
} from "../utils/functions";
import { toast } from "sonner";
import { CalendarType } from "../types";
import { pushCalendarsToPB } from "./pbThunks";
import { fetchAllFromPB } from "./fetchThunks";


LocalStorageCorrection();

export interface GeneralStateType {
  calendars: CalendarType[];
  selectedCalendar: number;
  isPastLocked: boolean;
  view: "grid" | "list";
  ACM: boolean;
  NIM: boolean;
  editingDay: number | null;
  hType: "daily" | "weekly";
  hFormat: "check" | "number" | "time";
  hTarget: number;
  isSettingsOpen: boolean;
  isAccountOpen: boolean;
  cloudSyncStatus: "idle" | "loading" | "error" | "success";
}

const storedCalendars = JSON.parse(localStorage.getItem("calendars") || "null");
const calendars = Array.isArray(storedCalendars) && storedCalendars.length > 0 
  ? storedCalendars 
  : [initialCalendar];

const storedSettings = JSON.parse(localStorage.getItem("settings") || "{}");
const selectedCalendar = (typeof storedSettings.selectedCalendar === "number" && storedSettings.selectedCalendar >= 0 && storedSettings.selectedCalendar < calendars.length)
  ? storedSettings.selectedCalendar
  : 0;

const initialState: GeneralStateType = {
  calendars,
  selectedCalendar,
  isPastLocked: storedSettings.isPastLocked ?? true,
  view: storedSettings.view ?? "grid",
  ACM: false,
  NIM: false,
  editingDay: null,
  hType: "daily",
  hFormat: "check",
  hTarget: 0,
  isSettingsOpen: false,
  isAccountOpen: false,
  cloudSyncStatus: "idle",
};

// SECTION SLICE
export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    addCalendar: (state) => {
      if (state.hFormat !== "check" && (state.hTarget === null || state.hTarget <= 0)) {
        toast.error("Target cannot be negative or zero!");
        return;
      }
      if (state.hTarget.toString().length >= 3 || state.hTarget > 999) {
        toast.error("Target cannot be greater than 999");
        return;
      }
      if (state.calendars.length < 10) {
        state.calendars.push({
          id: Date.now(),
          title: "Your Goal",
          calendar: calendarInitializer(),
          color: "#eeeeee",
          habitType: state.hType,
          habitFormat: state.hFormat,
          target: state.hFormat === "check" ? 0 : state.hTarget,
        });
        state.ACM = false;
        state.cloudSyncStatus = "idle";
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
    setNIM: (state, action: PayloadAction<boolean>) => {
      state.NIM = action.payload;
    },
    setSettingsOpen: (state, action: PayloadAction<boolean>) => {
      state.isSettingsOpen = action.payload;
    },
    setAccountOpen: (state, action: PayloadAction<boolean>) => {
      state.isAccountOpen = action.payload;
    },
    setEditingDay: (state, action: PayloadAction<number | null>) => {
      state.editingDay = action.payload;
    },
    setHType: (state, action: PayloadAction<"daily" | "weekly">) => {
      state.hType = action.payload;
    },
    setHFormat: (state, action: PayloadAction<"check" | "number" | "time">) => {
      state.hFormat = action.payload;
    },
    setHTarget: (state, action: PayloadAction<number>) => {
      state.hTarget = action.payload;
    },
    setSelectedCalendar: (state, action: PayloadAction<number>) => {
      state.selectedCalendar = action.payload;
      localSetItem("settings", { selectedCalendar: action.payload });
    },
    completeDaily: (state, action: PayloadAction<number>) => {
      const calendarIndex = state.selectedCalendar;
      const dayIndex = state.calendars[calendarIndex].calendar.findIndex(
        (d) => d.day === action.payload
      );
      const currentState =
        state.calendars[calendarIndex].calendar[dayIndex].goal.completed;
      if (dayIndex !== -1)
        state.calendars[calendarIndex].calendar[dayIndex].goal.completed =
          currentState !== "yes" ? "yes" : "no";
      state.cloudSyncStatus = "idle";
      localSetItem("calendars", state.calendars);
    },
    updatePerformed: (
      state,
      action: PayloadAction<{ day: number; performed: number }>
    ) => {
      const { day, performed } = action.payload;
      const calendarIndex = state.selectedCalendar;
      const dayIndex = state.calendars[calendarIndex].calendar.findIndex(
        (d) => d.day === day
      );
      if (dayIndex !== -1) {
        state.calendars[calendarIndex].calendar[dayIndex].goal.performed =
          performed;
        const target = state.calendars[calendarIndex].target;
        state.calendars[calendarIndex].calendar[dayIndex].goal.completed =
          performed >= target ? "yes" : "no";
      }
      state.cloudSyncStatus = "idle";
      localSetItem("calendars", state.calendars);
    },
    updateTitle: (state, action: PayloadAction<string>) => {
      state.calendars[state.selectedCalendar].title = action.payload;
      state.cloudSyncStatus = "idle";
      localStorage.setItem("calendars", JSON.stringify(state.calendars));
    },
    updateDescription: (state, action: PayloadAction<string>) => {
      state.calendars[state.selectedCalendar].description = action.payload;
      state.cloudSyncStatus = "idle";
      localStorage.setItem("calendars", JSON.stringify(state.calendars));
    },
    deleteCalendar: (state) => {
      if (state.calendars.length > 1) {
        state.calendars = state.calendars.filter(
          (_, i) => i !== state.selectedCalendar
        );
        state.selectedCalendar = 0;
        state.cloudSyncStatus = "idle";
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
        state.cloudSyncStatus = "idle";
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
      state.cloudSyncStatus = "idle";
      localSetItem("settings", { isPastLocked: state.isPastLocked });
    },
    toggleView: (state) => {
      state.view = state.view === "grid" ? "list" : "grid";
      state.cloudSyncStatus = "idle";
      localSetItem("settings", { view: state.view });
    },
    setCloudSyncStatus: (state, action: PayloadAction<GeneralStateType["cloudSyncStatus"]>) => {
      state.cloudSyncStatus = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("calendars");
      localStorage.removeItem("settings");
      state.calendars = [initialCalendar];
      state.selectedCalendar = 0;
      state.isPastLocked = true;
      state.view = "grid";
      state.cloudSyncStatus = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(pushCalendarsToPB.pending, (state) => {
        state.cloudSyncStatus = "loading";
      })
      .addCase(pushCalendarsToPB.fulfilled, (state) => {
        state.cloudSyncStatus = "success";
      })
      .addCase(pushCalendarsToPB.rejected, (state) => {
        state.cloudSyncStatus = "error";
      })
      .addCase(fetchAllFromPB.fulfilled, (state, action) => {
        if (action.payload.calendars.length > 0) {
          state.calendars = action.payload.calendars;
          localSetItem("calendars", state.calendars); // Sync local cache
        }
        if (action.payload.settings) {
          const s = action.payload.settings;
          if (s.selectedCalendar !== undefined) state.selectedCalendar = s.selectedCalendar;
          if (s.isPastLocked !== undefined) state.isPastLocked = s.isPastLocked;
          if (s.view !== undefined) state.view = s.view;
          localSetItem("settings", { 
            selectedCalendar: state.selectedCalendar,
            isPastLocked: state.isPastLocked,
            view: state.view
          }); // Sync local cache
        }
        state.cloudSyncStatus = "success";
      });
  }
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
  setNIM,
  setSettingsOpen,
  setAccountOpen,
  setEditingDay,
  updatePerformed,
  setHType,
  setHFormat,
  setHTarget,
  setCloudSyncStatus,
  logout,
} = generalSlice.actions;
export default generalSlice.reducer;
