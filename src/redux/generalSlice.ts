import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { calendarInitializer } from '../utils/functions'
import { RamadanMonth } from '../utils/ramadanMonth'
import { toast } from 'sonner'

export type CalendarType = {
  id: number
  title: string
  description?: string
  calendar: RamadanMonth[]
  color: string
}
export interface GeneralStateType {
  calendars: CalendarType[]
  selectedCalendar: number
}

const initialCalendar: CalendarType = {
  id: 0,
  title: "Your Goal",
  calendar: calendarInitializer(),
  color: "#eeeeee"
};
const localCalendar: CalendarType[] = localStorage.getItem("calendars") ? JSON.parse(localStorage.getItem("calendars") as string) : [initialCalendar];
const localSelectedCalendar = localStorage.getItem("settings") ? JSON.parse(localStorage.getItem("settings") as string).selectedCalendar : 0;
if(!localStorage.getItem("calendars")) localStorage.setItem("calendars", JSON.stringify([initialCalendar]))
if(!localStorage.getItem("settings")) localStorage.setItem("settings", JSON.stringify({selectedCalendar: 0}))

const initialState: GeneralStateType = {
  calendars: localCalendar,
  selectedCalendar: localSelectedCalendar,
}
export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    addCalendar: (state) => {
      if (state.calendars.length < 10){
        state.calendars.push({
          id: Date.now(),
          title: "Your Goal",
          calendar: calendarInitializer(),
          color: "#eeeeee"
        });
        state.selectedCalendar = state.calendars.length-1;
        localStorage.setItem("calendars", JSON.stringify(state.calendars))
        localStorage.setItem("settings", JSON.stringify({selectedCalendar: state.calendars.length-1}))
      }
      else toast.error("You cant add more than 10 goals 😥")
    },
    setSelectedCalendar: (state, action: PayloadAction<number>) => {
      state.selectedCalendar = action.payload;
      localStorage.setItem("settings", JSON.stringify({selectedCalendar: action.payload}))
    },
    completeDaily: (state, action: PayloadAction<number>) => {
      // console.log('data: ', typeof state.calendars)
      // const theDay = state.calendars[state.selectedCalendar].calendar.find(d => d.day === action.payload);
      // state.calendars[state.selectedCalendar].calendar = {...theDay, completed: "yes"}
      const calendarIndex = state.selectedCalendar;
      const dayIndex = state.calendars[calendarIndex].calendar.findIndex(d => d.day === action.payload);
      const currentState = state.calendars[calendarIndex].calendar[dayIndex].completed
      if (dayIndex !== -1) state.calendars[calendarIndex].calendar[dayIndex].completed = currentState !== "yes" ? "yes" : "no";
      localStorage.setItem("calendars", JSON.stringify(state.calendars))
    },
    updateTitle: (state, action: PayloadAction<string>) => {
      state.calendars[state.selectedCalendar].title = action.payload
      localStorage.setItem("calendars", JSON.stringify(state.calendars))
    },
    updateDescription: (state, action: PayloadAction<string>) => {
      state.calendars[state.selectedCalendar].description = action.payload
      localStorage.setItem("calendars", JSON.stringify(state.calendars))
    },
    deleteCalendar: (state) => {
      if (state.calendars.length > 1) {
        state.calendars = state.calendars.filter((_, i) => i !== state.selectedCalendar)
        state.selectedCalendar = 0;
        localStorage.setItem("calendars", JSON.stringify(state.calendars))
        localStorage.setItem("settings", JSON.stringify({selectedCalendar: 0}))
      } else toast.error("You cannot delete all calendars")
    },
    deleteSelectedCalendar: (state, action: PayloadAction<number>) => {
      const wheeled = action.payload;
      if (state.calendars.length > 1) {
        state.calendars = state.calendars.filter((_, i) => i !== wheeled)
        localStorage.setItem("calendars", JSON.stringify(state.calendars))
        if ((state.selectedCalendar === wheeled && state.selectedCalendar === 0) || state.selectedCalendar < wheeled) return
        state.selectedCalendar = state.selectedCalendar-1;
        localStorage.setItem("settings", JSON.stringify({selectedCalendar: state.selectedCalendar}))
      } else toast.error("You cannot delete all calendars")
    },
    toggleDayZero: (state) => {
      const isDayZero = !!state.calendars[state.selectedCalendar].calendar.find(d => d.day === 0)
      if (isDayZero) state.calendars[state.selectedCalendar].calendar = state.calendars[state.selectedCalendar].calendar.filter(d => d.day !== 0)
      else state.calendars[state.selectedCalendar].calendar = [
        {
          day: 0,
          completed: "not yet",
          timestamp: 1710028800000
        },
        ...state.calendars[state.selectedCalendar].calendar
      ]
      localStorage.setItem("calendars", JSON.stringify(state.calendars))
    },
  },
})

export const {
  addCalendar,
  setSelectedCalendar,
  completeDaily,
  updateTitle,
  updateDescription,
  deleteCalendar,
  deleteSelectedCalendar,
  toggleDayZero,
} = generalSlice.actions
export default generalSlice.reducer