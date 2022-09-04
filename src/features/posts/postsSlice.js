import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";
const postsAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than 'post.id'
  // we would do this: selectId: (post) => post.postId,
  selectId: (post) => post.id,
  // Keep the "all IDs" array sorted based on post date
  sortComparer: (a, b) => b.date.localeCompare(a.date) // a sort function() which is equal to sort((a, b) => b.date.localeCompare(a.date))
})

const initialState = postsAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPosts: builder.query({
      query: () => '/posts',
      transformResponse: responseData => {
        let min = 1
        const loadedPosts = responseData.map(post => {
          if (!post?.date) post.date = sub(new Date(), { minutes: min })
          if (!post.reactions) post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          }
          return post
        })
        return postsAdapter.setAll(initialState, loadedPosts)
      },
      //its providing this tag of Post and we need to invalidate the post cache when we use the builder mutations
      providesTags: (result, error, arg) => [
        { type: 'Post', id: 'LIST' },
        ...result.ids.map(id => ({ type: 'Post', id }))
      ]
    }),
  }),
})

export const {
  useGetPostsQuery
} = extendedApiSlice

//this selector returns the query result object, it doesn't issue the query but it returns the result object that we already have after the query was triggered
const selectPostsResult = extendedApiSlice.endpoints.getPosts.select()

//createEntityAdapter provdies a getSelectors function which creates memoized selectors that corresponde to the normalized state
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts)
