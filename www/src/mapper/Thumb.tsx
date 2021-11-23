
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

  // set load to true if the div becomes visible
  useEffect(() => {
    if (div.current) {
      setTimeout(() => {
        if (div.current) {
          new IntersectionObserver((entries) => {
            entries.forEach(e => {
              if (e.isIntersecting) {
                setLoad(true)
              }
            })
          }).observe(div.current)
        }
      }, 300)
    }
  }, [div.current])

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
      tabIndex={0}
      className={`flex-none custom-ring p-1.5 cursor-pointer rounded-xl ${bgColor}`}
      onMouseEnter={() => dispatch(mapperActions.hoverFrame(props.frame))}
      onMouseLeave={() => dispatch(mapperActions.hoverFrame(undefined))}
      onClick={() => dispatch(mapperActions.selectFrame(props.frame))}
    >
      <img src="http://placekitten.com/100/100" height={100} width={100}
        className="rounded-lg"
      />
      <div>
        {getDisplayDate(props.date)}
      {load ? 'load' : ''}
      </div>
    </div>
  )
}
