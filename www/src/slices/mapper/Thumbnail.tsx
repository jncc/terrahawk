
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { GlobeIcon } from '@heroicons/react/outline'
import { fromIntersection } from 'rxjs-web-observers'
import { debounceTime, tap, mergeMap, filter, } from 'rxjs/operators'

import { useStateDispatcher, useStateSelector } from '../../state/hooks'
import { ThumbnailGenerator } from '../../thumbnails/thumbnailGenerator'
import { getDisplayDate } from './helpers/dateHelper'
import { mapperActions } from './slice'
import { Indexname, Poly, SimpleDate } from './types'
import { height, width, getThumbnailTypeArgument } from './helpers/thumbnailHelper'
import { getCacheItem , setCacheItem } from './helpers/cacheHelper'
import { RootState } from '../../state/store'

const ARD_URL_BASE = 'https://dap.ceda.ac.uk/neodc/sentinel_ard/data'
const INDICES_URL_BASE = 'https://dap.ceda.ac.uk/neodc/sentinel_ard/indices'
const API_URL_BASE = 'https://xnqk0s6yzh.execute-api.eu-west-2.amazonaws.com'

export let Thumb = (props: {
  frame:        string,
  date:         SimpleDate,
  nativeCoords: number[][][][],
  outlineSvg:   ReactElement
  indexname:    Indexname,
  thumbType:    RootState['mapper']['thumbType'],
  platform:     RootState['mapper']['platform']
  }) => {

  let dispatch = useStateDispatcher()
  let selectedPolygon  = useStateSelector(s => s.mapper.selectedPolygon) as Poly // can't be undefined down here
  let hoveredFrame     = useStateSelector(s => s.mapper.hoveredFrame)
  let selectedFrame    = useStateSelector(s => s.mapper.selectedFrame)
  let showOutlines     = useStateSelector(s => s.mapper.showOutlines)
  let useProxy         = useStateSelector(s => s.mapper.useProxy)
  let currentFramework = useStateSelector(s => s.mapper.currentFramework)
  // let thumbType       = useStateSelector(s => s.mapper.thumbType)
  // let indexname       = useStateSelector(s => s.mapper.query.indexname)

  let thumbnailGenerator = new ThumbnailGenerator(ARD_URL_BASE, INDICES_URL_BASE)

  let [load, setLoad]         = useState(false)
  let [loaded, setLoaded]     = useState(false)
  let [src, setSrc]           = useState('')

  let hovered  = props.frame === hoveredFrame
  let selected = props.frame === selectedFrame
  let hoveredScale   = hovered  ? `scale-[104%]` : `scale-100`
  let selectedColor  = selected ? 'border-blue'  : 'border-transparent'

  let div = useRef<HTMLDivElement>(null)

  let thumbnailType = getThumbnailTypeArgument(props.thumbType, props.indexname, props.platform)

  // set load to true when the div becomes visible
  useEffect(() => {
    if (div.current) {
      fromIntersection(div.current).pipe(
        mergeMap(entries => entries),
        debounceTime(500), // disregard briefly to allow slider to move
        filter(entry => entry.isIntersecting),
        tap(() => setLoad(true)),
      ).subscribe()
    }
  }, [div.current])

  // on first mount, if this is the selected thumb, scroll to it with no animation
  useEffect(() => {
    if (selected && div.current) {
      div.current.scrollIntoView({inline: 'center'})
    }
  }, [])

  // when this thumb is selected, scroll to it
  useEffect(() => {
    if (selected && div.current) {
      div.current.scrollIntoView({behavior: 'smooth', inline: 'center'})
    }
  }, [selected])

  // load the image when necessary
  useEffect(() => {

    if (load && !loaded) {
      let bbox = ThumbnailGenerator.getBoundingBoxWithBuffer(props.nativeCoords, 0.05)
      if (useProxy) {
        let url = `${API_URL_BASE}/thumb?framename=${props.frame}&framework=${currentFramework.defaultQuery.tableName}&thumbType=${thumbnailType}&bbox=${JSON.stringify(bbox)}`
        setSrc(url)
      } else {
        getThumbnailWithCache(props.frame, selectedPolygon.polyid, bbox, thumbnailType).then((imgSrc) => setSrc(imgSrc))
      } 
    }

  }, [load, loaded])

  useEffect(() => {}, [props.indexname, props.thumbType])

  return (
    <div ref={div} className="flex-none">
      {/* the button (so the thumb can be selected), padded to leave the background color visible when selected */}
      <button
        className={`custom-ring p-1 cursor-pointer rounded-xl border-4 ${selectedColor}`}
        onMouseEnter={() => dispatch(mapperActions.hoverFrame(props.frame))}
        onMouseLeave={() => dispatch(mapperActions.hoverFrame(undefined))}
        onClick={() => dispatch(mapperActions.selectFrame(props.frame))}
      >
        {/* a container grid to enable overlaying children directly on top of each other (with `col-span-full row-span-full`) */}
        <div
          className={`grid  transition duration-10 ease-in-out ${hoveredScale}`}
          style={{height: height, width: width}}
          >
          {/* the light grey intitial background square */}
          <div className="col-span-full row-span-full flex rounded-lg bg-gray-100" >
            {/* loader (appears after short delay thanks to animation) */}
            {!loaded && load &&
            <div className="m-auto">
              <GlobeIcon className="h-5 w-5 text-gray-400 opacity-0 animate-delayedthumbnail"/>
            </div>
            }
          </div>
          {/* the generated image might not be exactly square, so use a sized container div and make the img `w-full h-full` */}
          <div
            className="col-span-full row-span-full animate-quickfadein"
            style={{height: height, width: width, display: loaded? 'block' : 'none'}}
          >
            <img
              src={src}
              className="w-full h-full rounded-md"
              alt={`Thumbnail image for ${getDisplayDate(props.date)}`}
              onLoad={() => {
                setLoaded(true)
              }}
            />

          </div>
          {loaded && showOutlines && props.outlineSvg}
        </div>
      </button>

      <div className="text-center text-sm">
        {getDisplayDate(props.date)}
      </div>

    </div>
  )

  async function getThumbnailWithCache(frameId: string, polygonId: string, box: number[], thumbnailType: string) {
    let thumbnailString = ''
  
    let thumbnailKey = `thumbs_${frameId}_${polygonId}_${thumbnailType}`
    let cachedValue = getCacheItem(thumbnailKey)
    if (cachedValue && cachedValue != null) {
      thumbnailString = cachedValue
    } else {
      let canvas = await thumbnailGenerator.getThumbnail(frameId, box, thumbnailType)
      thumbnailString = canvas.toDataURL('image/png')
      setCacheItem(thumbnailKey, thumbnailString)
    }
  
    return thumbnailString
  }
}