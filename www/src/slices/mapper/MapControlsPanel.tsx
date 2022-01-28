
import React from 'react'

import { useStateDispatcher } from '../../state/hooks'
import { mapperActions } from './slice'
import { ZoomButton } from './ZoomButton'

export let MapControlsPanel = () => {

  let dispatch = useStateDispatcher()

  return (
    <div className="z-abovemap absolute bottom-20 left-6 animate-delayedfadein">
      <ZoomButton buttonType="in" onClick={() => dispatch(mapperActions.mapZoomIn())} />
      <ZoomButton buttonType="out" onClick={() => dispatch(mapperActions.mapZoomOut())} />
    </div>
  )
}
