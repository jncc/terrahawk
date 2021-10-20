import React from 'react'

import { useStateSelector } from '../state/hooks'

export let Loader = () => {

  let loading = useStateSelector(s => s.global.loading)

  if (loading.length > 0) {

    return (
      <div className="z-abovemap absolute top-0 w-full">
          <div className="slider absolute w-full h-1 overflow-x-hidden">
            <div className="line absolute opacity-5 bg-pink-600 w-full h-1"></div>
            <div className="subline absolute bg-pink-600 h-1 inc animate-increase"></div>
            <div className="subline absolute bg-pink-600 h-1 dec animate-decrease"></div>
          </div>
      </div>

    )
  } else {
    return null
  }
  
}