
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Poly, Choropoly } from './types'
import { frameworks } from '../frameworks'

let slice = createSlice({
  name: 'mapper',
  initialState: {
    center:     frameworks.liveng0.defaultCenter,
    zoom:       frameworks.liveng0.defaultZoom,
    query: {
      framework: 'liveng0',
      center:    frameworks.liveng0.defaultCenter,
      indexname: frameworks.liveng0.defaultIndexname,
    },
    polygons:   [] as Poly[],
    choropolys: [] as Choropoly[],
  },
  reducers: {
    increaseZoom: (state) => {
      state.zoom += 1
    },
    mapZoomChanged: (state, a: PayloadAction<number>) => {
      state.zoom = a.payload
    },
    mapCenterChanged: () => {
      // state.query.center = payload
    },
    fetchPolygonsCompleted: (state, a: PayloadAction<Poly[]>) => {
      state.polygons = a.payload
    },
    fetchChoroplethCompleted: (state, a: PayloadAction<Choropoly[]>) => {
      state.choropolys = a.payload
    },
    devAction: () => {}
  },
})

export let mapperReducer = slice.reducer
export let mapperActions = slice.actions

