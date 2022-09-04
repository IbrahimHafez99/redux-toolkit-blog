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
          if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString()
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
      //this { type: 'Post', id: 'LIST' } is a unique Tag and this  id: 'LIST' is a unique Identifier that allow us to invalidate the all post cached state in other mutation, ...result.ids.map(id => ({ type: 'Post', id }) this allow us to invalidate cached state and refetch all posts if any of the posts changes
      providesTags: (result, error, arg) => [
        { type: 'Post', id: 'LIST' },
        ...result.ids.map(id => ({ type: 'Post', id }))
      ]
    }),
    getPostsByUserId: builder.query({
      query: id => `/posts/?userId=${id}`,
      transformResponse: responseData => {
        let min = 1
        const loadedPost = responseData.map(post => {
          if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString()
          if (!post.reactions) post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          }
          return post
        })
        //this doesn't override the cache of the full post list because redux is subscribing to those different queries because now this will have a cache state for this specific query as well and with post adapter we are normalizing the state.
        return postsAdapter.setAll(initialState, loadedPost)
      },
      providesTags: (result, error, arg) => [
        ...result.ids.map(id => ({ type: 'Post', id }))
      ]
    }),
    addNewPost: builder.mutation({
      query: initialPost => ({
        url: '/posts',
        method: 'POST',
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          }
        }
      }),
      invalidatesTags: [
        { type: 'Post', id: 'LIST' }
      ]
    }),
    updatePost: builder.mutation({
      query: initialPost => ({
        url: `/posts/${initialPost.id}`,
        method: 'PUT',
        body: {
          ...initialPost,
          date: new Date().toISOString()
        }
      }),
      //result === the response coming from the current http request
      //arg === initialPost

      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.id }
      ]
    }),
    deletePost: builder.mutation({
      //this is the arg { id }
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
        body: { id }
      }),
      //can i invalidate the list tag !?!?!?! need to test it when I'm finished
      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.id }
      ]
    }),
    //we don't want to reload our list everytime we add a reaction so we're going this in an optimistic update approach
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: 'PATCH',
        body: { reactions }
      }),
      //queryFulfilled is a promise
      onQueryStarted: async ({ postId, reactions }, { dispatch, queryFulfilled }) => {
        //'updateQueryData' requires the endpoint name and cache key arguments so it knows which piece of cache state to update.
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {
            //the draft is an immer-wrapper and can be mutated like reducers mutating the state in createSlice
            //draft is like the state (the cached state)
            const post = draft.entities[postId]
            if (post) post.reactions = reactions

          })
        )
        try {
          await queryFulfilled
        }
        catch {
          patchResult.undo()
        }
      }
    })
  }),
})

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = extendedApiSlice

//this selector returns the query result object, it doesn't issue the query but it returns the result object that we already have after the query was triggered
const selectPostsResult = extendedApiSlice.endpoints.getPosts.select()

//create a memoized selector
const selectPostsData = createSelector(selectPostsResult, postsResult => postsResult.data)
//createEntityAdapter provdies a getSelectors function which creates memoized selectors that corresponde to the normalized state
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState)
