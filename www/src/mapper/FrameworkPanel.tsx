
import React from 'react'
import { MapIcon } from '@heroicons/react/outline'

import { frameworks } from '../frameworks'
import { useStateDispatcher, useStateSelector } from '../state/hooks'

export let FrameworkPanel = () => {

  let dispatch = useStateDispatcher()
  let query = useStateSelector(s => s.mapper.query)

  let framework = frameworks[query.framework]

  return (
    <button className="z-abovemap absolute bottom-6 left-6 animate-delayedfadein text-left" >
      <div className="bg-white rounded-xl overflow-hidden shadow-xl pl-4 pr-6 py-2" >

        <div className="flex items-center space-x-3">
          <MapIcon className="h-7 w-7 text-gray-400"/>
          <div className="leading-tight">
            <div className="">{framework.name}</div>
            <div className="flex gap-2 items-center">
              <div className="text-gray-400 text-sm font-semibold">{query.framework} </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-1 w-12 " stroke="#ff7800">
                <line x1="0" y1="3" x2="60" y2="3" strokeWidth="3" strokeDasharray="5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </button>
  )
}
