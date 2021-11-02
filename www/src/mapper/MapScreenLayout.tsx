
import * as React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { LeafletMap } from './LeafletMap'
import { ControlsPanel } from './ControlsPanel'
import { QueryPanel } from './QueryPanel'
import { FrameworkPanel } from './FrameworkPanel'
import { globalActions } from '../global/slice'
import { useStateDispatcher } from '../state/hooks'
import { mapperActions } from './slice'


let rightPanelAnimationVariants = {
  open: { x: 0 },
  closed: { x: '104%' }, // move right by slightly more than its width
}
let leftPanelAnimationVariants = {
  open: { x: 0 },
  closed: { x: '-104%' }, // move left by slightly more than its width
}

export let MapScreenLayout = () => {

  let dispatch = useStateDispatcher()

  useHotkeys('space', () => { dispatch(mapperActions.togglePolygons()) })
  useHotkeys('e', () => { dispatch(globalActions.errorOccurred('You pressed `e`')) })
  
  return <>
    {makeScreenreaderNotice()}
    {makeSmallScreenWarning()}
    <div className="hidden xl:block"> {/* hide the whole map unless large screen */} 
      <QueryPanel />
      <FrameworkPanel />
      <ControlsPanel />
      <LeafletMap />
    </div>
  </>
}

let makeScreenreaderNotice = () =>
  <div className="sr-only">
    This map-based application is not designed to be accessible via screenreader.
  </div>

let makeSmallScreenWarning = () =>
  <div className="xl:hidden flex h-screen">
    <div className="m-auto space-y-2 p-5">
      <h1 className="text-xl">
      This map is made for large displays. 🦉 
      </h1>
      <ul className="list-disc list-inside px-5">
        <li>increase your <b>screen size</b></li>
        <li><b>maximise</b> your browser window</li>
        <li>change your browser <b>zoom level</b>.</li>
      </ul>
    </div>
  </div>
