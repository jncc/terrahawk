
import React from 'react'
import { LocationMarkerIcon, XIcon } from '@heroicons/react/outline'
import { ExclamationIcon } from '@heroicons/react/solid'
import { useHotkeys } from 'react-hotkeys-hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useStateDispatcher, useStateSelector } from '../../state/hooks'
import { YearChart } from './YearChart'
import { Indexname, MonthStats, Poly, Query, Statistic } from './types'
import { chain, groupBy, maxBy } from 'lodash'
import { getFramesWithDate } from './helpers/frameHelpers'
import { mapperActions } from './slice'
import { ThumbnailSlider } from './ThumbnailSlider'
import { zeroPad } from '../../utility/numberUtility'
import { indexnames } from './helpers/statsHelper'
import { getIndexnameIcon } from './helpers/iconHelper'
import { Dispatch, AnyAction } from 'redux'
import { Panel } from './Panel'

export let PolygonPanel = () => {

  let dispatch = useStateDispatcher()
  let {selectedPolygon, selectedPolygonStats, query, selectedFrame} = useStateSelector(s => s.mapper)

  useHotkeys('esc', () => { dispatch(mapperActions.selectPolygon(undefined)) })

  let show = selectedPolygon

  if (!show) return null
  let showClasses = show ? `opacity-100` : `translate-x-full opacity-0`

  return (
    <Panel extraClasses={`absolute top-6 right-6 bottom-6 left-[50%] transform transition-opacity ${showClasses} px-4 py-2.5`}>
      {selectedPolygon &&
      <div className="flex flex-col h-full">
        {makeHeaderBar(dispatch, selectedPolygon)}
        {selectedPolygonStats && makeLoadedPolygonDetails(selectedPolygonStats, query, selectedFrame)}
      </div>
      }
    </Panel>
  )
}

let makeHeaderBar = (dispatch: Dispatch<AnyAction>, selectedPolygon: Poly) => {

  return (
    <div className="flex-none mb-3 pb-3 border-b-2 border-gray-300 ">
      <div className="flex items-center space-x-3">
        <LocationMarkerIcon className="h-7 w-7 text-gray-400"/>
        <div className="text-lg leading-tight">
          <div className="">{selectedPolygon.habitat}</div>
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
  )
}

let makeLoadedPolygonDetails = (selectedPolygonStats: MonthStats[], query: Query, selectedFrame: string|undefined) => {

  // todo: calculate instead, e.g. chain(Object.keys(years)).max().value()
  let mostRecentFullYear = '2020'

  let framesWithDate = getFramesWithDate(selectedPolygonStats)

  // todo: knarly....
  let filteredStats = selectedPolygonStats.filter(s => `${s.year}${s.month}` >= `${query.yearFrom}${zeroPad(query.monthFrom)}` && `${s.year}${s.month}` <= `${query.yearTo}${zeroPad(query.monthTo)}`)
  
  // group stats into years
  let statsGroupedByYears = groupBy(filteredStats, s => s.year)

  // frames displayed need to be the year of the selected frame, or else (if none selected) a sensible default
  let yearOfSelectedFrame = framesWithDate.filter(x => x.frame === selectedFrame).map(x => x.date.year.toString()).find(() => true) // ie, first()
  let yearOfFramesToUse = yearOfSelectedFrame ? yearOfSelectedFrame : mostRecentFullYear
  let oneYearOfFramesWithDate = framesWithDate.filter(x => x.date.year === Number.parseInt(yearOfFramesToUse))

  // let percentageOfMissingData = Object.entries(statsGroupedByYears)
  //   .map(([year, monthStats]) => monthStats.some(s => s.))

  return (
    <>
      <div className="flex-none mb-2">
        {makeChartTitle(selectedPolygonStats, query.indexname, query.statistic)}
      </div>
      <div className="flex-grow flex-row overflow-y-scroll mb-5 pr-3">
        {chain(Object.entries(statsGroupedByYears))
          // .orderBy(([year]) => year, ['desc'])
          .map(([year, monthStats]) =>
            <YearChart
              key={year}
              year={year}
              data={monthStats}
              framesWithDate={getFramesWithDate(monthStats)}
              statistic={query.statistic} />)
          .value()
        }
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

  return (
    <div className="flex justify-center items-center gap-3 pt-1 pb-2 text-gray-900">
      <div><FontAwesomeIcon icon={getIndexnameIcon(indexname)} className="text-gray-400" /></div>
      <div className="text-sm italic">
        Monthly {statistic} {indexnames[indexname].name} <span className="">
          ({indexnames[indexname].description})</span> compared with {maxCfCount} similar polygons
      </div>
      <div className="flex items-center gap-1 little-label-text  ">
        <div className="flex flex-col justify-between">
          <div className="flex-1 bg-gray-200 p-0.5 px-3"></div>
          <div className="flex-1 bg-gray-300 p-1"></div>
          <div className="flex-1 bg-gray-200 p-0.5"></div>
        </div>
      </div>
      <div>
        {(parseInt(maxCfCount) < 20) && 
        <ExclamationIcon className="h-6 w-6 text-[orange]"/>
        }
      </div>
    </div>
  )
}
