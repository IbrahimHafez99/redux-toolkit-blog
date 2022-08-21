import { configureStore } from "@reduxjs/toolkit";
import postsSlice from "../features/posts/postsSlice";
import usersSlice from "../features/users/usersSlice";
// the name slice comes from splitting up redux state object into multiple slices of state, So a slice is a collection of reducers logic and actions for a single feature in the app.

export const store = configureStore({
  reducer: {
    posts: postsSlice,
    users: usersSlice,
  }
})