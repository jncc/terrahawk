
import React from 'react'

import { fetchChoropleth } from './api/endpoints'
import { Choropoly } from './api/types'
import { Counter } from './feats/counter/Counter'
import { LeafletMap } from './LeafletMap'

export function App() {

  let [choropolys, setChoropolys] = React.useState([] as Choropoly[])

  React.useEffect(() => {
    fetchChoropleth().then(result => { setChoropolys(result.result) })
  }, [])

  return (
    <>
    <Counter />
    {/* <LeafletMap choropolys={choropolys} /> */}
    </>
  )
}
