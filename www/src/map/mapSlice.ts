
import { createSlice } from '@reduxjs/toolkit'

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
    }
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
export let { increaseZoom } = mapSlice.actions

