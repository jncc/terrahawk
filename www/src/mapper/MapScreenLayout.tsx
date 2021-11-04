
import * as React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { LeafletMap } from './LeafletMap'
import { ControlsPanel } from './ControlsPanel'
import { QueryPanel } from './QueryPanel'
import { FrameworkPanel } from './FrameworkPanel'
import { globalActions } from '../global/slice'
import { useStateDispatcher } from '../state/hooks'
import { mapperActions } from './slice'
import jnccLogoUrl from '../assets/JNCCLogo_Black-340.png'

export let MapScreenLayout = () => {

  let dispatch = useStateDispatcher()

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
