
import React from 'react'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { globalActions } from '../global/slice'
import { mapperActions } from './slice'

export let MapControls = (props: any) => {

  let dispatch = useStateDispatcher()
  let state = useStateSelector(s => s.mapper)
  let globalState = useStateSelector(s => s.global)

  return (
    //   <Delayed delayInMilliseconds={800}>
    <div className="bottom-left-controls">

      <div className="mr-2">
      

        <button onClick={() => dispatch(mapperActions.devAction())}>
          dev action
        </button>
        <br />
        <button onClick={() => dispatch(mapperActions.mapCenterChanged())}>
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
        {state.polygons.map(p => <div key={p.polyid}>{p.polyid}</div>)}

      </div>
      {/* <div className="little-control-container mr-2">
              <Form.Check
                checked={props.visualise}
                type="switch"
                id="visualised-checkbox"
                label="Visualise"
                onChange={() => props.dispatch(AppActions.toggleVisualise())}
              />
            </div>
            <div>
              <Button onClick={() => props.dispatch(AppActions.resetToCenter())} variant="light">
                <i className="fas fa-crosshairs mr-2" aria-hidden="true" />
                Reset
              </Button>
            </div> */}
    </div>
    //   </Delayed>
  )
}
