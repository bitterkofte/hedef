import { createAsyncThunk } from "@reduxjs/toolkit";
import { pb } from "../lib/pocketbase";
import { CalendarType } from "../types";
import { toast } from "sonner";

// Thunk to sync all calendars to PocketBase
export const pushCalendarsToPB = createAsyncThunk(
  "general/pushCalendarsToPB",
  async (calendars: CalendarType[], { rejectWithValue }) => {
    try {
      if (!pb.authStore.isValid) return rejectWithValue("Not authenticated");

      const userId = pb.authStore.model?.id;

      for (const calendar of calendars) {
        // Attempt to find if this calendar exists in PB (by custom id or just update all)
        // For simplicity in this demo, we'll assume we have a collection 'calendars'
        // and we match by a 'localId' field we add to the schema.
        
        const data = {
          user: userId,
          title: calendar.title,
          description: calendar.description,
          color: calendar.color,
          habitType: calendar.habitType,
          habitFormat: calendar.habitFormat,
          target: calendar.target,
          data: calendar.calendar, // The array of days
          localId: calendar.id.toString(), // Store the local timestamp ID
        };

        // Try to find existing record
        const existing = await pb.collection('calendars').getList(1, 1, {
          filter: `localId = "${calendar.id}" && user = "${userId}"`,
        });

        if (existing.items.length > 0) {
          await pb.collection('calendars').update(existing.items[0].id, data);
        } else {
          await pb.collection('calendars').create(data);
        }
      }
      toast.success("Calendars synced to cloud!");
      return calendars;
    } catch (error: any) {
      toast.error("Failed to sync calendars: " + error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to sync settings to PocketBase
export const pushSettingsToPB = createAsyncThunk(
  "general/pushSettingsToPB",
  async (settings: any, { rejectWithValue }) => {
    try {
      if (!pb.authStore.isValid) return rejectWithValue("Not authenticated");
      
      const userId = pb.authStore.model?.id;
      // We can store settings in the user record itself if we add a 'settings' JSON field
      await pb.collection('users').update(userId!, {
        settings: settings
      });
      
      return settings;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
