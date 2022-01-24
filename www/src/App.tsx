
import React from 'react'
import { Alert } from './slices/global/Alert'
import { Loader } from './slices/global/Loader'

import { Mapper } from './slices/mapper/Mapper'
import { PolygonTooltipForDev } from './slices/mapper/PolygonTooltip'

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
