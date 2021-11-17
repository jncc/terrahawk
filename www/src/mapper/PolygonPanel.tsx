
import React from 'react'
import { InformationCircleIcon, LocationMarkerIcon, XIcon } from '@heroicons/react/outline'
import { ExclamationIcon } from '@heroicons/react/solid'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { YearChart } from './YearChart'
import { MonthStats } from './types'
import { maxBy } from 'lodash'
import { ThumbnailSlider } from './ThumbnailSlider'
import { getFramesFromFrameField } from './helpers/frameHelpers'
import { mapperActions } from './slice'

export let PolygonPanel = () => {

  let dispatch = useStateDispatcher()
  let {selectedPolygon, selectedPolygonStats, selectedFrame, zoomedEnoughToShowPolygons} = useStateSelector(s => s.mapper)

  if (!selectedPolygon || !zoomedEnoughToShowPolygons)
    return null
  // console.log('in PolygonPanel')
  // if (selectedPolygonStats) {
  //   console.log('total frames ' + selectedPolygonStats.flatMap(d => getFramesFromFrameField(d.frame)).length)
  //   console.log('total distinct frames ' + new Set(selectedPolygonStats.flatMap(d => getFramesFromFrameField(d.frame))).size)
  // }

  // group by year and pass in one year per chart component
  let oneYearOfData = selectedPolygonStats ? selectedPolygonStats.filter((d: any) => d.year === '2020') : undefined

  return (
    <div className="z-abovemap absolute top-6 right-6 bottom-36 text-left" >
      <div className="bg-white rounded-xl overflow-hidden shadow-xl pl-4 pr-6 py-2 w-[45rem] h-full" >
        
        <div className="flex items-center space-x-3 mb-3">
          <LocationMarkerIcon className="h-7 w-7 text-gray-400"/>
          <div className="leading-tight">
            <div>{selectedPolygon.habitat}</div>
            <div className="flex gap-2 items-center">
              <div className="little-label-text ">Polygon {selectedPolygon.polyid}</div>
            </div>
          </div>
          <div className="flex-1"></div>
          {selectedPolygonStats &&
          <div className="">
            {makeComparatorSummary(selectedPolygonStats)}
          </div>
          }
          <div className="">
            <button onClick={() => dispatch(mapperActions.selectPolygon(undefined))}>
              <XIcon className="h-7 w-7 text-gray-400"/>
            </button>
          </div>
        </div>

        {oneYearOfData &&
        <>
          <div className="mb-4">
            <YearChart year={2020} data={oneYearOfData} />
          </div>
          <div className="mb-4">
            Selected Frame: {selectedFrame}
          </div>
          <ThumbnailSlider frames={oneYearOfData.flatMap(d => getFramesFromFrameField(d.frame))} />
        </>
        }

      </div>
    </div>
  )
}

let makeComparatorSummary = (data: MonthStats[] | undefined) => {
  if (!data)
    return null

  let maxCfCount = maxBy(data, d => parseInt(d.cf_count))?.cf_count

  if (!maxCfCount)
    return null

  return (
    <div className="flex gap-1 items-center p-2 text-sm ">
      <div className="flex flex-col justify-between">
        <div className="flex-1 bg-gray-200 p-0.5 px-3"></div>
        <div className="flex-1 bg-gray-300 p-1"></div>
        <div className="flex-1 bg-gray-200 p-0.5"></div>
      </div>
      { (parseInt(maxCfCount) < 20) && 
        <ExclamationIcon className="h-6 w-6 text-[orange]"/>
      }
      {/* <span className="inline-flex items-center justify-center px-2 py-1 text-sm font-bold leading-none text-white bg-gray-400 rounded-full" > */}
        <span>{maxCfCount} </span>
      {/* </span> */}
      comparators
      {/* <InformationCircleIcon className="h-5 w-5 text-gray-400"/> */}
    </div>
  )
}