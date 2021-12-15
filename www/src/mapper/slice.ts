
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Poly, ChoroplethItem, Indexname, PolygonsQueryResult, ChoroplethQueryResult, ChoroplethNone, Statistic, MonthStats, SimpleDate } from './types'
import { frameworks } from '../frameworks'
import { last } from '../utility/arrayUtility'
import { getFramesWithDate } from './helpers/frameHelpers'

let defaultFramework = frameworks['liveng0']
let defaultQuery = defaultFramework.defaultQuery

let slice = createSlice({
  name: 'mapper',
  initialState: {
    showPolygons: true,
    zoom: defaultFramework.defaultZoom,
    zoomedEnoughToShowPolygons: false,
    query: defaultQuery,
    polygons:   { polys: [] as Poly[], params: { framework: defaultQuery.framework } },
    choropleth: { items: [] as (ChoroplethItem | ChoroplethNone)[], params: {framework: defaultQuery.framework, indexname: defaultQuery.indexname } },
    selectedPolygon: undefined as Poly | undefined,
    previousSelectedPolygon: undefined as Poly | undefined,
    selectedPolygonStats: undefined as MonthStats[] | undefined,
    selectedFrame: undefined as string | undefined,
    hoveredFrame: undefined as string | undefined,
    showOutlines: true,
    useProxy: false
  },
  reducers: {
    togglePolygons: (state) => {
      state.showPolygons = !state.showPolygons
    },
    mapZoomChanged: (state, a: PayloadAction<number>) => {
      state.zoom = a.payload
      state.zoomedEnoughToShowPolygons = state.zoom >= frameworks[state.query.framework].polygonZoomThreshold
    },
    mapCenterChanged: (state, a: PayloadAction<{ lat: number, lng: number }>) => {
      state.query.center = a.payload
    },
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
    fetchPolygonsCompleted: (state, a: PayloadAction<PolygonsQueryResult>) => {
      state.polygons = a.payload
    },
    fetchChoroplethCompleted: (state, a: PayloadAction<ChoroplethQueryResult>) => {
      state.choropleth = a.payload
    },
    selectPolygon: (state, a: PayloadAction<Poly | undefined>) => {
      // the new value is `undefined` if deselecting
      // let poly = state.selectedPolygon === state.previousSelectedPolygon ? undefined : a.payload
      // store the old value
      state.previousSelectedPolygon = state.selectedPolygon
      // store the new value
      state.selectedPolygon = a.payload
      // reset the dependent values
      state.selectedPolygonStats = undefined
      state.selectedFrame = undefined
    },
    fetchPolygonCompleted: (state, a: PayloadAction<MonthStats[] | undefined>) => {
      let stats = a.payload
      state.selectedPolygonStats = stats
    },
    selectFrame: (state, a: PayloadAction<string | undefined>) => {
      state.selectedFrame = a.payload
    },
    hoverFrame: (state, a: PayloadAction<string | undefined>) => {
      state.hoveredFrame = a.payload
    },
    toggleOutlines: (state) => {
      state.showOutlines = !state.showOutlines
    },
    toggleProxy: (state) => {
      state.useProxy = !state.useProxy
    },
  },
})

export let mapperReducer = slice.reducer
export let mapperActions = slice.actions
