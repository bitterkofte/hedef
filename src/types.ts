export interface Months {
  day: number;
  timestamp: number; // Make it optional if it's not always present
  goal: {
    completed: string;
  };
}

export type CalendarType = {
  id: number;
  title: string;
  description?: string;
  calendar: Months[];
  color: string;
};
export interface SettingsType {
  selectedCalendar: number;
  isPastLocked: boolean;
  view: "grid" | "list";
}
