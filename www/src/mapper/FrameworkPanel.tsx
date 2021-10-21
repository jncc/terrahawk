
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
      <div className="bg-white rounded-xl overflow-hidden shadow-xl px-4 py-2 " >
        <div className="flex items-center space-x-2.5">
          {/* {makeMapIcon()} */}
          <MapIcon className="h-7 w-7 text-gray-400"/>
          <div className="leading-tight">
            <div className="mr-3">{framework.name}</div>
            <div className="text-gray-400 text-sm font-semibold">{query.framework} </div>
          </div>
        </div>
      </div>
    </button>
  )
}

let makeMapIcon = () =>
  <svg xmlns="http://www.w3.org/2000/svg" className="block h-6 w-6 text-gray-400 mr-2 mb-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
