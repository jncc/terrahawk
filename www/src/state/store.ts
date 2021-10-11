
import { configureStore } from '@reduxjs/toolkit'
import { combineEpics } from 'redux-observable'
import { createEpicMiddleware } from 'redux-observable';

import { fetchChoroplethEpic, fetchPolygonsEpic, mapReducer, pingEpic } from '../map/mapSlice'

let epics = combineEpics(
  pingEpic,
  fetchPolygonsEpic,
  fetchChoroplethEpic,
)

let epicMiddleware: any = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    map: mapReducer,
  },
  // decided against using Redux Toolkit's getDefaultMiddleware due to size of data in state
  middleware: () =>
    [epicMiddleware],
})

epicMiddleware.run(epics)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
