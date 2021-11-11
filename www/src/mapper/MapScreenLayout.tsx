
import * as React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { LeafletMap } from './LeafletMap'
import { ControlsPanel } from './ControlsPanel'
import { QueryPanel } from './QueryPanel'
import { FrameworkPanel } from './FrameworkPanel'
import { globalActions } from '../global/slice'
import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { mapperActions } from './slice'
import jnccLogoUrl from '../assets/JNCCLogo_Black-340.png'
import { PolygonPanel } from './PolygonPanel'
import { GazetteerPanel } from './GazetteerPanel'

export let MapScreenLayout = () => {

  let dispatch = useStateDispatcher()
  let state = useStateSelector(s => s.mapper)

  // keyboard shortcuts
  useHotkeys('p', () => { dispatch(mapperActions.togglePolygons()) })
  useHotkeys('e', () => { dispatch(globalActions.errorOccurred('You pressed `e`')) })
  
  return <>
    {makeScreenreaderNotice()}
    {/* hide the small screen warning on large screen */} 
    <div className="xl:hidden">
      {makeSmallScreenWarning()}
    </div>
    {/* hide the mapper unless on large screen */} 
    <div className="hidden xl:block">
      {!state.zoomedEnoughToShowPolygons && makePleaseZoomInMessage()}
      <GazetteerPanel />
      <QueryPanel />
      <FrameworkPanel />
      {/* <PolygonPanel /> */}
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
  <div className="h-screen flex">
    <div className="m-auto space-y-2 p-5">
      <div className="opacity-70">
        <img src={jnccLogoUrl} alt="JNCC logo" width="340" height="127" />
      </div>
      <h1 className="text-xl">
        This map is made for large displays. 🦉 
      </h1>
      <ul className="list-disc list-inside px-5">
        <li>use a <b>desktop device</b></li>
        <li><b>maximise</b> your browser window</li>
        <li>reduce your browser <b>zoom level</b></li>
        <li>increase your <b>screen size</b></li>
      </ul>
    </div>
  </div>

let makePleaseZoomInMessage = () =>
  <div className="z-abovemap absolute top-24 w-full animate-delayedfadein">
    <div className="flex justify-center items-center ">
      <div className="bg-gray-700 text-white text-lg font-bold px-8 pb-0.5 rounded-xl shadow-xl">
          Zoom in to your area of interest
      </div>
    </div>
  </div>
