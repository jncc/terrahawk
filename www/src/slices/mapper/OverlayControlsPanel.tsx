
import React from 'react'

import { useStateDispatcher, useStateSelector } from '../../state/hooks'
import { mapperActions } from './slice'
import { Toggle } from '../../components/Toggle'

export let OverlayControlsPanel = () => {

  let dispatch = useStateDispatcher()
  let state = useStateSelector(s => s.mapper)

  return (
    <>
    {/* <div className="z-abovemap inline-block relative animate-delayedfadein">
    <div className="bg-white rounded-xl overflow-hidden shadow-md px-2 py-1">
      <Toggle
        label="NPMS data"
        position="right"
        checked={state.showNpmsData}
        onChange={() => dispatch(mapperActions.toggleNpmsData())}
        title="Show NPMS data on the map"
        />
    </div>
    </div>
    <br /> */}
    <div className="z-abovemap inline-block relative animate-delayedfadein">
    <div className="bg-white rounded-xl overflow-hidden shadow-md px-2 py-1">
      <Toggle
        label="Polygons"
        position="right"
        checked={state.showPolygons}
        onChange={() => dispatch(mapperActions.togglePolygons())}
        title="Show polygons on the map"
        />
    </div>
    </div>
    </>
  )
}
