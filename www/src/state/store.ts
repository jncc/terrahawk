

import { configureStore } from '@reduxjs/toolkit'
import { combineEpics } from 'redux-observable'
import { createEpicMiddleware } from 'redux-observable';

import { terrahawkApi } from '../api/rtk'
import { mapReducer, ping, pingEpic } from '../map/mapSlice'

let epics = combineEpics(
  pingEpic,
  // fetchUserEpic
)

let epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    map: mapReducer,
    [terrahawkApi.reducerPath]: terrahawkApi.reducer,
    ping
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(terrahawkApi.middleware).concat(epicMiddleware),
})

epicMiddleware.run(epics)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
