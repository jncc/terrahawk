
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

let slice = createSlice({
  name: 'global',
  initialState: {
    loading: 0,
    errorMessage: '',
    isPinging: false,
    isPonging: false,
  },
  reducers: {
    startLoading: (state) => {
      state.loading++
    },
    stopLoading: (state) => {
      state.loading--
    },
    showError: (state, a: PayloadAction<string>) => {
      state.errorMessage = a.payload
    },
    hideError: (state) => {
      state.errorMessage = ''
    },
    ping: () => {},
    pong: () => {},
  },
})

export let globalReducer = slice.reducer
export let globalActions = slice.actions

