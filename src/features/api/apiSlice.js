import { build } from '@reduxjs/toolkit/dist/query/core/buildMiddleware/cacheLifecycle'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
  //assigning a tag to the cache named 'Post' and then let it know which "mutation" (endpoint query.mutation) invalidate the cacheand then it will automatically refetch the data for us.
  tagTypes: ['Post'],
  endpoints: builder => ({})
})