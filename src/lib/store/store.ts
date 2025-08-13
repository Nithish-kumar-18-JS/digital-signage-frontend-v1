import { configureStore } from "@reduxjs/toolkit";
import mediaReducer from "./mediaSlice";
import playlistReducer from "./playlistSlice";
import scheduleReducer from "./scheduleSlice";

export const store = configureStore({
  reducer: {
    media: mediaReducer,
    playlist: playlistReducer,
    schedule: scheduleReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
