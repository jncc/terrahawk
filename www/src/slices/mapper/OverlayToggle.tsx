
import React from 'react'
import { Toggle } from '../../components/Toggle'

export let OverlayToggle = (props: {label: string, position: 'left'|'right', checked: boolean, onChange: () => void}) => {

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md px-2 py-1 my-2">
      <Toggle
        label={props.label}
        position={props.position}
        checked={props.checked}
        onChange={props.onChange}
      />
    </div>
  )
}
