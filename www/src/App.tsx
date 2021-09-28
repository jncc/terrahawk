
import React, { useState } from 'react'
import { LeafletMap } from './LeafletMap'

export function App() {
  const [count, setCount] = useState(0)
  return (

    <>
    <h1 className="text-4xl text-jncc">Welcome to here</h1>
    <div className="p-6">
      <img src="http://placekitten.com/200/200" height="200" width="200" alt="Kitteh" />
    </div>

    <button type="button" onClick={() => setCount((count) => count + 1)}>
      Counter {count}
    </button>
    </>
    // <LeafletMap />
  )
}


