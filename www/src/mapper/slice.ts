
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Poly, ChoroplethItem } from './types'
import { frameworks } from '../frameworks'

let slice = createSlice({
  name: 'mapper',
  initialState: {
    query: {
      framework: 'liveng0',
      center:    frameworks.liveng0.defaultCenter,
      indexname: frameworks.liveng0.defaultIndexname,
      statistic: frameworks.liveng0.defaultStatistic,
    },
    showPolygons: true,
    polygons:   [] as Poly[],
    choropleth: [] as ChoroplethItem[],
  },
  reducers: {
    mapCenterChanged: (state, a: PayloadAction<{ lat: number, lng: number }>) => {
      state.query.center = a.payload
    },
    togglePolygons: (state) => {
      state.showPolygons = !state.showPolygons
    },
    fetchPolygonsCompleted: (state, a: PayloadAction<Poly[]>) => {
      state.polygons = a.payload
    },
    fetchPolygonsFailed: (state, a: PayloadAction<string>) => {},
    fetchChoroplethCompleted: (state, a: PayloadAction<ChoroplethItem[]>) => {
      state.choropleth = a.payload
    },
    fetchChoroplethFailed: () => {},
  },
})

export let mapperReducer = slice.reducer
export let mapperActions = slice.actions
