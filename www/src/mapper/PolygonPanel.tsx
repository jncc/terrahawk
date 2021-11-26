
import React from 'react'
import { LocationMarkerIcon, XIcon } from '@heroicons/react/outline'
import { ExclamationIcon } from '@heroicons/react/solid'
import { useHotkeys } from 'react-hotkeys-hook'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { YearChart } from './YearChart'
import { MonthStats, Statistic } from './types'
import { maxBy } from 'lodash'
import { getFramesWithDate } from './helpers/frameHelpers'
import { mapperActions } from './slice'
import { ThumbnailSlider } from './ThumbnailSlider'

export let PolygonPanel = () => {

  let dispatch = useStateDispatcher()
  let {selectedPolygon, selectedPolygonStats, zoomedEnoughToShowPolygons, query} = useStateSelector(s => s.mapper)

  useHotkeys('esc', () => { dispatch(mapperActions.selectPolygon(undefined)) })

  let show = selectedPolygon && zoomedEnoughToShowPolygons

  if (!show) return null
  let showClasses = show ? `opacity-100` : `translate-x-full opacity-0`

  return (
    <div className={`z-abovemap absolute top-6 right-6 bottom-6 left-[33rem] 2xl:left-[60rem] transform transition-opacity ${showClasses}`}>
      <div className="w-full h-full bg-white rounded-xl shadow-xl px-4 py-2.5 " >
        
        {selectedPolygon && zoomedEnoughToShowPolygons &&
        <div className="flex flex-col h-full">

          <div className="flex-none">
            <div className="flex items-center space-x-3 mb-3">
              <LocationMarkerIcon className="h-7 w-7 text-gray-400"/>
              <div className="leading-tight">
                <div>{selectedPolygon.habitat}</div>
                <div className="flex gap-2 items-center">
                  <div className="little-label-text ">Polygon {selectedPolygon.polyid}</div>
                </div>
              </div>
              <div className="flex-1"></div>
              <div>
                {makeComparatorSummary(selectedPolygonStats)}
              </div>
              <div className="flex items-center pr-1">
                <button
                  className="close-button"
                  onClick={() => dispatch(mapperActions.selectPolygon(undefined))}>
                  <XIcon className="h-7 w-7"/>
                </button>
              </div>
            </div>
          </div>
          {selectedPolygonStats && makeLoadedPolygonDetails(selectedPolygonStats, query.statistic)}

        </div>
        }

      </div>
    </div>
  )
}

let makeLoadedPolygonDetails = (stats: MonthStats[], statistic: Statistic) => {

  // TODO: group by year and pass in one year per chart component...

  let framesWithDate = getFramesWithDate(stats)
  let mostRecentYear = 2020 //last(framesWithDate).date.year
  let oneYearOfStats = stats.filter(d => d.year === mostRecentYear.toString())
  let oneYearOfFramesWithDate = framesWithDate.filter(x => x.date.year === mostRecentYear)

  return (
    <>
      <div className="flex-grow flex-row overflow-y-scroll mb-5">
        <YearChart year={mostRecentYear} data={oneYearOfStats} framesWithDate={oneYearOfFramesWithDate} statistic={statistic} />
        <YearChart year={mostRecentYear} data={oneYearOfStats} framesWithDate={oneYearOfFramesWithDate} statistic={statistic} />
        <YearChart year={mostRecentYear} data={oneYearOfStats} framesWithDate={oneYearOfFramesWithDate} statistic={statistic} />
        <YearChart year={mostRecentYear} data={oneYearOfStats} framesWithDate={oneYearOfFramesWithDate} statistic={statistic} />
        <YearChart year={mostRecentYear} data={oneYearOfStats} framesWithDate={oneYearOfFramesWithDate} statistic={statistic} />
      </div>
      <div className="flex-none">
        <ThumbnailSlider framesWithDate={oneYearOfFramesWithDate} />
      </div>
    </>
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