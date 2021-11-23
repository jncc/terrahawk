
import React from 'react'

import { SimpleDate } from './types'
import { Thumb } from './Thumb'

export let ThumbSlider = (props: {framesWithDate: {frame: string, date: SimpleDate}[]}) => {

  return (
    <div className="flex overflow-y-auto gap-0.5 pb-2 p-1">
      {props.framesWithDate.map(x => <Thumb key={x.frame} frame={x.frame} date={x.date} />)}
    </div>
  )
}
