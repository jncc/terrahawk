
import React from 'react'
import { LocationMarkerIcon, XIcon } from '@heroicons/react/outline'
import { ExclamationIcon } from '@heroicons/react/solid'
import { useHotkeys } from 'react-hotkeys-hook'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { YearChart } from './YearChart'
import { Indexname, MonthStats, Poly, Query, Statistic } from './types'
import { groupBy, maxBy } from 'lodash'
import { getFramesWithDate } from './helpers/frameHelpers'
import { mapperActions } from './slice'
import { ThumbnailSlider } from './ThumbnailSlider'
import { zeroPad } from '../utility/numberUtility'
import { indexnames } from './helpers/statsHelper'

export let PolygonPanel = () => {

  let dispatch = useStateDispatcher()
  let {selectedPolygon, selectedPolygonStats, zoomedEnoughToShowPolygons, query, selectedFrame} = useStateSelector(s => s.mapper)

  useHotkeys('esc', () => { dispatch(mapperActions.selectPolygon(undefined)) })

  let show = selectedPolygon && zoomedEnoughToShowPolygons

  if (!show) return null
  let showClasses = show ? `opacity-100` : `translate-x-full opacity-0`

  return (
    <div className={`z-abovemap absolute top-6 right-6 bottom-6 left-[50%] transform transition-opacity ${showClasses}`}>
      <div className="w-full h-full bg-white rounded-xl shadow-xl px-4 py-2.5">
        
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
              <div className="flex items-center pr-1">
                <button
                  className="close-button"
                  onClick={() => dispatch(mapperActions.selectPolygon(undefined))}>
                  <XIcon className="h-7 w-7"/>
                </button>
              </div>
            </div>
          </div>

          {selectedPolygonStats && makeLoadedPolygonDetails(selectedPolygon, selectedPolygonStats, query, selectedFrame)}

        </div>
        }

      </div>
    </div>
  )
}

let makeLoadedPolygonDetails = (selectedPolygon: Poly, selectedPolygonStats: MonthStats[], query: Query, selectedFrame: string|undefined) => {

  let mostRecentFullYear = 2020 // todo: calculate instead
  // let selectedPolygon = useStateSelector(s => s.mapper.selectedPolygon) as Poly
  // let selectedPolygonStats = useStateSelector(s => s.mapper.selectedPolygonStats) as MonthStats[]
  // let selectedFrame = useStateSelector(s => s.mapper.selectedFrame)
  // let {query} = useStateSelector(s => s.mapper)

  let framesWithDate = getFramesWithDate(selectedPolygonStats)

  // lovely...
  let filteredStats = selectedPolygonStats.filter(s => `${s.year}${s.month}` >= `${query.yearFrom}${zeroPad(query.monthFrom)}` && `${s.year}${s.month}` <= `${query.yearTo}${zeroPad(query.monthTo)}`)

  let yearOfSelectedFrame = framesWithDate.filter(x => x.frame === selectedFrame).map(x => x.date.year).find(() => true) // ie, first()
  let yearGroups = groupBy(filteredStats, s => s.year)
  // let yearOfThumbs = 

  let oneYearOfStats = selectedPolygonStats.filter(d => d.year === mostRecentFullYear.toString())
  let oneYearOfFramesWithDate = framesWithDate.filter(x => x.date.year === mostRecentFullYear)

  return (
    <>
      <div className="flex-none ">
        {makeChartTitle(selectedPolygonStats, query.indexname, query.statistic)}
      </div>
      <div className="flex-grow flex-row overflow-y-scroll mb-5">
        <YearChart year={mostRecentFullYear} data={oneYearOfStats} framesWithDate={oneYearOfFramesWithDate} statistic={query.statistic} />
        <YearChart year={mostRecentFullYear} data={oneYearOfStats} framesWithDate={oneYearOfFramesWithDate} statistic={query.statistic} />
        <YearChart year={mostRecentFullYear} data={oneYearOfStats} framesWithDate={oneYearOfFramesWithDate} statistic={query.statistic} />
        <YearChart year={mostRecentFullYear} data={oneYearOfStats} framesWithDate={oneYearOfFramesWithDate} statistic={query.statistic} />
        <YearChart year={mostRecentFullYear} data={oneYearOfStats} framesWithDate={oneYearOfFramesWithDate} statistic={query.statistic} />
      </div>
      <div className="flex-none">
        <ThumbnailSlider framesWithDate={oneYearOfFramesWithDate} />
      </div>
    </>
  )
}

let makeChartTitle = (data: MonthStats[] | undefined, indexname: Indexname, statistic: Statistic) => {
  if (!data)
    return null

  let maxCfCount = maxBy(data, d => parseInt(d.cf_count))?.cf_count

  if (!maxCfCount)
    return null

  let indexnameInfo = indexnames.find(x => x[0] === indexname)

  return (
    <div className="flex justify-center items-center gap-4 pb-2 ">
      <div className="italic">
        Monthly {statistic} {indexname} (<span className="text-sm">{indexnameInfo?.[2]} {indexnameInfo?.[1]} </span>)
      </div>
      <div>
        •
      </div>
      <div className="flex items-center gap-1 little-label-text  ">
        <div className="flex flex-col justify-between">
          <div className="flex-1 bg-gray-200 p-0.5 px-3"></div>
          <div className="flex-1 bg-gray-300 p-1"></div>
          <div className="flex-1 bg-gray-200 p-0.5"></div>
        </div>
        <div>
          {maxCfCount} comparators
        </div>
        {(parseInt(maxCfCount) < 20) && 
        <ExclamationIcon className="h-6 w-6 text-[orange]"/>
        }
      </div>
    </div>
  )
}