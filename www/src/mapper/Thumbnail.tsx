
import React, { useEffect, useState } from 'react'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { mapperActions } from './slice'


import { getBoundingBoxWithBuffer, convertOsgbToPixelCoords, getThumbnail } from '../thumbnails/thumbnailGenerator'
import { thumbnailConfig } from '../thumbnails/config'
import { Polygon } from '../thumbnails/types'
import proj4 from 'proj4'

export let Thumbnail = (props: {frame: string, load: boolean}) => {

  let dispatch = useStateDispatcher()
  let { selectedPolygon, selectedFrame, hoveredFrame, } = useStateSelector(s => s.mapper )

  let [loaded, setLoaded] = useState(false)

  let hovered = props.frame === hoveredFrame
  let selected = props.frame === selectedFrame
  let borderColor = selected ? 'border-red-500' :
                    hovered ?  'border-gray-300' :
                               'border-transparent'

  let thumbnailWidth = 100 // in pixels
  let thumbnailHeight = 100
  let thumbnailBuffer = 0.1

  let sourceProjection = 'WGS84'
  let destinationProjection = '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs'

  let originalPolygonCoords = selectedPolygon!.geojson.coordinates
  let polygon: Polygon = {
    polygonId: selectedPolygon!.polyid,
    coordinates: JSON.parse(JSON.stringify(originalPolygonCoords)) //clone it
  }

  for (let a = 0; a < originalPolygonCoords.length; a++) {
    let innerRings = originalPolygonCoords[a]
    for (let b = 0; b < innerRings.length; b++) {
      let coordPairs = innerRings[b]
      for (let c = 0; c < coordPairs.length; c++) {
        let coordPair = coordPairs[c]
        let reprojectedCoord = proj4(sourceProjection, destinationProjection, coordPair)

        polygon.coordinates[a][b][c] = reprojectedCoord
      }
    }
  }

  let polygonOutlineCoords = polygon.coordinates[0]

  let thumbnailBbox = getBoundingBoxWithBuffer(polygonOutlineCoords[0], thumbnailBuffer)

  let osgbScale = {
    xMin: thumbnailBbox[0],
    xMax: thumbnailBbox[1],
    yMin: thumbnailBbox[2],
    yMax: thumbnailBbox[3]
  }

  let polygonRings : string[] = []
  polygonOutlineCoords.forEach(polygonRing => {
    let pixelScale = {
      xMin: 0,
      xMax: thumbnailWidth,
      yMin: 0,
      yMax: thumbnailHeight
    }
  
    let pointsString = ''

    // console.log(polygonRing)
    polygonRing.forEach(coords => {
      let pixelCoords = convertOsgbToPixelCoords(coords, osgbScale, pixelScale)
      pointsString += `${pixelCoords[0]},${pixelCoords[1]} `
    })

    polygonRings.push(pointsString)
  })

  let [src, setSrc] = useState('http://placekitten.com/100/100')

  useEffect(() => {
    if (props.load && !loaded) {
      getThumbnail(props.frame, polygon, thumbnailConfig.falseColour).then((src: string) => setSrc(src))
      setLoaded(true)
    }
  // }, [props.frame, selectedPolygon!.polyid, thumbnailConfig.falseColour.text])  
  }, [loaded, props.load])

  return (
    <div
      className={`flex-none border-4 p-1 cursor-pointer ${borderColor}`}
      onMouseEnter={() => dispatch(mapperActions.hoverFrame(props.frame))}
      onMouseLeave={() => dispatch(mapperActions.hoverFrame(undefined))}
      onClick={() => dispatch(mapperActions.selectFrame(props.frame))}
    >
      <img src={src} height={thumbnailHeight} width={thumbnailWidth} />
        {/* <svg style={{
          position: 'absolute',
          top: 0,
          left: 0}}>
          {
            polygonRings.map(pointsString => {
              return <polygon
                points={pointsString}
                style={{stroke: 'black', strokeWidth: '1', fill: 'transparent'}} />
            })
          }
        </svg> */}
    </div>
  )
}
