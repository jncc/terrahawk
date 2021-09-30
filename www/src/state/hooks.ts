
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useStateDispatcher = () => useDispatch<AppDispatch>()
export const useStateSelector: TypedUseSelectorHook<RootState> = useSelector
