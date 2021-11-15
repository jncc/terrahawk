
import React from 'react'
import { SearchIcon } from '@heroicons/react/outline'

import { useStateDispatcher, useStateSelector } from '../state/hooks'

export let GazetteerPanel = () => {

  let dispatch = useStateDispatcher()
  let state = useStateSelector(s => s.mapper)

  if (state.zoomedEnoughToShowPolygons)
    return null

  return (
    <div className="z-abovemap absolute top-6 left-6 w-96 animate-delayedfadein ">
      <div className="bg-white rounded-xl overflow-hidden shadow-xl p-4 ">
        
        <div className="flex items-center justify-center">
          <input
            disabled
            type="search"
            name="search"
            placeholder="Site or place of interest"
            className="flex items-center justify-center h-9 p-2 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring">
          </input>

          <button
            disabled
            type="submit"
            className="absolute right-0 top-0 mt-6 mr-6">
            <SearchIcon className="h-5 w-5 text-gray-400  "/>
          </button>


        </div>

      </div>
    </div>
  )
}

