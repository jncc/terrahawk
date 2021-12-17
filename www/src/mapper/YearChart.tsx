
import React from 'react'
import { VictoryChart, VictoryAxis, VictoryScatter, VictoryLine, VictoryArea, VictoryLabel  } from 'victory'
import useDimensions from 'use-element-dimensions'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { getStatValues } from './helpers/statsHelper'
import { mapperActions } from './slice'

import { MonthStats, SimpleDate, Statistic, StatValues } from './types'
import { getDayOfYear } from '../utility/dateUtility'

export let YearChart = (props: {year: string, data: MonthStats[], framesWithDate: {frame: string, date: SimpleDate}[], statistic: Statistic}) => {

  // victory chart does not automatically fill the width of its container, so
  // we need to measure it https://github.com/FormidableLabs/victory/issues/396
  let [{width}, ref] = useDimensions()

  let polygonLineData = monthlyTicks.map(({value, label}) => {
    let dataForInterval = props.data.find(d => d.month === value)
    return {
      x: label,
      y: dataForInterval ? getStatValues(props.statistic, dataForInterval).value : null,
      z_score : dataForInterval ? getStatValues(props.statistic, dataForInterval).z_score: null,
    }
  })

  let getComparisionAreaData = (lo: (s: StatValues) => number, hi: (s: StatValues) => number) => {
      return monthlyTicks.map(({value, label}) => {
      let dataForInterval = props.data.find(d => d.month === value)
      return {
        x:  label,
        y0: dataForInterval ? lo(getStatValues(props.statistic, dataForInterval)) : null,
        y:  dataForInterval ? hi(getStatValues(props.statistic, dataForInterval)) : null,
      }
    })
  }

  let frameScatterData = props.framesWithDate.map((pair) => {
    let day = getDayOfYear(pair.date.year, pair.date.month, pair.date.day)
    return {
      x: day,
      y: 5,
      frame: pair.frame
    }
  })

  let yellowComparisonData = getComparisionAreaData(s => s.cf_value - (s.cf_value_sd * 2), s => s.cf_value + (s.cf_value_sd * 2))
  let redComparisonData    = getComparisionAreaData(s => s.cf_value - (s.cf_value_sd * 1), s => s.cf_value + (s.cf_value_sd * 1))

  return (
    <div ref={ref} className="max-w-4xl m-auto px-2 mb-4 border-2 border-gray-300 rounded-xl p-3">

      <div className="">
        <VictoryChart width={width} height={16} padding={{left: 20, right: 10}} domainPadding={{x: 5, y: 5}} 
          domain={{x: [1, 366]}}
        >
          <VictoryScatter
            style={{data: {fill: '#666'}}}
            data={frameScatterData}
            dataComponent={<DateScatterPoint />}          
          />
          <VictoryAxis
            style={{axis: {stroke: 'transparent'}}}
          />
        </VictoryChart>
      </div>

      <div className="h-32">
        <VictoryChart width={width} height={128} padding={{left: 40, right: 35, bottom:30, top: 5}} domainPadding={{x: 5, y: 5}}  >
          <VictoryArea
            animate={{ duration: 300, easing: 'sinOut'}}
            data={yellowComparisonData}
            style={{data: {fill:'#eee'}}}
            interpolation="natural"
            />
          <VictoryArea
            animate={{ duration: 300, easing: 'sinOut'}}
            data={redComparisonData}
            style={{data: {fill:'#ddd'}}}
            interpolation="natural"
            />
          <VictoryLine
            animate={{ duration: 300, easing: 'sinOut'}}
            style={{ data: {stroke: '#666'}}}
            interpolation="linear"
            data={polygonLineData}
          />
          <VictoryScatter
            animate={{ duration: 300, easing: 'sinOut'}}
            style={{data: {fill: ({datum}) => getPointStyleForZScore(datum.z_score).color}}}
            data={polygonLineData}
            size={({ datum }) => getPointStyleForZScore(datum.z_score).size}
          />
          <VictoryAxis
            style={{axis: {stroke: 'transparent'}}} 
            orientation="bottom"
          />
          <VictoryAxis
            dependentAxis
            style={{axis: {stroke: 'transparent'}}}
          />
          <VictoryLabel text={props.year} x={width / 2} y={10} textAnchor="middle" style={{fontSize: '14', fill: ''}}  />
        </VictoryChart>

      </div>
    </div>
  )
}

let monthlyTicks = [
  {value: '01', label: 'Jan'},
  {value: '02', label: 'Feb'},
  {value: '03', label: 'Mar'},
  {value: '04', label: 'Apr'},
  {value: '05', label: 'May'},
  {value: '06', label: 'Jun'},
  {value: '07', label: 'Jul'},
  {value: '08', label: 'Aug'},
  {value: '09', label: 'Sep'},
  {value: '10', label: 'Oct'},
  {value: '11', label: 'Nov'},
  {value: '12', label: 'Dec'},
]

let getPointStyleForZScore = (zScore: number) => {
  let z = Math.abs(zScore)
  return z > 2 ? {size: 6, color: '#D53F8C'} :
         z > 1 ? {size: 5, color: '#D69E2E'} :
                 {size: 4, color: '#888'}
}

let DateScatterPoint = ({ x, y, datum }: any) => {

  let dispatch = useStateDispatcher()
  let selectedFrame = useStateSelector(s => s.mapper.selectedFrame)
  let hoveredFrame = useStateSelector(s => s.mapper.hoveredFrame)

  let frame = datum.frame

  let hovered = frame === hoveredFrame
  let selected = frame === selectedFrame
  let borderColor = selected ? '#0074D9' :
                    hovered ?  'rgb(209, 213, 219)' :
                               'transparent'  

  let style = selected ? {} : {}

  return (
    <circle
      cx={x}
      cy={y}
      // r={hovered || selected ? 12 : 6}
      r={5}
      stroke={borderColor}
      strokeWidth={7}
      fill="#777777"
      onClick={() => dispatch(mapperActions.selectFrame(frame))}
      onMouseEnter={() => dispatch(mapperActions.hoverFrame(frame))}
      onMouseLeave={() => dispatch(mapperActions.hoverFrame(undefined))}
      style={{cursor: 'pointer', ...style}}
    />
  )
}