
import React from 'react'
import { decrement, increment } from './counterSlice'
import { useStateSelector, useStateDispatcher } from '../../state/hooks'

export function Counter() {

  let count = useStateSelector(s => s.counter.value)
  let dispatch = useStateDispatcher()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}
