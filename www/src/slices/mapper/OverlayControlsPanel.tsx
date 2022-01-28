
import React from 'react'

import { useStateDispatcher, useStateSelector } from '../../state/hooks'
import { mapperActions } from './slice'

import { OverlayToggle } from './OverlayToggle'

export let OverlayControlsPanel = () => {

  let dispatch = useStateDispatcher()
  let state = useStateSelector(s => s.mapper)

  return (
    <>
      <OverlayToggle
        label="Polygons"
        position="left"
        checked={state.showPolygons}
        onChange={() => dispatch(mapperActions.togglePolygons())}/>

      {/* <OverlayToggle
        label="NPMS data"
        position="left"
        checked={state.showNpmsData}
        onChange={() => dispatch(mapperActions.toggleNpmsData())}/> */}
    </>
  )
}
