
import React from 'react'
import { Alert } from './global/Alert'
import { Loader } from './global/Loader'

import { MapScreenLayout } from './mapper/MapScreenLayout'
import { PolygonTooltipForDev } from './mapper/PolygonTooltip'

export function App() {

  return (
    <>
    <Loader />
    <Alert />
    <MapScreenLayout />
    {/* <PolygonTooltipForDev /> */}
    </>
  )
}
