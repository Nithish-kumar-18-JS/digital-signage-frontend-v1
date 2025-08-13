import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllSchedule, addSchedule, updateSchedule, deleteSchedule, searchSchedule } from "@/api/schedule/schedule";
import { Schedule } from "@/types/index";
// Async thunks for CRUD
export const fetchScheduleSlice = createAsyncThunk("schedule/fetchSchedule", async () => {
  const res = await getAllSchedule();
  return res;
});

export const addScheduleSlice = createAsyncThunk("schedule/addSchedule", async (data:Schedule) => {
  const res = await addSchedule(data);
  return res;
});

export const updateScheduleSlice = createAsyncThunk("schedule/updateSchedule", async (data: Schedule) => {
  if (!data.id) {
    throw new Error("Cannot update schedule without an ID");
  }
  return await updateSchedule(data.id, data);
});

export const deleteScheduleSlice = createAsyncThunk("schedule/deleteSchedule", async (id:number) => {
  const res = await deleteSchedule(id);
  return res;
});

export const searchScheduleSlice = createAsyncThunk("schedule/searchSchedule", async (query:string) => {
  const res = await searchSchedule(query);
  return res;
});


const scheduleSlice = createSlice({
  name: "schedule",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScheduleSlice.pending, (state: any) => {
        state.status = "loading";
      })
      .addCase(fetchScheduleSlice.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchScheduleSlice.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addScheduleSlice.fulfilled, (state: any, action: any) => {
        state.items.push(action.payload);
      })
      .addCase(updateScheduleSlice.fulfilled, (state: any, action: any) => {
        const index = state.items.findIndex((p:Schedule) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteScheduleSlice.fulfilled, (state: any, action: any) => {
        state.items = state.items.filter((p:Schedule) => p.id !== action.payload);
      })
      .addCase(searchScheduleSlice.fulfilled, (state: any, action: any) => {
        state.items = action.payload;
      });
  },
});

export default scheduleSlice.reducer;
