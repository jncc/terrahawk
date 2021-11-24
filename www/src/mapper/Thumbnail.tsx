
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { GlobeIcon } from '@heroicons/react/outline'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { getThumbnail } from '../thumbnails/thumbnailGenerator'
import { getDisplayDate } from './helpers/dateHelper'
import { mapperActions } from './slice'
import { Poly, SimpleDate } from './types'
import { height, width } from './helpers/thumbnailHelper'

export let Thumb = (props: {
  frame:        string,
  date:         SimpleDate,
  nativeCoords: number[][][][],
  outlineSvg:   ReactElement}) => {

  let dispatch = useStateDispatcher()
  let selectedPolygon = useStateSelector(s => s.mapper.selectedPolygon) as Poly // can't be undefined down here
  let hoveredFrame    = useStateSelector(s => s.mapper.hoveredFrame)
  let selectedFrame   = useStateSelector(s => s.mapper.selectedFrame)
  let showOutlines    = useStateSelector(s => s.mapper.showOutlines)

  let [load, setLoad]     = useState(false)
  let [loaded, setLoaded] = useState(false)
  let [src, setSrc]       = useState('http://placekitten.com/100/100')

  let hovered  = props.frame === hoveredFrame
  let selected = props.frame === selectedFrame
  let scale    = hovered ? `scale-[104%]` : `scale-100`
  let bgColor  = selected ? 'bg-blue' : 'bg-transparent'

  let div = useRef<HTMLDivElement>(null)

  // set load to true when the div becomes visible
  useEffect(() => {
    if (div.current) {
      new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && !load)
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

  // load the image
  useEffect(() => {
    if (load && !loaded) {
      setTimeout(() => {
        getThumbnail(props.frame, selectedPolygon.polyid, props.nativeCoords, 'trueColour', true).then((img) => {
          setSrc(img)
          setLoaded(true)
        })
      }, 500) // hack to reduce jank - let the slider finish animating
    }
  }, [load, loaded])

  return (
    <div ref={div} className="flex-none">
      <button
        className={`custom-ring p-1.5 cursor-pointer rounded-xl ${bgColor}    `}
        onMouseEnter={() => dispatch(mapperActions.hoverFrame(props.frame))}
        onMouseLeave={() => dispatch(mapperActions.hoverFrame(undefined))}
      >
        <div
          className={`grid   transition duration-10 ease-in-out ${scale}`}
          style={{height: height, width: width}}
          onClick={() => dispatch(mapperActions.selectFrame(props.frame))}
        >
          {/* the light grey intitial background square */}
          <div className="col-span-full row-span-full flex rounded-lg bg-gray-100" style={{height: height, width: width}} >
            {/* loader (actually appears after short delay)  */}
            {!loaded && load &&
            <div className="m-auto">
              <GlobeIcon className="h-5 w-5 text-gray-400 opacity-0 animate-delayedthumbnail"/>
            </div>
            }
          </div>
          {loaded &&
          <>
          <img
            src={src}
            className="col-span-full row-span-full rounded-md animate-quickfadein"
            height="100%"
            width="100%"
            alt={`Thumbnail image for ${getDisplayDate(props.date)}`}
          />
          {showOutlines && props.outlineSvg}
          </>
          }
        </div>
      </button>

      <div className="text-center text-sm ">
        {getDisplayDate(props.date)}
      </div>

    </div>
  )
}
