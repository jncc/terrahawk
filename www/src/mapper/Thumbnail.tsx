
import React, { useEffect, useState } from 'react'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { mapperActions } from './slice'


import { getPolygonSVGDefinition, getThumbnail } from '../thumbnails/thumbnailGenerator'
import { thumbnailConfig } from '../thumbnails/config'
import { Polygon } from '../thumbnails/types'

export let Thumbnail = (props: {frame: string, load: boolean}) => {

  let dispatch = useStateDispatcher()
  let { selectedPolygon, selectedFrame, hoveredFrame } = useStateSelector(s => s.mapper )

  let [loaded, setLoaded] = useState(false)

  let hovered = props.frame === hoveredFrame
  let selected = props.frame === selectedFrame
  let borderColor = selected ? 'border-red-500' :
                    hovered ?  'border-gray-300' :
                               'border-transparent'

  let thumbnailWidth = 100 // in pixels
  let thumbnailHeight = 100
  let polygon: Polygon = {
    polygonId: selectedPolygon!.polyid,
    coordinates: selectedPolygon!.geojson.coordinates
  }

  // console.log(`Polygon coordinates: ${polygon.coordinates}`)

  let [src, setSrc] = useState('')

  useEffect(() => {

    getThumbnail(props.frame, polygon, thumbnailConfig.falseColour).then((src: string) => setSrc(src))

  }, [props.frame, polygon.polygonId, thumbnailConfig.falseColour.text])

  // let body = document.body
  // let svgOutline = getPolygonSVGDefinition(polygon, thumbnailWidth, thumbnailHeight)
  // body.prepend(svgOutline)

  // let s2TrueColourDiv = document.getElementById(props.frame)

  // .then(thumbnailString => {
  //   let thumbnailDiv = document.createElement('div')
  //   thumbnailDiv.className = `thumbnail-overlay-${props.frame}`
  //   let imageElement = new Image(thumbnailWidth, thumbnailHeight)
  //   imageElement.src = thumbnailString

  //   thumbnailDiv.appendChild(imageElement)

  //   let thumbnailLabel = document.createElement('div')
  //   let date = props.frame.substring(4, 12)
  //   thumbnailLabel.textContent = date
  //   thumbnailDiv.appendChild(thumbnailLabel)

  //   if (s2TrueColourDiv) {
  //     s2TrueColourDiv.appendChild(thumbnailDiv)
  //   }
  // })
  

  return (
    <div
      key={props.frame}
      className={`border-4 w-40 p-4 cursor-pointer ${borderColor}`}
      onMouseEnter={() => dispatch(mapperActions.hoverFrame(props.frame))}
      onMouseLeave={() => dispatch(mapperActions.hoverFrame(undefined))}
      onClick={() => dispatch(mapperActions.selectFrame(props.frame))}
    >
      <img src={src} width={thumbnailWidth} height={thumbnailHeight} />
      {/* <div className="overflow-hidden" id={props.frame} key={`thumbnail-${props.frame}`}>
        {props.frame}
      </div> */}
    </div>
  )
}
