
import React from 'react'
import { Toggle } from '../../components/Toggle'

import { useStateDispatcher, useStateSelector } from '../../state/hooks'
import { mapperActions } from './slice'

export let ControlsPanel = () => {

  let dispatch = useStateDispatcher()
  let state = useStateSelector(s => s.mapper)

  return (
    <div className="z-abovemap absolute bottom-6 right-6 animate-delayedfadein ">
      <div className="bg-white rounded-xl overflow-hidden shadow-xl px-4 py-3">

        <Toggle
          label="Polygons"
          position="left"
          checked={state.showPolygons}
          onChange={() => dispatch(mapperActions.togglePolygons())}
        />

      </div>
    </div>
  )
}
