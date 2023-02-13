
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Poly, ChoroplethItem, Framework, Indexname, PolygonsQueryResult, ChoroplethQueryResult, ChoroplethNone,
  FieldData, FieldDataQueryResult, Statistic, MonthStats, SimpleDate, Habitat, FrameworkHabitats } from './types'
import { frameworks } from '../../frameworks'
import { getFramesWithDate } from './helpers/frameHelpers'

let defaultFramework = frameworks['liveng1']
let defaultQuery = defaultFramework.defaultQuery

let slice = createSlice({
  name: 'mapper',
  initialState: {
    currentFramework: defaultFramework as Framework,
    showPolygons: true,
    showNpmsData: false,
    zoom: defaultFramework.defaultZoom,
    zoomedEnoughToShowPolygons: false,
    panToNewFramework: true,
    query: defaultQuery,
    polygons:   { polys: [] as Poly[], params: { framework: defaultFramework } },
    choropleth: { items: [] as (ChoroplethItem | ChoroplethNone)[], params: {framework: defaultQuery.tableName, indexname: defaultQuery.indexname } },
    fieldData: [] as FieldData[],
    selectedPolygon: undefined as Poly | undefined,
    previousSelectedPolygon: undefined as Poly | undefined,
    selectedPolygonStats: undefined as MonthStats[] | undefined,
    selectedFrame: undefined as string | undefined,
    hoveredFrame: undefined as string | undefined,
    showOutlines: true,
    useProxy: true,
    thumbType: 'index' as 'colour' | 'index',
    frameworkHabitats: new Map<Framework, Habitat[]>(),
  },
  reducers: {
    initialise: () => {

    },
    togglePolygons: (state) => {
      state.showPolygons = !state.showPolygons
    },
    toggleNpmsData: (state) => {
      state.showNpmsData = !state.showNpmsData
    },
    mapZoomIn: (state) => {
      if (state.zoom < state.currentFramework.maxZoom) {
        state.zoom++
      }
    },
    mapZoomOut: (state) => {
      if (state.zoom > state.currentFramework.minZoom) {
        state.zoom--
      }
    },
    mapZoomChanged: (state, a: PayloadAction<number>) => {
      state.zoom = a.payload
      state.zoomedEnoughToShowPolygons = state.zoom >= state.currentFramework.polygonZoomThreshold
      state.panToNewFramework = state.zoom === defaultFramework.defaultZoom
    },
    mapCenterChanged: (state, a: PayloadAction<{ lat: number, lng: number }>) => {
      state.query.center = a.payload
    },
    alterQueryFramework: (state, a: PayloadAction<string>) => {
      state.currentFramework = frameworks[a.payload]
      state.query.habitatids = []
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
    fetchFieldDataCompleted: (state, a: PayloadAction<FieldDataQueryResult>) => {
      state.fieldData = a.payload.fieldData
    },
    fetchHabitatsCompleted: (state, a: PayloadAction<FrameworkHabitats>) => {
      state.frameworkHabitats.set(a.payload.framework, a.payload.habitats)
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
      // select the first frame, by default
      // todo: it would be better to have a common function that gets the visible (queried for) frames
      if (stats) {
        let framesWithDate = getFramesWithDate(stats).filter(s => s.date.year >= state.query.yearFrom)
        state.selectedFrame = framesWithDate[0].frame
      }
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
    toggleThumbType: (state) => {
      state.thumbType = state.thumbType === 'colour' ? 'index' : 'colour' 
    },
    toggleSelectedHabitat: (state, a: PayloadAction<number>) => {
      const oldHabitatIds = [...state.query.habitatids]
      if (oldHabitatIds.includes(a.payload)) {
        state.query.habitatids = oldHabitatIds.filter(item => item !== a.payload)
      } else {
        state.query.habitatids.push(a.payload)
      }  
    },
    toggleSelectAllHabitats: (state, a: PayloadAction<boolean>) => {
      if (a.payload) {
        const allFrameworkHabitatIds = 
          state.frameworkHabitats.get(state.currentFramework)?.map((x: Habitat) => {return x.id})
        state.query.habitatids = allFrameworkHabitatIds ? allFrameworkHabitatIds : []  
      } else {
        state.query.habitatids = []
      }  
    },
  },
})

export let mapperReducer = slice.reducer
export let mapperActions = slice.actions
