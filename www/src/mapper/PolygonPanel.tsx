
import React from 'react'
import { LocationMarkerIcon } from '@heroicons/react/outline'

import { useStateSelector } from '../state/hooks'

export let PolygonPanel = () => {

  let polygon = useStateSelector(s => s.mapper.selectedPolygon)
  let data = useStateSelector(s => s.mapper.selectedPolygonData)
  console.log(data)

  return (
    <a className="z-abovemap absolute top-6 right-6 animate-delayedfadein text-left" >
      <div className="bg-white rounded-xl overflow-hidden shadow-xl pl-4 pr-6 py-2" >

        <div className="flex items-center space-x-3 w-[32rem] h-[28rem]">
          <LocationMarkerIcon className="h-7 w-7 text-gray-400"/>
          <div>
            {polygon?.polyid}
          </div>
          <div>
            {/* {JSON.parse(data)} */}
          </div>
        </div>

      </div>
    </a>
  )
}
