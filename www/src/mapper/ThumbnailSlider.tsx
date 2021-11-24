
import React from 'react'

import { SimpleDate } from './types'
import { Thumb } from './Thumbnail'
import { getPolygonOutline, getReprojectedCoordinates } from '../thumbnails/thumbnailGenerator'
import { height, width } from './helpers/thumbnailHelper'
import { frameworks } from '../frameworks'
import { useStateSelector } from '../state/hooks'

export let ThumbSlider = (props: {framesWithDate: {frame: string, date: SimpleDate}[]}) => {

  let query = useStateSelector(s => s.mapper.query)
  let selectedPolygon = useStateSelector(s => s.mapper.selectedPolygon)
  
  if (!selectedPolygon)
    return null

  // do calcs common to all the thumbnails in the slider up here
  let nativeCoords = getReprojectedCoordinates(selectedPolygon.geojson.coordinates, frameworks[query.framework].srs)
  let polygonRings = getPolygonOutline(nativeCoords, width, height)

  let outline = <svg 
                  className="col-span-full row-span-full"
                  height={height}
                  width={width}>
                  {polygonRings.map((points, i) => <polygon key={i} points={points} style={{stroke: '#eeeeee', strokeWidth: '1', fill: 'none'}} />)}
                </svg>

  return (
    <div className="flex overflow-y-auto gap-0.5 pb-2 pt-1 ">
      {props.framesWithDate.map(x => <Thumb key={x.frame} frame={x.frame} date={x.date} nativeCoords={nativeCoords} outlineSvg={outline}/>)}
    </div>
  )
}
