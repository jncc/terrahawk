
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Poly, Choropoly } from './types'
import { frameworks } from '../frameworks'

let slice = createSlice({
  name: 'mapper',
  initialState: {
    query: {
      framework: 'liveng0',
      center:    frameworks.liveng0.defaultCenter,
      indexname: frameworks.liveng0.defaultIndexname,
    },
    polygons:   [] as Poly[],
    choropolys: [] as Choropoly[],
  },
  reducers: {
    mapCenterChanged: (state, a: PayloadAction<{ lat: number, lng: number }>) => {
      state.query.center = a.payload
    },
    fetchPolygonsCompleted: (state, a: PayloadAction<Poly[]>) => {
      // todo: cache
      state.polygons = a.payload
    },
    fetchPolygonsFailed: (state, a: PayloadAction<string>) => {},
    fetchChoroplethCompleted: (state, a: PayloadAction<Choropoly[]>) => {
      state.choropolys = a.payload
    },
    fetchChoroplethFailed: () => {},
  },
})

export let mapperReducer = slice.reducer
export let mapperActions = slice.actions

