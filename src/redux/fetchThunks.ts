import { createAsyncThunk } from "@reduxjs/toolkit";
import { pb } from "../lib/pocketbase";
import { CalendarType } from "../types";
import { toast } from "sonner";

export const fetchAllFromPB = createAsyncThunk(
  "general/fetchAllFromPB",
  async (_, { rejectWithValue }) => {
    try {
      if (!pb.authStore.isValid) return rejectWithValue("Not authenticated");

      const userId = pb.authStore.model?.id;

      // 1. Fetch Calendars
      const calendarRecords = await pb.collection('calendars').getFullList({
        filter: `user = "${userId}"`,
        sort: 'created',
      });

      const calendars: CalendarType[] = calendarRecords.map((record: any) => ({
        id: parseInt(record.localId),
        title: record.title,
        description: record.description,
        color: record.color,
        habitType: record.habitType,
        habitFormat: record.habitFormat,
        target: record.target,
        calendar: record.data,
      }));

      // 2. Fetch Settings (from user record)
      const userRecord = await pb.collection('users').getOne(userId!);
      const settings = userRecord.settings || {};

      return { calendars, settings };
    } catch (error: any) {
      toast.error("Cloud fetch failed: " + error.message);
      return rejectWithValue(error.message);
    }
  }
);
