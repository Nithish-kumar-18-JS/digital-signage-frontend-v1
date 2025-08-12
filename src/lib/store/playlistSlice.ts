import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllPlaylist, addPlaylist, updatePlaylist, deletePlaylist, searchPlaylist } from "@/api/playlist/playlist";
import { Playlist } from "@/types/index";
// Async thunks for CRUD
export const fetchPlaylistSlice = createAsyncThunk("playlist/fetchPlaylist", async () => {
  const res = await getAllPlaylist();
  return res;
});

export const addPlaylistSlice = createAsyncThunk("playlist/addPlaylist", async (post:Playlist) => {
  const res = await addPlaylist(post);
  return res;
});

export const updatePlaylistSlice = createAsyncThunk("playlist/updatePlaylist", async (post: Playlist) => {
  if (!post.id) {
    throw new Error("Cannot update playlist without an ID");
  }
  return await updatePlaylist(post.id, post);
});

export const deletePlaylistSlice = createAsyncThunk("playlist/deletePlaylist", async (id:number) => {
  const res = await deletePlaylist(id);
  return res;
});

export const searchPlaylistSlice = createAsyncThunk("playlist/searchPlaylist", async (query:string) => {
  const res = await searchPlaylist(query);
  return res;
});


const playlistSlice = createSlice({
  name: "playlist",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylistSlice.pending, (state: any) => {
        state.status = "loading";
      })
      .addCase(fetchPlaylistSlice.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPlaylistSlice.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addPlaylistSlice.fulfilled, (state: any, action: any) => {
        state.items.push(action.payload);
      })
      .addCase(updatePlaylistSlice.fulfilled, (state: any, action: any) => {
        const index = state.items.findIndex((p:Playlist) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deletePlaylistSlice.fulfilled, (state: any, action: any) => {
        state.items = state.items.filter((p:Playlist) => p.id !== action.payload);
      })
      .addCase(searchPlaylistSlice.fulfilled, (state: any, action: any) => {
        state.items = action.payload;
      });
  },
});

export default playlistSlice.reducer;
