import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import usersSlice from "../features/users/usersSlice";
// the name slice comes from splitting up redux state object into multiple slices of state, So a slice is a collection of reducers logic and actions for a single feature in the app.

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    users: usersSlice,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})