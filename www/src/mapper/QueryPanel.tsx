
import React from 'react'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { mapperActions } from './slice'
import { Indexname, Statistic } from './types'

const indexnames = ['EVI' , 'NBR' , 'NDMI' , 'NDVI' , 'NDWI']
const statistics = ['mean' , 'median' , 'min' , 'max' , 'Q1' , 'Q3']
const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021]
const months = [[1, 'Jan'], [2, 'Feb'], [3, 'Mar'], [4, 'Apr'], [5, 'May'], [6, 'Jun'], [7, 'Jul'], [8, 'Aug'], [9, 'Sep'], [10, 'Oct'], [11, 'Nov'], [12, 'Dec']]


export let QueryPanel = () => {

  let dispatch = useStateDispatcher()
  let state = useStateSelector(s => s.mapper)

  return (
    <div className="z-abovemap absolute top-6 left-6 w-56 animate-delayedfadein ">
      <div className="bg-white rounded-xl overflow-hidden shadow-xl px-4 py-2">

        <div className="mb-0.5">
          <label htmlFor="indexname-select" className="text-gray-400 text-sm font-semibold mb-1">Index</label>
          <select
            name="indexname" id="indexname-select"
            defaultValue={state.query.indexname}
            onChange={e => dispatch(mapperActions.alterQueryIndexname(e.target.value as Indexname))}
            className="h-9 p-1 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring">
            {
              indexnames.map(ix => <option key={ix} value={ix}>{ix}</option>)
            }
          </select>
        </div>

        <div className="mb-0.5">
          <label htmlFor="statistic-select" className="text-gray-400 text-sm font-semibold mb-1">Statistic</label>
          <select
            name="statistic" id="statistic-select"
            defaultValue={state.query.statistic}
            onChange={e => dispatch(mapperActions.alterQueryStatistic(e.target.value as Statistic))}
            className="h-9 p-1 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring mb-5">
            {
              statistics.map(s => <option key={s} value={s}>{s}</option>)
            }
          </select>
        </div>

        <div className="mb-2">
          {/* <label htmlFor="statistic-select" className="text-gray-400 text-sm font-semibold mb-1 ">Statistic</label> */}
          <select
            name="yearFrom" id="yearFrom-select"
            defaultValue={state.query.yearFrom}
            onChange={e => dispatch(mapperActions.alterQueryYearFrom(Number.parseInt(e.target.value)))}
            className="h-9 p-1 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring mb-5">
            {
              years.map(y => <option key={y} value={y}>{y}</option>)
            }
          </select>
        </div>
        <div className="mb-2">
          {/* <label htmlFor="statistic-select" className="text-gray-400 text-sm font-semibold mb-1 ">Statistic</label> */}
          <select
            name="monthFrom" id="monthFrom-select"
            defaultValue={state.query.monthFrom}
            onChange={e => dispatch(mapperActions.alterQueryMonthFrom(Number.parseInt(e.target.value)))}
            className="h-9 p-1 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring mb-5">
            {
              months.map(m => <option key={m[0]} value={m[0]}>{m[1]}</option>)
            }
          </select>
        </div>

      </div>
    </div>
  )
}
