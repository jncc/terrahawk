
import React from 'react'
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'

import { useStateDispatcher, useStateSelector } from '../../state/hooks'
import { mapperActions } from './slice'
import { Indexname, Statistic } from './types'
import { indexnames, statistics } from './helpers/statsHelper'
import { Panel } from './Panel'
import { frameworks } from '../../frameworks'
import { MultiSelectDropdown} from '../../components/MultiSelectDropdown'

const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]
const months = [
  [1, 'Jan'], [2, 'Feb'], [3, 'Mar'], [4, 'Apr'], [5, 'May'], [6, 'Jun'], [7, 'Jul'], [8, 'Aug'], [9, 'Sep'], [10, 'Oct'], [11, 'Nov'], [12, 'Dec']
]

export let QueryPanel = () => {

  let dispatch = useStateDispatcher()
  let state = useStateSelector(s => s.mapper)

  let indices = state.currentFramework.availableIndices

  function toggleSelectedHabitat (habitatid: number) {
    dispatch(mapperActions.toggleSelectedHabitat(habitatid))
  }

  function toggleSelectAllHabitats (isSelectAll: boolean) {
    dispatch(mapperActions.toggleSelectAllHabitats(isSelectAll))
  }

  function getFrameworkHabitatsArray() {
    let frameworkHabitats = state.frameworkHabitats.get(state.currentFramework.defaultQuery.tableName)
    if (frameworkHabitats) {
      return frameworkHabitats
    }
    return []
  }

  return (
    <Panel extraClasses="relative w-56 mb-2 px-4 py-2">
      <div className="mb-0.5">
        <label htmlFor="indexname-select" className="little-label-text  mb-1">Index</label>
        <select
          name="indexname" id="indexname-select"
          defaultValue={state.query.indexname}
          onChange={e => dispatch(mapperActions.alterQueryIndexname(e.target.value as Indexname))}
          className="h-9 p-1 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring">
          {
            indices.map((name) => <option key={name} value={name}>{`${name}`} {`(${indexnames[name].description})`}</option>)
          }
        </select>
      </div>

      <div className="mb-5">
        <label htmlFor="statistic-select" className="little-label-text  mb-1">Statistic</label>
        <select
          name="statistic" id="statistic-select"
          defaultValue={state.query.statistic}
          onChange={e => dispatch(mapperActions.alterQueryStatistic(e.target.value as Statistic))}
          className="h-9 p-1 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring">
          {
            statistics.map(s => <option key={s} value={s}>{s}</option>)
          }
        </select>
      </div>

      <div className="">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-grow little-label-text  ">From</div>
          <div>
            {/* <label htmlFor="monthFrom-select" className="little-label-text  mb-1 ">Month</label> */}
            <select
              name="monthFrom" id="monthFrom-select"
              title="Month from"
              value={state.query.monthFrom}
              onChange={e => dispatch(mapperActions.alterQueryMonthFrom(Number.parseInt(e.target.value)))}
              className="h-9 p-1 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring">
              {
                months.map(m => <option key={m[0]} value={m[0]}>{m[1]}</option>)
              }
            </select>
          </div>
          <div>
            {/* <label htmlFor="yearFrom-select" className="little-label-text  mb-1 ">Year</label> */}
            <select
              name="yearFrom" id="yearFrom-select"
              title="Year from"
              value={state.query.yearFrom}
              onChange={e => dispatch(mapperActions.alterQueryYearFrom(Number.parseInt(e.target.value)))}
              className="h-9 p-1 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring">
              {
                years.map(y => <option key={y} value={y}>{y}</option>)
              }
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex-grow little-label-text  ">To</div>
          <div>
            {/* <label htmlFor="monthTo-select" className="little-label-text  mb-1 ">Month</label> */}
            <select
              name="monthTo" id="monthTo-select"
              title="Month to"
              value={state.query.monthTo}
              onChange={e => dispatch(mapperActions.alterQueryMonthTo(Number.parseInt(e.target.value)))}
              className="h-9 p-1 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring">
              {
                months.map(m => <option key={m[0]} value={m[0]}>{m[1]}</option>)
              }
            </select>
          </div>
          <div>
            {/* <label htmlFor="yearTo-select" className="little-label-text  mb-1 ">Year</label> */}
            <select
              name="yearTo" id="yearTo-select"
              title="Year to"
              value={state.query.yearTo}
              onChange={e => dispatch(mapperActions.alterQueryYearTo(Number.parseInt(e.target.value)))}
              className="h-9 p-1 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring">
              {
                years.map(y => <option key={y} value={y}>{y}</option>)
              }
            </select>
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="habitat-select" className="little-label-text  mb-1">Habitat</label> 
          <div id="habitat-select">     
            <MultiSelectDropdown
              options={getFrameworkHabitatsArray().map((x) => {return {id:x.id, title:x.habitat}})} 
              selected={state.query.habitatids} 
              toggleItemFunction={toggleSelectedHabitat}
              toggleAllFunction={toggleSelectAllHabitats}/>
          </div>
        </div>
          
{/* 
        <div className="flex justify-between items-center mb-2">
          <button
            className="arrow-button"
            title="Decrement query period by one year"
            onClick={() => dispatch(mapperActions.decrementQueryPeriodByOneMonth())}>
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          </button>
          <button
            className="arrow-button"
            title="Decrement query period by one month"
            onClick={() => dispatch(mapperActions.decrementQueryPeriodByOneMonth())}>
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <div className="flex-1 text-center little-label-text">
            Period
          </div>
          <button
            className="arrow-button"
            title="Increment query period by one month"
            onClick={() => dispatch(mapperActions.incrementQueryPeriodByOneMonth())}>
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <button
            className="arrow-button"
            title="Increment query period by one year"
            onClick={() => dispatch(mapperActions.incrementQueryPeriodByOneMonth())}>
            <ChevronDoubleRightIcon className="h-5 w-5" />
          </button>
        </div>
*/}
      </div>
    </Panel>

  )
}
