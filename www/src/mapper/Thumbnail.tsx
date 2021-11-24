
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { GlobeIcon } from '@heroicons/react/outline'

import { frameworks } from '../frameworks'
import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { getPolygonOutline, getReprojectedCoordinates, getThumbnail } from '../thumbnails/thumbnailGenerator'
import { getDisplayDate } from './helpers/dateHelper'
import { mapperActions } from './slice'
import { SimpleDate } from './types'
import { height, width } from './helpers/thumbnailHelper'
// import loader from '../assets/1494.gif'

export let Thumb = (props: {
  frame:        string,
  date:         SimpleDate,
  nativeCoords: number[][][][],
  outlineSvg:   ReactElement}) => {

  let dispatch = useStateDispatcher()
  let selectedPolygon = useStateSelector(s => s.mapper.selectedPolygon)
  let hoveredFrame    = useStateSelector(s => s.mapper.hoveredFrame)
  let selectedFrame   = useStateSelector(s => s.mapper.selectedFrame)

  if (!selectedPolygon)
    return null

  let polyid = selectedPolygon.polyid

  let [load, setLoad] = useState(false)
  let [loaded, setLoaded] = useState(false)
  let [src, setSrc] = useState('http://placekitten.com/100/100')

  let hovered = props.frame === hoveredFrame
  let selected = props.frame === selectedFrame
  let bgColor = selected ? 'bg-blue' :
                hovered  ? 'bg-gray-300' :
                           'bg-transparent'

  let div = useRef<HTMLDivElement>(null)

  // set load to true when the div becomes visible
  useEffect(() => {
    if (div.current) {
      new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting)
            setLoad(true)
        })
      }).observe(div.current)
    }
  }, [div.current])

  // on first mount, show the selected thumb with no animation
  useEffect(() => {
    if (selected && div.current) {
      div.current.scrollIntoView({inline: 'center'})
    }
  }, [])

  // when this thumb is selected, use the native browser scrollIntoView method
  useEffect(() => {
    if (selected && div.current) {
      div.current.scrollIntoView({behavior: 'smooth', inline: 'center'})
    }
  }, [selected])

  useEffect(() => {
    if (load && !loaded) {
      setTimeout(() => {
        getThumbnail(props.frame, polyid, props.nativeCoords, 'trueColour', true).then((img) => {
          setSrc(img)
          setLoaded(true)
        })
      }, 500) // hack to reduce jank - let the slider finish animating
    }
  }, [load, loaded])

  return (
    <div
      ref={div}
      className="flex-none rounded-xl"
      >
      <button
        className={`custom-ring p-1.5 cursor-pointer rounded-xl ${bgColor}`}
        onMouseEnter={() => dispatch(mapperActions.hoverFrame(props.frame))}
        onMouseLeave={() => dispatch(mapperActions.hoverFrame(undefined))}
      >
        <div
          className="grid"
          style={{height: height, width: width}}
          onClick={() => dispatch(mapperActions.selectFrame(props.frame))}
        >
          <div
            className="flex col-span-full row-span-full rounded-lg bg-gray-100"
            style={{height: height, width: width}}          
          >
            {/* {!loaded && load &&
            <div className="m-auto">
              <GlobeIcon className="h-5 w-5 text-gray-400 opacity-0 animate-delayedthumbnail"/>
            </div>
            } */}
          </div>
          {loaded &&
          <>
          <img
            src={src}
            className="col-span-full row-span-full rounded-lg animate-quickfadein"
            height={height}
            width={width}
            alt={`Thumbnail image for ${getDisplayDate(props.date)}`}
          />
          {/* {props.outlineSvg} */}
          </>
          }
        </div>
      </button>

      <div className="text-center text-sm ">
        {getDisplayDate(props.date)}
        {/* {load ? '🍔' : ''} */}
      </div>

    </div>
  )
}
