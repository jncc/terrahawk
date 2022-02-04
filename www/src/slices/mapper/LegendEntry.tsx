
import React from 'react'

export let LegendEntry = (props: {colour: string, opacity: number, text: string}) => {

  return (
    <div className="block mr-1">
      <svg className="inline mx-1" width={20} height={20}>
        <circle stroke="black" stroke-width="0.5"
          cx={10}
          cy={10}
          r={6}
          fill={props.colour}
          fillOpacity={props.opacity}
        />
      </svg>
      <span className="text-sm">{props.text}</span>
    </div>
  )
}
