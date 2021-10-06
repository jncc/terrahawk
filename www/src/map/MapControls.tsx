import React from 'react'
import { useStateDispatcher } from '../state/hooks'
import { increaseZoom, ping } from './mapSlice'

export let MapControls = (props: any) => {

  let dispatch = useStateDispatcher()

  return (
    //   <Delayed delayInMilliseconds={800}>
    <div className="bottom-left-controls">

      <div className="mr-2">
        <button onClick={() => dispatch(ping())} aria-label="Zoom in">
          PING
        </button>
        <button onClick={() => dispatch(increaseZoom())} aria-label="Zoom in">
          ZOOM IN!
        </button>
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
