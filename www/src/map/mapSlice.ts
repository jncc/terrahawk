
import { Action, createSlice } from '@reduxjs/toolkit'
import { filter, mapTo, tap, delay } from 'rxjs/operators'

import { frameworks } from '../frameworks'

let mapSlice = createSlice({
  name: 'map',
  initialState: {
    center: frameworks.liveng0.defaultCenter,
    zoom: frameworks.liveng0.defaultZoom
  },
  reducers: {
    increaseZoom: (state) => {
      state.zoom += 1
    },
    ping: () => { },
    pong: () => { },
    // increment: (state) => {
    //   state.value += 1
    // },
    // decrement: (state) => {
    //   state.value -= 1
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // },
  },
})


export let mapReducer = mapSlice.reducer
export let { increaseZoom, ping, pong } = mapSlice.actions

export let pingEpic = (action$: any) => action$.pipe(
  tap((a: Action) => console.log(a)),
  filter((a: Action) => a.type === ping.type),
  delay(1000),
  mapTo(pong()),
)
