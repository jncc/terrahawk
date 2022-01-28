
import React, { useMemo } from 'react'

import { Poly, SimpleDate } from './types'
import { Thumb } from './Thumbnail'
import { getPolygonOutline, getReprojectedCoordinates } from '../../thumbnails/thumbnailGenerator'
import { height, width } from './helpers/thumbnailHelper'
import { frameworks } from '../../frameworks'
import { useStateDispatcher, useStateSelector } from '../../state/hooks'
import { Toggle } from '../../components/Toggle'
import { mapperActions } from './slice'
import { indexnames } from './helpers/statsHelper'

export let ThumbnailSlider = (props: {framesWithDate: {frame: string, date: SimpleDate}[]}) => {

  let dispatch = useStateDispatcher()
  let framework = useStateSelector(s => s.mapper.query.framework)
  let selectedPolygon = useStateSelector(s => s.mapper.selectedPolygon) as Poly // selectedPolygon can't be undefined in this component
  let showOutlines = useStateSelector(s => s.mapper.showOutlines)
  let useProxy = useStateSelector(s => s.mapper.useProxy)
  let thumbType = useStateSelector(s => s.mapper.thumbType)
  let indexname = useStateSelector(s => s.mapper.query.indexname)
  
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
        {props.framesWithDate.map(x => <Thumb
          key={x.frame + indexname + thumbType} // force a rerender when we need to reload the thumbnail
          frame={x.frame}
          date={x.date}
          thumbType={thumbType}
          indexname={indexname}
          nativeCoords={nativeCoords}
          outlineSvg={outline}/>)
        }
      </div>
      <div className="flex gap-4">
        <div className="flex-none flex items-center gap-3">
            <label className="inline-flex items-center cursor-pointer text-sm ">
              <input
                type="radio"
                className="custom-ring cursor-pointer"
                name="thumbnailtype"
                value="colour"
                checked={thumbType === 'colour'}
                onChange={() => dispatch(mapperActions.toggleThumbType())}
              />
              <span className="ml-1">True colour</span>
            </label>
            <label className="inline-flex items-center cursor-pointer text-sm ">
              <input
                type="radio"
                className="custom-ring cursor-pointer"
                name="thumbnailtype"
                value="index"
                checked={thumbType === 'index'}
                onChange={() => dispatch(mapperActions.toggleThumbType())}
              />
              <span className="ml-1">Index ({indexnames[indexname].description})</span>
            </label>
        </div>
        <div className="flex-grow"></div>
        <div className="flex">
          <Toggle label="Boost" title="Quicker image loading" position="left" checked={useProxy} onChange={() => dispatch(mapperActions.toggleProxy())} />
          <Toggle label="Outlines" title="Show polygon boundary lines" position="left" checked={showOutlines} onChange={() => dispatch(mapperActions.toggleOutlines())} />
        </div>
      </div>
    </>
  )
}
