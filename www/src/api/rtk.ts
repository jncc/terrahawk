

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { PolygonsQuery } from './types'

export const terrahawkApi = createApi({
  reducerPath: 'terrahawkApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://xnqk0s6yzh.execute-api.eu-west-2.amazonaws.com/' }),
  endpoints: (builder) => ({
    getPolygons: builder.query<any, PolygonsQuery>({
      query: (q) =>({
        url: '/polygons',
        method: 'POST',
        body: q,
      }),
    }),
  }),
})

export const { useGetPolygonsQuery } = terrahawkApi

