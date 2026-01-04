export interface Months {
  day: number;
  timestamp: number;
  goal: {
    completed: string;
    performed: number;
  };
}

export type CalendarType = {
  id: number;
  title: string;
  description?: string;
  calendar: Months[];
  color: string;
  habitType: "daily" | "weekly";
  habitFormat: "check" | "number" | "time";
  target: number;
};
export interface SettingsType {
  selectedCalendar: number;
  isPastLocked: boolean;
  view: "grid" | "list";
  version: number;
}

// export type ACM = {
//   isACMVisible: boolean;
//   hType: "daily" | "weekly";
//   hFormat: "check" | "number" | "time";
// };
