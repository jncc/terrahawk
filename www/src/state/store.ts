

import { configureStore } from '@reduxjs/toolkit'
import { combineEpics } from 'redux-observable'
import { createEpicMiddleware } from 'redux-observable';

import { terrahawkApi } from '../api/rtk'
import { fetchPolygonsEpic, mapReducer, pingEpic } from '../map/mapSlice'

let epics = combineEpics(
  pingEpic,
  fetchPolygonsEpic,
)

let epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    map: mapReducer,
    [terrahawkApi.reducerPath]: terrahawkApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(terrahawkApi.middleware).concat(epicMiddleware),
})

epicMiddleware.run(epics)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
