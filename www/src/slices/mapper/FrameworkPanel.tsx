
import React from 'react'
import { MapIcon } from '@heroicons/react/outline'

import { frameworks } from '../../frameworks'
import { useStateSelector } from '../../state/hooks'

export let FrameworkPanel = () => {

  let query = useStateSelector(s => s.mapper.query)
  let framework = frameworks[query.framework]

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md pl-4 pr-6 py-2 my-2" >

      <div className="flex items-center space-x-3">
        <MapIcon className="h-7 w-7 text-gray-400"/>
        <div className="leading-tight">
          <div>{framework.name}</div>
          <div className="flex gap-2 items-center">
            <div className="little-label-text ">{query.framework}</div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-1 w-7 " stroke="#ff7800">
              <line x1="0" y1="3" x2="60" y2="3" strokeWidth="3" strokeDasharray="5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

    </div>
  )
}
