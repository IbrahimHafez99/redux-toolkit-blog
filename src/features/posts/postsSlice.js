import { createSlice, nanoid, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";
const POST_URL = "https://jsonplaceholder.typicode.com/posts"

const initialState = {
  posts: [],
  status: 'idle',
  error: null,
  postId: null,
  requestStatus: null,
  count: 0
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  try {
    const res = await axios.get(POST_URL)
    return res.data
  }
  catch (err) {
    return err.message
  }
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
  try {
    const res = await axios.post(POST_URL, initialPost)
    return res.data
  }
  catch (err) {
    return err.message
  }
})

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
  const { id } = initialPost
  try {
    console.log(id)
    const res = await axios.put(`${POST_URL}/${id}`, initialPost)
    return res.data
  }
  catch (err) {
    // return err.message
    return initialPost //just in this case because of using fake api
  }
})

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
  const { id } = initialPost
  try {
    const res = await axios.delete(`${POST_URL}/${id}`)
    //Deleting the post because the fake json delete api doesn't send back the deleted post id
    if (res?.status === 200) return initialPost
    return `${res?.status}: ${res?.statusText}`
  }
  catch (err) {
    return err.message
  }
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload)
      },
      //it has to be prepare because its a callback function that prepare the payload that is within the action before mutating the state
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            }
          }
        }
      }
    },
    resetRequestStatus: (state) => {
      state.requestStatus = null
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    increaseCount(state, action) {
      state.count = state.count + 1
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        let min = 1;
        const loadedPosts = action.payload.map(post => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString()
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          }
          return post
        })
        state.posts = [...state.posts, ...loadedPosts]
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.id = nanoid()
        action.payload.userId = Number(action.payload.userId)
        action.payload.date = new Date().toISOString()
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        }
        state.postId = action.payload.id
        state.requestStatus = 200
        state.posts.push(action.payload)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Update could not complete');
          console.log(action.payload);
          return;
        }
        const { id } = action.payload
        action.payload.date = new Date().toISOString()
        const posts = state.posts.filter(post => post.id !== id)
        state.posts = [...posts, action.payload]
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Delete could not complete');
          console.log(action.payload)
          return;
        }
        const { id } = action.payload;
        state.posts = state.posts.filter(post => post.id !== id)
      })
  },
})

export const getPostsStatus = state => state.posts.status
export const getPostsError = state => state.posts.error
export const getCount = state => state.posts.count
export const selectAllPosts = state => state.posts.posts
export const selectPostById = (state, postId) => state.posts.posts.find(post => (post.id === postId || post.id === Number(postId)))

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.user === userId)
)


export const { postAdded, reactionAdded, resetRequestStatus, increaseCount } = postsSlice.actions
export default postsSlice.reducer