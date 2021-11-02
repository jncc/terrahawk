
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Poly, ChoroplethItem, Indexname, PolygonQueryResult, ChoroplethQueryResult, NoDataChoroplethItem, Statistic } from './types'
import { frameworks } from '../frameworks'

let defaultQuery = {
  framework: 'liveng0',
  center:    frameworks.liveng0.defaultCenter,
  indexname: frameworks.liveng0.defaultIndexname,
  statistic: frameworks.liveng0.defaultStatistic,
}

let slice = createSlice({
  name: 'mapper',
  initialState: {
    showPolygons: true,
    query: defaultQuery,
    polygons:   { polys: [] as Poly[], params: { framework: defaultQuery.framework } },
    choropleth: { items: [] as (ChoroplethItem | NoDataChoroplethItem)[], params: {framework: defaultQuery.framework, indexname: defaultQuery.indexname } }
  },
  reducers: {
    togglePolygons: (state) => {
      state.showPolygons = !state.showPolygons
    },
    mapCenterChanged: (state, a: PayloadAction<{ lat: number, lng: number }>) => {
      state.query.center = a.payload
    },
    fetchPolygonsCompleted: (state, a: PayloadAction<PolygonQueryResult>) => {
      state.polygons = a.payload
    },
    fetchPolygonsFailed: (state, a: PayloadAction<string>) => {},
    fetchChoroplethCompleted: (state, a: PayloadAction<ChoroplethQueryResult>) => {
      // console.log(a.payload)
      state.choropleth = a.payload
    },
    fetchChoroplethFailed: () => {},
    alterQueryIndexname: (state, a: PayloadAction<Indexname>) => {
      state.query.indexname = a.payload
    },
    alterQueryStatistic: (state, a: PayloadAction<Statistic>) => {
      state.query.statistic = a.payload
    },
  },
})

export let mapperReducer = slice.reducer
export let mapperActions = slice.actions
