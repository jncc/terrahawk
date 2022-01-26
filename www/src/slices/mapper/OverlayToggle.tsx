
import React from 'react'
import { Toggle } from '../../components/Toggle'

export let OverlayToggle = (props: {label: string, position: 'left'|'right', checked: boolean, onChange: () => void}) => {

  return (
    <div className="inline bg-white rounded-xl overflow-hidden shadow-md px-2 py-2 my-2 mx-1">
      <Toggle
        label={props.label}
        position={props.position}
        checked={props.checked}
        onChange={props.onChange}
      />
    </div>
  )
}
