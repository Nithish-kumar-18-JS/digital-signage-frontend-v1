import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllMedia, addMedia, updateMedia, deleteMedia, searchMedia } from "@/api/media/media";
import { Media } from "@/types/index";
// Async thunks for CRUD
export const fetchMediaSlice = createAsyncThunk("media/fetchMedia", async () => {
  const res = await getAllMedia();
  return res;
});

export const addMediaSlice = createAsyncThunk("media/addMedia", async (post:Media) => {
  const res = await addMedia(post);
  return res;
});

export const updateMediaSlice = createAsyncThunk("media/updateMedia", async (post: Media) => {
  if (!post.id) {
    throw new Error("Cannot update media without an ID");
  }
  return await updateMedia(post.id, post);
});

export const deleteMediaSlice = createAsyncThunk("media/deleteMedia", async (id:number) => {
  const res = await deleteMedia(id);
  return res;
});

export const searchMediaSlice = createAsyncThunk("media/searchMedia", async (query:string) => {
  const res = await searchMedia(query);
  return res;
});


const mediaSlice = createSlice({
  name: "media",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMediaSlice.pending, (state: any) => {
        state.status = "loading";
      })
      .addCase(fetchMediaSlice.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMediaSlice.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addMediaSlice.fulfilled, (state: any, action: any) => {
        state.items.push(action.payload);
      })
      .addCase(updateMediaSlice.fulfilled, (state: any, action: any) => {
        const index = state.items.findIndex((p:Media) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteMediaSlice.fulfilled, (state: any, action: any) => {
        state.items = state.items.filter((p:Media) => p.id !== action.payload);
      })
      .addCase(searchMediaSlice.fulfilled, (state: any, action: any) => {
        state.items = action.payload;
      });
  },
});

export default mediaSlice.reducer;
