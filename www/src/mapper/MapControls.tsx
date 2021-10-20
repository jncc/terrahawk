
import React from 'react'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { globalActions } from '../global/slice'
import { mapperActions } from './slice'
import { Panel } from './Panel'

export let MapControls = (props: any) => {

  let dispatch = useStateDispatcher()
  let state = useStateSelector(s => s.mapper)
  let globalState = useStateSelector(s => s.global)

  return (
    <div className="z-abovemap absolute top-6 right-6 animate-delayedfadein ">

      <div className="bg-white rounded-xl overflow-hidden shadow-xl p-5">

      </div>

    </div>
  )
}

        {/* <button onClick={() => dispatch(mapperActions.mapCenterChanged())}>
          fetchPolygons
        </button>
        <br />
        <button onClick={() => dispatch(globalActions.ping())}>
          PING
        </button>
        <br />
        <div>
          Loading? {globalState.loading}
        </div>
        <div>
          Error: {globalState.errorMessage}
        </div>
        <button onClick={() => dispatch(mapperActions.mapZoomChanged(13))} aria-label="Zoom in">
          Zoom to 13
        </button>
        <br />
        {state.polygons.map(p => <div key={p.polyid}>{p.polyid}</div>)} */}
