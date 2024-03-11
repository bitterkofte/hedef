import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { calendarInitializer } from '../utils/functions'
import { RamadanMonth } from '../utils/ramadanMonth'

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

const initialCalendar: CalendarType[] = [{
  id: 0,
  title: "Teravih",
  calendar: calendarInitializer(),
  color: "#eeeeee"
}];
const localCalendar: CalendarType[] = localStorage.getItem("calendars") ? JSON.parse(localStorage.getItem("calendars") as string) : initialCalendar;
if(!localStorage.getItem("calendars")) localStorage.setItem("calendars", JSON.stringify(initialCalendar))

const initialState: GeneralStateType = {
  calendars: localCalendar,
  selectedCalendar: 0,
}
export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    addCalendar: (state, action: PayloadAction<CalendarType>) => {
      state.calendars.push(action.payload)
    },
    completeDaily: (state, action: PayloadAction<number>) => {
      console.log('data: ', typeof state.calendars)
      // const theDay = state.calendars[state.selectedCalendar].calendar.find(d => d.day === action.payload);
      // state.calendars[state.selectedCalendar].calendar = {...theDay, completed: "yes"}
      const calendarIndex = state.selectedCalendar;
      const dayIndex = state.calendars[calendarIndex].calendar.findIndex(d => d.day === action.payload);
      const currentState = state.calendars[calendarIndex].calendar[dayIndex].completed
      if (dayIndex !== -1) state.calendars[calendarIndex].calendar[dayIndex].completed = currentState !== "yes" ? "yes" : "no";
      localStorage.setItem("calendars", JSON.stringify(state.calendars))
    },
  },
})

export const {
  addCalendar,
  completeDaily,
} = generalSlice.actions
export default generalSlice.reducer