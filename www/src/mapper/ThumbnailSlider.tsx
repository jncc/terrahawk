
import React, { Component, useState } from 'react'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { Thumbnail } from './Thumbnail'

export let ThumbnailSlider = (props: {frames: string[]}) => {

  let {selectedPolygonStats, selectedFrame} = useStateSelector(s => s.mapper)
  
  if (!props.frames || !selectedPolygonStats || !selectedFrame)
    return null

  let indexOfSelectedFrame = props.frames.indexOf(selectedFrame)

  return (
    <div>
        {getItems(props.frames)}
    </div>
  )

}

let getItems = (frames: string[]) => {
  return frames.map(f => <Thumbnail key={f} frame={f} load={true} />)
}
