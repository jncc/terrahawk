
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Poly, ChoroplethItem, Indexname, PolygonQueryResult, ChoroplethQueryResult, ChoroplethNone, Statistic } from './types'
import { frameworks } from '../frameworks'

let defaultQuery = frameworks['liveng0'].defaultQuery

let slice = createSlice({
  name: 'mapper',
  initialState: {
    showPolygons: true,
    query: defaultQuery,
    polygons:   { polys: [] as Poly[], params: { framework: defaultQuery.framework } },
    choropleth: { items: [] as (ChoroplethItem | ChoroplethNone)[], params: {framework: defaultQuery.framework, indexname: defaultQuery.indexname } }
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
      state.choropleth = a.payload
    },
    fetchChoroplethFailed: () => {},
    alterQueryIndexname: (state, a: PayloadAction<Indexname>) => {
      state.query.indexname = a.payload
    },
    alterQueryStatistic: (state, a: PayloadAction<Statistic>) => {
      state.query.statistic = a.payload
    },
    alterQueryYearFrom: (state, a: PayloadAction<number>) => {
      state.query.yearFrom = a.payload
    },
    alterQueryMonthFrom: (state, a: PayloadAction<number>) => {
      state.query.monthFrom = a.payload
    },
    alterQueryYearTo: (state, a: PayloadAction<number>) => {
      state.query.yearTo = a.payload
    },
    alterQueryMonthTo: (state, a: PayloadAction<number>) => {
      state.query.monthTo = a.payload
    },
    incrementQueryPeriodByOneMonth: (state) => {
      state.query.monthFrom = state.query.monthFrom + 1
      state.query.monthTo = state.query.monthTo + 1
    },
    decrementQueryPeriodByOneMonth: (state) => {
      state.query.monthFrom = state.query.monthFrom - 1
      state.query.monthTo = state.query.monthTo - 1
    },
  },
})

export let mapperReducer = slice.reducer
export let mapperActions = slice.actions
