
import React from 'react'
import { Alert } from './global/Alert'
import { Loader } from './global/Loader'

import { Mapper } from './mapper/Mapper'
import { PolygonTooltipForDev } from './mapper/PolygonTooltip'

export function App() {

  return (
    <>
    <Loader />
    <Alert />
    <Mapper />
    {/* <PolygonTooltipForDev /> */}
    </>
  )
}
