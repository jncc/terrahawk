
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import _ from 'lodash'

let slice = createSlice({
  name: 'global',
  initialState: {
    loading: [] as string[],
    errorMessage: '',
    isPinging: false,
    isPonging: false,
  },
  reducers: {
    startLoading: (state, a: PayloadAction<string>) => {
      state.loading = _.concat(state.loading, a.payload)
    },
    stopLoading: (state, a: PayloadAction<string>) => {
      state.loading = _.without(state.loading, a.payload)
    },
    errorOccurred: (state, a: PayloadAction<string>) => {},
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

