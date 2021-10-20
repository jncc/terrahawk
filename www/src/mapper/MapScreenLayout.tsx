
import * as React from 'react'
import { connect as reduxConnect } from 'react-redux'
import { ChoroplethItem } from './types'
import { LeafletMap } from './LeafletMap'
import { MapControls } from './MapControls'
import { LibreMap } from './LibreMap'
import { Loader } from './Loader'
import { QueryPanel } from './QueryPanel'

let rightPanelAnimationVariants = {
  open: { x: 0 },
  closed: { x: '104%' }, // move right by slightly more than its width
}
let leftPanelAnimationVariants = {
  open: { x: 0 },
  closed: { x: '-104%' }, // move left by slightly more than its width
}

export let MapScreenLayout = () => {

  let [rightPanelOpen, setRightPanelOpen] = React.useState(true)
  let [leftPanelOpen, setLeftPanelOpen] = React.useState(true)
  
  return <>
    {makeScreenreaderNotice()}
    {makeSmallScreenWarning()}
    <div className="hidden lg:block"> {/* hide the whole map unless large screen */} 
      <Loader />
      <QueryPanel />
      {/* <MapControls /> */}
      <LeafletMap />
    </div>
  </>
}

let makeSmallScreenWarning = () =>
  <div className="lg:hidden flex h-screen">
    <div className="m-auto space-y-2 p-5">
      <h1 className="text-xl">
      This map is made for large displays. 🦉 
      </h1>
      <ul className="list-disc list-inside px-5">
        <li>increase your <b>screen size</b>, or</li>
        <li>change your browser <b>zoom level</b>.</li>
      </ul>
    </div>
  </div>

let makeScreenreaderNotice = () =>
  <div className="sr-only">
    This interactive map application is not operable by screenreader.
  </div>
