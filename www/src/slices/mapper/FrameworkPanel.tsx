
import React from 'react'
import { MapIcon } from '@heroicons/react/outline'

import { frameworks } from '../../frameworks'
import { useStateDispatcher, useStateSelector } from '../../state/hooks'
import { mapperActions } from './slice'
import { Panel } from './Panel'

export let FrameworkPanel = () => {
  let dispatch = useStateDispatcher()
  let currentFramework = useStateSelector(s => s.mapper.currentFramework)

  return (
    <Panel extraClasses="absolute bottom-4 left-6 min-w-[14rem] pl-4 pr-6 py-2 my-1">
      <div className="flex items-center space-x-3">
        <MapIcon className="h-7 w-7 text-gray-400"/>
        <div className="leading-tight">            
          <select
            name="frameworkname" id="frameworkname-select"
            defaultValue={currentFramework.defaultQuery.tableName}
            onChange={e => dispatch(mapperActions.alterQueryFramework(e.target.value))}
            className="bg-white hover:bg-gray-200 p-0.5"
            >
            {
              Object.entries(frameworks).map(([name, framework]) => <option key={name} value={name}>{`${framework.name}`}</option>)
            }
          </select>

          <div className="flex gap-2 items-center ml-1.5">
            <div className="little-label-text ">{currentFramework.defaultQuery.tableName}</div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-1 w-7 " stroke="#ff7800">
              <line x1="0" y1="3" x2="60" y2="3" strokeWidth="3" strokeDasharray="5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      
    </Panel>
  )
}
