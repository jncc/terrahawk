
import React from 'react'

import { useStateDispatcher, useStateSelector } from '../../state/hooks'
import { mapperActions } from './slice'

export let ControlsPanel = () => {

  let dispatch = useStateDispatcher()
  let state = useStateSelector(s => s.mapper)

  return (
    <div className="z-abovemap absolute bottom-6 right-6 animate-delayedfadein ">
      <div className="bg-white rounded-xl overflow-hidden shadow-xl px-4 py-3 ring-red-500">

        {/* https://medium.com/front-end-weekly/build-a-css-only-toggle-switch-using-tailwindcss-d2739882934         */}
        <label className="cursor-pointer text-sm relative flex justify-between items-center group p-2 ">
          Polygons
          <input
            type="checkbox"
            checked={state.showPolygons && state.zoomedEnoughToShowPolygons}
            onChange={() => dispatch(mapperActions.togglePolygons())}
            className="custom-ring cursor-pointer absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
          <span className="cursor-pointer w-8 h-5 flex items-center flex-shrink-0 ml-2 p-0.5 bg-gray-300 rounded-full duration-100 ease-in-out peer-checked:bg-gray-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-100 peer-checked:after:translate-x-3"></span>
        </label>

      </div>
    </div>
  )
}
