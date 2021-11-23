
import React from 'react'
import { VictoryChart, VictoryAxis, VictoryScatter, VictoryLine, VictoryStack, VictoryArea, VictoryLabel  } from 'victory'
import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { getFramesWithDate } from './helpers/frameHelpers'
import { getStatValues } from './helpers/statsHelper'
import { mapperActions } from './slice'

import { MonthStats, SimpleDate, Statistic, StatValues } from './types'

export let YearChart = (props: {year: number, data: MonthStats[], framesWithDate: {frame: string, date: SimpleDate}[], statistic: Statistic}) => {

  let polygonLineData = monthlyTicks.map(({value, label}) => {
    let dataForPeriod = props.data.find(d => d.month === value)
    return {
      x: label,
      y: dataForPeriod ? getStatValues(props.statistic, dataForPeriod).value : null,
      z_score : dataForPeriod ? getStatValues(props.statistic, dataForPeriod).z_score: null,
    }
  })

  let getComparisionLineData = (f: (s: StatValues) => number) => monthlyTicks.map(({value, label}) => {
    let dataForPeriod = props.data.find(d => d.month === value)
    return {
      x: label,
      y: dataForPeriod ? f(getStatValues(props.statistic, dataForPeriod))  : null,
    }
  })

  let frameScatterData = monthlyTicks.map(({value, label}) => {
    let dataForPeriod = props.data.find(d => d.month === value)
    return {
      x: label,
      y: 0,
      frameCount: dataForPeriod ? getFramesWithDate([dataForPeriod]).length : null,
      firstFrame: dataForPeriod ? getFramesWithDate([dataForPeriod])[0].frame : null,
    }
  })

  return (
    <div className="h-48 border-2 border-gray-300 rounded-xl">

      <VictoryChart width={600} height={200} padding={30}  >

        <VictoryStack>
          <VictoryArea
            data={getComparisionLineData(s => s.cf_value - (s.cf_value_sd * 2))}
            colorScale={['transparent']}
            interpolation="cardinal"
            />
          <VictoryArea
            data={getComparisionLineData(s => s.cf_value_sd)}
            colorScale={['#eee']}
            interpolation="cardinal"
            />
          <VictoryArea
            data={getComparisionLineData(s => s.cf_value_sd * 2)}
            colorScale={['#ddd']}
            interpolation="cardinal"
            />
          <VictoryArea
            data={getComparisionLineData(s => s.cf_value_sd)}
            colorScale={['#eee']}
            interpolation="cardinal"
            />
        </VictoryStack>
           
        <VictoryLine
          style={{ data: {stroke: '#666'}}}
          interpolation="cardinal"
          data={polygonLineData}
        />
        <VictoryScatter
          style={{data: {fill: ({datum}) => getPointStyleForZScore(datum.z_score).color}}}
          data={polygonLineData}
          size={({ datum }) => getPointStyleForZScore(datum.z_score).size}
        />

        <VictoryScatter
          style={{data: {fill: '#666'}}}
          data={frameScatterData}
          // size={({ datum }) => datum.frameCount}
          // size={6}

          dataComponent={<DateScatterPoint />}          
        />

        <VictoryAxis style={{axis: {stroke: 'transparent'}}}   />
        <VictoryAxis dependentAxis style={{axis: {stroke: 'transparent'}}}  />

        <VictoryLabel text={props.year} x={300} y={30} textAnchor="middle" style={{fontSize:'15'}} />

      </VictoryChart>
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

  let frame = datum.firstFrame

  let hovered = frame === hoveredFrame
  let selected = frame === selectedFrame
  let borderColor = selected ? 'red' :
                    hovered ?  'rgb(209, 213, 219)' :
                               'transparent'  
  return (
    <circle
      cx={x}
      cy={y}
      // r={hovered || selected ? 12 : 6}
      r={datum.frameCount}
      
      stroke={borderColor}
      strokeWidth={3}
      // fill={hovered ? "#777" : "#666"}
      fill="#666"
      // onClick={() => setSelected(!selected)}
      onClick={() => dispatch(mapperActions.selectFrame(datum.firstFrame))}
      onMouseEnter={() => dispatch(mapperActions.hoverFrame(datum.firstFrame))}
      onMouseLeave={() => dispatch(mapperActions.hoverFrame(undefined))}
      style={{cursor: 'pointer'}}
    />
  )
}