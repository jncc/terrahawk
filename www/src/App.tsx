
import React from 'react'

import { fetchChoropleth } from './api/endpoints'
import { useGetPolygonsQuery } from './api/rtk'
import { Choropoly } from './api/types'
import { LeafletMap } from './map/LeafletMap'
import { MapScreenLayout } from './map/MapScreenLayout'

export function App() {

  let [choropolys, setChoropolys] = React.useState([] as Choropoly[])

  React.useEffect(() => {
    // fetchChoropleth().then(result => { setChoropolys(result.result) })
  }, [])

  let polys = useGetPolygonsQuery({ framework: 'liveng0', bbox: 'POLYGON((-2.34 54.037, -2.34 54.097, -2.22 54.097, -2.22 54.037, -2.34 54.037))' })
  console.log(polys.data)

  return (
    <>
    {polys.isLoading && <div>Loading</div>}
    <MapScreenLayout choropolys={choropolys} />
    </>
  )
}
