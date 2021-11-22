
import React, { useEffect, useState } from 'react'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { mapperActions } from './slice'

import { getPolygonOutline, getThumbnail, getReprojectedCoordinates } from '../thumbnails/thumbnailGenerator'

export let Thumbnail = (props: {frame: string, height: number, width: number, showOutline: boolean, load: boolean}) => {

  let dispatch = useStateDispatcher()
  let { selectedPolygon, selectedFrame, hoveredFrame, } = useStateSelector(s => s.mapper )

  if (!selectedPolygon)
    return null

  let [loaded, setLoaded] = useState(false)
  let [src, setSrc] = useState('http://placekitten.com/100/100')

  useEffect(() => {
    if (props.load && !loaded && selectedPolygon) {
      getThumbnail(props.frame, selectedPolygon.polyid, reprojectedCoords, 'trueColour').then((src: string) => setSrc(src))
      setLoaded(true)
    }
  }, [loaded, props.load])

  let hovered = props.frame === hoveredFrame
  let selected = props.frame === selectedFrame
  let borderColor = selected ? 'border-red-500' :
                    hovered ?  'border-gray-300' :
                               'border-transparent'

  let reprojectedCoords = getReprojectedCoordinates(selectedPolygon.geojson.coordinates, 'osgb')

  let polygonRings : string[] = []
  if (props.showOutline) {
    polygonRings = getPolygonOutline(reprojectedCoords, props.width, props.height)
  }
 
  return (
    <div
      className={`flex-none border-4 p-1 cursor-pointer ${borderColor}`}
      onMouseEnter={() => dispatch(mapperActions.hoverFrame(props.frame))}
      onMouseLeave={() => dispatch(mapperActions.hoverFrame(undefined))}
      onClick={() => dispatch(mapperActions.selectFrame(props.frame))}
    >
      {/* todo: move the styles out? */}
      <div style={{position: 'relative', display: 'inline-block'}}>
        <img src={src} height={props.height} width={props.width} />
        {props.showOutline &&
          <svg height={props.height} width={props.width} style={{position: 'absolute', top: 0, left: 0}}>
            {
              polygonRings.map((pointsString, i) => {
                return <polygon key={`polygon_${i}`}
                  points={pointsString}
                  style={{stroke: 'blue', strokeWidth: '1', fill: 'blue', fillOpacity: 0.1}} />
              })
            }
          </svg>
        }
      </div>
    </div>
  )
}
