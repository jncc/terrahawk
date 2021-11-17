
import React from 'react'
import { MapIcon } from '@heroicons/react/outline'

import { frameworks } from '../frameworks'
import { useStateSelector } from '../state/hooks'

export let ThumbnailPanel = () => {

  let query = useStateSelector(s => s.mapper.query)

  return (
    <div className="z-abovemap absolute bottom-6 left-6 right-6 animate-delayedfadein text-left" >
      <div className="bg-white rounded-xl overflow-hidden shadow-xl pl-4 pr-6 py-2" >

        <div className="h-20">
          
        </div>

      </div>
    </div>
  )
}
