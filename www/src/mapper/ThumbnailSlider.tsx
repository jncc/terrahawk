
import React, { useMemo } from 'react'

import { Poly, SimpleDate } from './types'
import { Thumb } from './Thumbnail'
import { getPolygonOutline, getReprojectedCoordinates } from '../thumbnails/thumbnailGenerator'
import { height, width } from './helpers/thumbnailHelper'
import { frameworks } from '../frameworks'
import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { Toggle } from '../components/Toggle'
import { mapperActions } from './slice'

export let ThumbnailSlider = (props: {framesWithDate: {frame: string, date: SimpleDate}[]}) => {

  let dispatch = useStateDispatcher()
  let framework = useStateSelector(s => s.mapper.query.framework)
  let selectedPolygon = useStateSelector(s => s.mapper.selectedPolygon) as Poly // selectedPolygon can't be undefined in this component
  let showOutlines = useStateSelector(s => s.mapper.showOutlines)
  let useProxy = useStateSelector(s => s.mapper.useProxy)
  
  // do calcs common to all the thumbnails up here in the slider
  let nativeCoords = useMemo(() => getReprojectedCoordinates(selectedPolygon.geojson.coordinates, frameworks[framework].srs),
                                                            [selectedPolygon.geojson.coordinates, frameworks[framework].srs])
  let polygonRings = useMemo(() => getPolygonOutline(nativeCoords, width, height),
                                                    [nativeCoords, width, height])
  let outline = <svg
                  className="col-span-full row-span-full animate-quickfadein"
                  height={height}
                  width={width}>
                  {polygonRings.map((points, i) => <polygon key={i} points={points} style={{stroke: '#eeeeee', strokeWidth: '1', fill: 'none'}} />)}
                </svg>

  return (
    <>
      <div className="flex overflow-y-auto pb-2 pt-1 mb-1">
        {props.framesWithDate.map(x => <Thumb key={x.frame} frame={x.frame} date={x.date} nativeCoords={nativeCoords} outlineSvg={outline}/>)}
      </div>
      <div className="flex gap-4">
        <div className="flex-grow"></div>
        <div className="flex-none flex items-center text-sm">

            {/* <div>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="thumbnailtype"
                  value="colour"
                  checked
                />
                <span className="ml-2">Colour</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="thumbnailtype"
                  value="index"
                />
                <span className="ml-2">Index</span>
              </label>
            </div> */}

        </div>
        <div className="flex">
          <Toggle label="Low bandwidth" position="left" checked={useProxy} onChange={() => dispatch(mapperActions.toggleProxy())} />
          <Toggle label="Outlines" position="left" checked={showOutlines} onChange={() => dispatch(mapperActions.toggleOutlines())} />
        </div>
      </div>
    </>
  )
}
