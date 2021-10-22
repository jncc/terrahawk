
import React from 'react'
import { Loader } from './global/Loader'

import { MapScreenLayout } from './mapper/MapScreenLayout'
import { PolygonTooltipForDev } from './mapper/PolygonTooltip'

export function App() {

  return (
    <>
    <Loader />
    <MapScreenLayout />
    {/* <PolygonTooltipForDev /> */}
    </>
  )
}
