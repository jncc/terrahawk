
import { configureStore } from '@reduxjs/toolkit'
import { mapReducer } from '../map/mapSlice'

import { terrahawkApi } from '../api/rtk'


export const store = configureStore({
  reducer: {
    map: mapReducer,
    [terrahawkApi.reducerPath]: terrahawkApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(terrahawkApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
