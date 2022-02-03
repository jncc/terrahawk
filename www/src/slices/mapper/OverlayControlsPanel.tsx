
import React from 'react'

import { useStateDispatcher, useStateSelector } from '../../state/hooks'
import { mapperActions } from './slice'
import { Toggle } from '../../components/Toggle'
import { Panel } from './Panel'

export let OverlayControlsPanel = () => {

  let dispatch = useStateDispatcher()
  let state = useStateSelector(s => s.mapper)

  return (
    <>
    <Panel extraClasses="inline-block relative px-2 py-1">
      <Toggle
        label="Field data"
        position="right"
        checked={state.showNpmsData}
        onChange={() => dispatch(mapperActions.toggleNpmsData())}
        title="Show field data on the map"
      />
      {state.showNpmsData &&
      <>
        <div className="block mr-1">
          <svg className="inline mx-1" width={20} height={20}>
            <circle
              cx={10}
              cy={10}
              r={6}
              fill="green"
            />
          </svg>
          <span className="text-sm">Same habitat</span>
        </div>
        <div className="block mr-1 mb-2">
          <svg className="inline mx-1" width={20} height={20}>
          <circle
            cx={10}
            cy={10}
            r={6}
            fill="gray"
          />
          </svg>
          <span className="text-sm">Different habitat</span>
        </div>
      </>

      }
    </Panel>
    <br />
    <Panel extraClasses="inline-block relative px-2 py-1">
      <Toggle
        label="Polygons"
        position="right"
        checked={state.showPolygons}
        onChange={() => dispatch(mapperActions.togglePolygons())}
        title="Show polygons on the map"
      />      
    </Panel>
    </>
  )
}
