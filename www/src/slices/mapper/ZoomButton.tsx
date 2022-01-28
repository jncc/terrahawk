
import React from 'react'

import { useStateDispatcher, useStateSelector } from '../../state/hooks'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

export let ZoomButton = (props: {
  buttonType: string,
  onClick: () => void
  }) => {

  let dispatch = useStateDispatcher()
  let state = useStateSelector(s => s.mapper)

  let label = "Zoom out"
  let icon = faMinus

  if (props.buttonType === "in") {
    label = "Zoom in"
    icon = faPlus
  }

  return (
    <button className="inline bg-white rounded-xl overflow-hidden shadow-md px-3 py-2 my-2 mr-1 hover:bg-gray-100"
      aria-label={label} type="button" onClick={props.onClick}>
      <FontAwesomeIcon icon={icon} className="text-gray-400" />
    </button>
  )
}
