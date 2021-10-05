
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Redux hooks typed for this app
export const useStateDispatcher = () => useDispatch<AppDispatch>()
export const useStateSelector: TypedUseSelectorHook<RootState> = useSelector
