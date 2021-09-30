
import React from 'react'

import { fetchChoropleth } from './api/endpoints'
import { Choropoly } from './api/types'
import { LeafletMap } from './LeafletMap'

// let getChloroPolys = async () => {
//   let polygons = await fetchPolygons()
//   let maxZScoresCollection = await fetchMaxZScoresMonthly({
//     polyids: polygons.polygons.map(p => p.polyid)
//     partitions: [...new Set(polygons.polygons.map(p => p.partition))] // use Set for `distinct`
//   })
// }

export function App() {


  let [choropolys, setChoropolys] = React.useState([] as Choropoly[])

  React.useEffect(() => {
    fetchChoropleth().then(result => { setChoropolys(result.result) })
  }, [])

  // let [maxZScoresCollection, setMaxZScoresCollection] = React.useState([] as MaxZScores[])

  // React.useEffect(() => {
  //   fetchMaxZScoresMonthly().then(result => { setMaxZScoresCollection(result.data) })
  // }, [])

  // if (polygons.length > 0) {
  //   console.log(polygons[0].polyid)
  // }

  console.log(choropolys)
  return (
    <LeafletMap choropolys={choropolys} />
  )
}
