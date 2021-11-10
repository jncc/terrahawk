
import React from 'react'
import { InformationCircleIcon, LocationMarkerIcon } from '@heroicons/react/outline'
import { ExclamationIcon } from '@heroicons/react/solid'

import { useStateSelector } from '../state/hooks'
import { YearChart } from './YearChart'
import { MonthStats } from './types'
import { maxBy } from 'lodash'

export let PolygonPanel = () => {

  let polygon = useStateSelector(s => s.mapper.selectedPolygon)
  let data = useStateSelector(s => s.mapper.selectedPolygonData)

  // group by year and pass in one year per chart component
  let oneYearOfData = data ? data.filter((d: any) => d.year === '2020') : undefined

  return (
    <a className="z-abovemap absolute top-6 right-6 bottom-32  animate-delayedfadein text-left" >
      <div className="bg-white rounded-xl overflow-hidden shadow-xl pl-4 pr-6 py-2 w-[40rem] h-full" >

        {polygon &&
          <>
            <div className="flex items-center space-x-3 mb-3">
              <LocationMarkerIcon className="h-7 w-7 text-gray-400"/>
              <div className="leading-tight">
                <div>{polygon.habitat}</div>
                <div className="flex gap-2 items-center">
                  <div className="little-label-text ">Polygon {polygon.polyid}</div>
                </div>
              </div>
              <div className="flex-1"></div>
              <div className="">
                {makeComparatorSummary(data)}
              </div>
            </div>
          </>
        }

        {oneYearOfData &&
          <YearChart year={2020} data={oneYearOfData} />
        }
      </div>
    </a>
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