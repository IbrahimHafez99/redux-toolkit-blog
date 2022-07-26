import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const POST_URL = "https://jsonplaceholder.typicode.com/users"
const initialState = []

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  try {
    const res = await axios.get(POST_URL)
    return res.data
  }
  catch (err) {
    return err.message
  }
})

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      //Replace the user state completely (which is an empty array) and I've could used state.push = [...action.payload] but by returning the payload without the push at all that means we're compeletely overriding the state.
      return action.payload
    })
  }
})

export const selectAllUsers = state => state.users

export default userSlice.reducer