
import { configureStore } from '@reduxjs/toolkit'
import { combineEpics } from 'redux-observable'
import { createEpicMiddleware } from 'redux-observable'

import { globalReducer } from '../slices/global/slice'
import { globalEpics } from '../slices/global/epics'
import { mapperReducer } from '../slices/mapper/slice'
import { mapperEpics } from '../slices/mapper/epics'

let epics = combineEpics(
  globalEpics,
  mapperEpics,
)

let epicMiddleware: any = createEpicMiddleware()

export const store = configureStore({
  reducer: {
    global: globalReducer,
    mapper: mapperReducer,
  },
  // don't use Redux Toolkit's getDefaultMiddleware due to size of data in state
  middleware: () => [epicMiddleware]
})

epicMiddleware.run(epics)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
