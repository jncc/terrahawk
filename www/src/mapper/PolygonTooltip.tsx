
import React from 'react'

import { Poly } from './types'
import { roundTo3Decimals } from '../utility/numberUtility'
import { getColour } from './helpers/choroplethHelpers'

// replace the 'white' (no change) color with default text-gray-400
let getBackgroundColour = (maxZ: number) => getColour(maxZ).replace('white', 'rgba(75, 85, 99')

/// Makes raw HTML for Leaflet tooltip content
export let makePolygonTooltipHtml = (polyid: string, habitat: string, maxZ: number, stat: string) => `
  <div class="font-sans px-1 pb-1">
    <div class="flex items-center space-x-1.5">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <div class="leading-tight">
        <div class="text-base -mb-0.5">${habitat}</div>
        <div class="text-gray-400 text-sm font-semibold">Polygon ${polyid} </div>
      </div>
    </div>
    <hr class="my-2" />
    <div class="flex gap-1.5 items-center text-xs ">
      <span class="inline-flex items-center justify-center px-2 py-1 text-sm font-bold leading-none text-white bg-gray-600 rounded-full" style="background-color:${getBackgroundColour(maxZ)};">
        ${roundTo3Decimals(maxZ)}
      </span>
      max standard deviations from habitat ${stat}
    </div>
  </div>
  `

export let PolygonTooltipForDev = () => {
  let html = makePolygonTooltipHtml(
    `7654321`,
    `Trees, shrubs and stuff`,
    0.534752,
    `mean`
  )

  return <div className="m-4 border-2" dangerouslySetInnerHTML={{ __html: html}}></div>
}
