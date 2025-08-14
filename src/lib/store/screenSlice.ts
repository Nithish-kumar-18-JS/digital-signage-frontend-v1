import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllScreen, addScreen, updateScreen, deleteScreen, searchScreen } from "@/api/screens/screens";
import { Screen } from "@/types/index";
// Async thunks for CRUD
export const fetchScreenSlice = createAsyncThunk("screen/fetchScreen", async () => {
  const res = await getAllScreen();
  return res;
});

export const addScreenSlice = createAsyncThunk("screen/addScreen", async (data:Screen) => {
  const res = await addScreen(data);
  return res;
});

export const updateScreenSlice = createAsyncThunk("screen/updateScreen", async (data: Screen) => {
  if (!data.id) {
    throw new Error("Cannot update screen without an ID");
  }
  return await updateScreen(data.id, data);
});

export const deleteScreenSlice = createAsyncThunk("screen/deleteScreen", async (id:number) => {
  const res = await deleteScreen(id);
  return res;
});

export const searchScreenSlice = createAsyncThunk("screen/searchScreen", async (query:string) => {
  const res = await searchScreen(query);
  return res;
});


const screenSlice = createSlice({
  name: "screen",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScreenSlice.pending, (state: any) => {
        state.status = "loading";
      })
      .addCase(fetchScreenSlice.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchScreenSlice.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addScreenSlice.fulfilled, (state: any, action: any) => {
        state.items.push(action.payload);
      })
      .addCase(updateScreenSlice.fulfilled, (state: any, action: any) => {
        const index = state.items.findIndex((p:Screen) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteScreenSlice.fulfilled, (state: any, action: any) => {
        state.items = state.items.filter((p:Screen) => p.id !== action.payload);
      })
      .addCase(searchScreenSlice.fulfilled, (state: any, action: any) => {
        state.items = action.payload;
      });
  },
});

export default screenSlice.reducer;
