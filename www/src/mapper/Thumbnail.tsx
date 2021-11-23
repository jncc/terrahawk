
import React, { useState } from 'react'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { mapperActions } from './slice'

export let Thumbnail = (props: {frame: string, load: boolean}) => {

  let dispatch = useStateDispatcher()
  let { selectedFrame, hoveredFrame } = useStateSelector(s => s.mapper )

  let [loaded, setLoaded] = useState(false)

  let hovered = props.frame === hoveredFrame
  let selected = props.frame === selectedFrame
  let borderColor = selected ? 'border-red-500' :
                    hovered ?  'border-gray-300' :
                               'border-transparent'

  return (
    <div
      key={props.frame}
      className={`border-4 w-40 p-4 cursor-pointer ${borderColor}`}
      onMouseEnter={() => dispatch(mapperActions.hoverFrame(props.frame))}
      onMouseLeave={() => dispatch(mapperActions.hoverFrame(undefined))}
      onClick={() => dispatch(mapperActions.selectFrame(props.frame))}
    >
      <div className="overflow-hidden">
        {props.frame}
      </div>
    </div>
  )
}
