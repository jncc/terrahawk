
import React from 'react'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { mapperActions } from './slice'
import { Indexname } from './types'

const indexnames = ['EVI' , 'NBR' , 'NDMI' , 'NDVI' , 'NDWI']

export let QueryPanel = () => {

  let dispatch = useStateDispatcher()
  let state = useStateSelector(s => s.mapper)

  return (
    <div className="z-abovemap absolute top-6 left-6 w-56 animate-delayedfadein ">
      <div className="bg-white rounded-xl overflow-hidden shadow-xl p-5">

        <div>
          <label htmlFor="indexname-select" className="sr-only">Choose an index</label>
          <select
            name="indexname" id="indexname-select"
            defaultValue={state.query.indexname}
            onChange={e => dispatch(mapperActions.alterQueryIndexname(e.target.value as Indexname))}
            className="h-9 p-1 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring mb-5">
            {
              indexnames.map(ix => <option key={ix} value={ix}>{ix}</option>)
            }
          </select>
        </div>

        <div>
        </div>

      </div>
    </div>
  )
}
