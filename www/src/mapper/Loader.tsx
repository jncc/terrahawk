import React from 'react'

import { useStateSelector } from '../state/hooks'

export let Loader = () => {

  let loading = useStateSelector(s => s.global.loading)

  if (loading.length > 0) {

    return (
      <div className="z-abovemap absolute top-0 w-full h-3px">
        {/* https://codepen.io/shalimano/pen/wBmNGJ */}
        <div className="absolute overflow-x-hidden w-full h-loader bg-gray-400 bg-opacity-40">
          <div className="absolute h-3px"></div>
          <div className="absolute bg-gray-400 h-loader animate-increase rounded-sm "></div>
          <div className="absolute bg-gray-400 h-loader animate-decrease rounded-sm "></div>
        </div>
      </div>
    )
  } else {
    return null
  }
}
