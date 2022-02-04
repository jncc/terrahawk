
import React from 'react'

import { useStateDispatcher, useStateSelector } from '../../state/hooks'
import { mapperActions } from './slice'
import { Toggle } from '../../components/Toggle'
import { Panel } from './Panel'
import { getMarkerColour } from './helpers/fieldDataHelper'
import { LegendEntry } from './LegendEntry'
import { getColour } from './helpers/choroplethHelpers'

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
      <div className="mb-1">
        <LegendEntry colour={getMarkerColour(true)} opacity={1} text="Same habitat" />
        <LegendEntry colour={getMarkerColour(false)} opacity={1} text="Different habitat" />
      </div>
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
      {state.showPolygons &&
      <div className="mb-1">
        <LegendEntry colour={getColour(2.1)} opacity={0.6} text="High change" />
        <LegendEntry colour={getColour(1.1)} opacity={0.6} text="Moderate change" />
        <LegendEntry colour={getColour(0)} opacity={0.6} text="No change" />
      </div>
      }
    </Panel>
    </>
  )
}
