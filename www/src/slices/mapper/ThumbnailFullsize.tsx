
import React, { useEffect, useState } from 'react'

import { useStateSelector } from '../../state/hooks'

import { getPolygonOutline, getThumbnail, getReprojectedCoordinates, getBoundingBoxWithBuffer } from '../../thumbnails/thumbnailGenerator'

export let ThumbnailFullsize = (props: {frame: string, showOutline: boolean}) => {

  let { selectedPolygon } = useStateSelector(s => s.mapper )

  if (!selectedPolygon)
    return null

  let [loaded, setLoaded] = useState(false)
  let [width, setWidth] = useState(0)
  let [height, setHeight] = useState(0)
  let [src, setSrc] = useState('http://placekitten.com/100/100')

  useEffect(() => {
    if (!loaded && selectedPolygon) {
      let bbox = getBoundingBoxWithBuffer(reprojectedCoords, 0.05)
      getThumbnail(props.frame, bbox, 'trueColour').then((canvas) => {
        let imgSrc = canvas.toDataURL('image/png')
        setSrc(imgSrc)
      })
      setLoaded(true)
    }
  }, [loaded])

  let reprojectedCoords = getReprojectedCoordinates(selectedPolygon.geojson.coordinates, 'osgb')

  let polygonRings : string[] = []
  if (loaded) {
    polygonRings = getPolygonOutline(reprojectedCoords, width, height)
  }

  return (
    <div className="flex-none border-4 p-1">
      {/* todo: move the styles out? */}
      <div style={{position: 'relative', display: 'inline-block'}}>
        <img src={src} onLoad={(e) => {
          // get image dimensions dynamically to use in creating the svg outline
          let imageElement = e.target as HTMLElement
          setHeight(imageElement.offsetHeight)
          setWidth(imageElement.offsetWidth)
          }
        } />
        {props.showOutline && loaded &&
          <svg height={height} width={width} style={{position: 'absolute', top: 0, left: 0}}>
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
