
import React from 'react'
import { Toggle } from '../../components/Toggle'

import { useStateDispatcher, useStateSelector } from '../../state/hooks'
import { mapperActions } from './slice'

import { OverlayToggle } from './OverlayToggle'
import { ZoomButton } from './ZoomButton'

export let ControlsPanel = () => {

  let dispatch = useStateDispatcher()
  let state = useStateSelector(s => s.mapper)

  return (
    <>
      <ZoomButton buttonType="in" />
      <ZoomButton buttonType="out" />

      <OverlayToggle
        label="Polygons"
        position="left"
        checked={state.showPolygons}
        onChange={() => dispatch(mapperActions.togglePolygons())}/>

      <OverlayToggle
        label="NPMS data"
        position="left"
        checked={state.showNpmsData}
        onChange={() => dispatch(mapperActions.toggleNpmsData())}/>
    </>
  )
}
