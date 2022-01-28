
import React from 'react'

import { useStateDispatcher, useStateSelector } from '../../state/hooks'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

export let ZoomButton = (props: {
    buttonType: string,
    onClick: () => void
  }) => {

  let label = 'Zoom out'
  let icon = faMinus

  if (props.buttonType === 'in') {
    label = 'Zoom in'
    icon = faPlus
  }

  return (
    <button className="inline text-xs custom-ring bg-white rounded-lg overflow-hidden shadow-md px-3 py-2 my-2 mr-1 hover:bg-gray-100"
      title={label} type="button" onClick={props.onClick} >
      <FontAwesomeIcon icon={icon} className="text-gray-600" />
    </button>
  )
}
