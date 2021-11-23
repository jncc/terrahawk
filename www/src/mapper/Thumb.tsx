
import React, { useEffect, useRef, useState } from 'react'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { getDisplayDate } from './helpers/dateHelper'
import { mapperActions } from './slice'
import { SimpleDate } from './types'

export let Thumb = (props: {frame: string, date: SimpleDate}) => {

  let dispatch = useStateDispatcher()
  let {selectedFrame, hoveredFrame} = useStateSelector(s => s.mapper)

  let [load, setLoad] = useState(false)

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

  return (
    <div
      ref={div}
      key={props.frame}
      className="flex-none rounded-xl pb-0.5"
      onMouseEnter={() => dispatch(mapperActions.hoverFrame(props.frame))}
      onMouseLeave={() => dispatch(mapperActions.hoverFrame(undefined))}
    >
      <button
        className={`custom-ring p-1.5 cursor-pointer rounded-xl mb-0.5 ${bgColor}`}
        tabIndex={0}
        onClick={() => dispatch(mapperActions.selectFrame(props.frame))}
      >
        <img
          src="http://placekitten.com/100/100"
          height={100}
          width={100}
          className="rounded-lg"
        />
      </button>

      <div className="text-center text-xs ">
        {getDisplayDate(props.date)}
        {/* {load ? '🍔' : ''} */}
      </div>

    </div>
  )
}
