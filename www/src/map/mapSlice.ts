
import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ofType, StateObservable } from 'redux-observable'
import { Observable, of, } from 'rxjs'
import { mapTo, tap, delay, debounceTime, map, switchMap, startWith, endWith, catchError, } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'

import { RootState } from '../state/store'
import { Poly, PolygonsQuery, Choropoly } from '../api/types'
import { frameworks } from '../frameworks'
import { bboxToWkt, getBboxFromBounds, getPaddedBoundsAroundPoint } from '../utility/geospatialUtility'

let mapSlice = createSlice({
  name: 'map',
  initialState: {
    center: frameworks.liveng0.defaultCenter,
    zoom: frameworks.liveng0.defaultZoom,
    query: {
      framework: 'liveng0',
      center: frameworks.liveng0.defaultCenter,
      indexname: frameworks.liveng0.defaultIndexname,
    },
    loading: 0,
    errorMessage: '',
    polygons: [] as Poly[],
    choropolys: [] as Choropoly[],
    isPinging: false,
    isPongging: false,
  },
  reducers: {
    increaseZoom: (state) => {
      state.zoom += 1
    },
    setZoom: (state, a: PayloadAction<number>) => {
      state.zoom = a.payload
    },
    ping: () => {},
    pong: () => {},
    fetchPolygons: (state) => {
    },
    fetchPolygonsCompleted: (state, a: PayloadAction<Poly[]>) => {
      state.polygons = a.payload
    },
    fetchChoroplethCompleted: (state, a: PayloadAction<Choropoly[]>) => {
      state.choropolys = a.payload
    },
    fetchErrored: (state, a: PayloadAction<string>) => {
      state.errorMessage = a.payload
    },
    startLoading: (state) => {
      state.loading++
    },
    stopLoading: (state) => {
      state.loading--
    },
  },
})

export let mapReducer = mapSlice.reducer
export let { increaseZoom, setZoom, ping, pong, fetchPolygons, fetchPolygonsCompleted, fetchChoroplethCompleted, fetchErrored, startLoading, stopLoading, } = mapSlice.actions

type MapQuery = RootState['map']['query']
type SomeAction = ReturnType<typeof fetchPolygonsCompleted>

export let pingEpic = (action$: any) => action$.pipe(
  tap(console.log),
  ofType(ping.type),
  debounceTime(500),
  delay(1000),
  mapTo(pong()),
)

export let fetchPolygonsEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(fetchPolygons.type),
  switchMap(() => api('polygons', getPolygonsParams(state$.value.map.query)).pipe(
    map(r => fetchPolygonsCompleted(r.response.polygons)),
    catchError(e => of(fetchErrored(e.message))),
    startWith(startLoading()),
    endWith(stopLoading())
  )),
)

export let fetchChoroplethEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(fetchPolygonsCompleted.type),
  switchMap(() => api('choropleth', getChoroplethParams(state$.value.map)).pipe(
    map(r => fetchChoroplethCompleted(r.response)),
    catchError(e => of(fetchErrored(e.message))),
    startWith(startLoading()),
    endWith(stopLoading()),
  ))
)

export const api = (endpoint: string, params: any) => {
  return ajax.post(
    `https://xnqk0s6yzh.execute-api.eu-west-2.amazonaws.com/${endpoint}`,
    params,
    { 'Content-Type': 'application/json' }
  )
}

export let getPolygonsParams = (query: RootState['map']['query']): PolygonsQuery => {
  let bounds = getPaddedBoundsAroundPoint(query.center) // could vary the size of the bbox dynamically here
  return {
    framework: query.framework,
    bbox:      bboxToWkt(getBboxFromBounds(bounds))
  }
}

export let getChoroplethParams = (state: RootState['map']) => ({
  framework:      state.query.framework,
  indexname:      state.query.indexname,
  polyids:        state.polygons.map(p => p.polyid),
  polyPartitions: [...new Set(state.polygons.map(p => p.partition))], // distinct partitions
})
