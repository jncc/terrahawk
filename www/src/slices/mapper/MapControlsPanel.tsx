
import React from 'react'
import { Toggle } from '../../components/Toggle'

import { useStateDispatcher, useStateSelector } from '../../state/hooks'
import { mapperActions } from './slice'

import { OverlayToggle } from './OverlayToggle'
import { ZoomButton } from './ZoomButton'

export let MapControlsPanel = () => {

  let dispatch = useStateDispatcher()
  let state = useStateSelector(s => s.mapper)

  return (
    <div className="z-abovemap absolute bottom-6 left-6 animate-delayedfadein ">
      <ZoomButton buttonType="in" onClick={() => dispatch(mapperActions.mapZoomIn())}/>
      <ZoomButton buttonType="out" onClick={() => dispatch(mapperActions.mapZoomOut())}/>
    </div>
  )
}
