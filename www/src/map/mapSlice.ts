
import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { mapTo, tap, delay, debounceTime, map, mergeMap, switchMap, switchMapTo } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'
import { ofType } from 'redux-observable'

import { frameworks } from '../frameworks'
import { Poly } from '../api/types'

let mapSlice = createSlice({
  name: 'map',
  initialState: {
    center: frameworks.liveng0.defaultCenter,
    zoom: frameworks.liveng0.defaultZoom,
    isPinging: false,
    isPongging: false,
    stale: true,
    polygons: [] as Poly[],
  },
  reducers: {
    increaseZoom: (state) => {
      state.zoom += 1
    },
    setZoom: (state, a: PayloadAction<number>) => {
      state.zoom = a.payload
    },
    ping: (state) => {},
    pong: (state) => {},
    fetchPolygons: () => {},
    fetchPolygonsCompleted: (state, result: any) => {
      // console.log(result)
      // state.polygons = result.polygons
    },
  },
})


export let mapReducer = mapSlice.reducer
export let { increaseZoom, setZoom, ping, pong, fetchPolygons, fetchPolygonsCompleted, } = mapSlice.actions

export let pingEpic = (action$: any) => action$.pipe(
  tap(console.log),
  ofType(ping.type),
  debounceTime(500),
  delay(1000),
  mapTo(pong()),
)

export let fetchPolygonsEpic = (action$: any) => action$.pipe(
  ofType(fetchPolygons.type),
  mergeMap(action =>
    ajax.post(
      `https://xnqk0s6yzh.execute-api.eu-west-2.amazonaws.com/polygons`,
      {
        "framework": "liveng0",
        "bbox": "POLYGON((-2.34 54.037, -2.34 54.097, -2.22 54.097, -2.22 54.037, -2.34 54.037))"
      }
      ,
      {
        'Content-Type': 'application/json'
      }
    ).pipe(
      // tap(console.log),
      map(response => fetchPolygonsCompleted(response.response))
    )
  )
)
