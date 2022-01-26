
import React from 'react'

import { useStateDispatcher, useStateSelector } from '../../state/hooks'
import { mapperActions } from './slice'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

export let ZoomButton = (props: {
  buttonType: string
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
    <div className="inline bg-white rounded-xl overflow-hidden shadow-md px-3 py-2 my-2 mr-1">
      <button className="btn btn-light" aria-label={label} type="button">
        <FontAwesomeIcon icon={icon} className="text-gray-400" />
      </button>
    </div>
  )
}
