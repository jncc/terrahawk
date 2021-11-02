
import { useEffect, useRef } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Redux hooks, typed for this app
export const useStateDispatcher = () => useDispatch<AppDispatch>()
export const useStateSelector: TypedUseSelectorHook<RootState> = useSelector

// custom hooks

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
export function usePrevious<T>(value: T) {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
