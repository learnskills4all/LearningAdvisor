import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "./userDataSlice";

/**
 * Store component that will be used to store the global state variables.
 */
export const store = configureStore({
  reducer: {
    userData: userDataReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
