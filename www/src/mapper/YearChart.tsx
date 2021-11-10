
import React from 'react'
import { VictoryChart, VictoryAxis, VictoryScatter, VictoryLine, VictoryStack, VictoryArea, VictoryLabel  } from 'victory'
import { useStateDispatcher } from '../state/hooks'
import { getDatesFromDateField } from './helpers/frameHelpers'
import { mapperActions } from './slice'

import { MonthStats } from './types'

export let YearChart = (props: {year: number, data: MonthStats[]}) => {

  let dispatch = useStateDispatcher()

  let polygonLineData = monthlyTicks.map(({value, label}) => {
    let dataForPeriod = props.data.find(d => d.month === value)
    return {
      x: label,
      y: dataForPeriod ? dataForPeriod.mean : null,
      z_score : dataForPeriod ? dataForPeriod.z_mean: null,
    }
  })

  let getComparisionLineData = (f: (s: MonthStats) => number) => monthlyTicks.map(({value, label}) => {
    let dataForPeriod = props.data.find(d => d.month === value)
    return {
      x: label,
      y: dataForPeriod ? f(dataForPeriod)  : null,
    }
  })

  let frameScatterData = monthlyTicks.map(({value, label}) => {
    let dataForPeriod = props.data.find(d => d.month === value)
    return {
      x: label,
      y: 0,
      frameCount: dataForPeriod ? getDatesFromDateField(dataForPeriod.date).length : null,
      firstDate: dataForPeriod ? getDatesFromDateField(dataForPeriod.date)[0] : null,
    }
  })

  let DateScatterPoint = ({ x, y, datum }: any) => {
    const [selected, setSelected] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);
  
    return (
      <circle
        cx={x}
        cy={y}
        r={hovered || selected ? 12 : 6}
        stroke={"transparent"} // make it "really" bigger to allow easier selection with mouse
        strokeWidth={5}
        // fill={hovered ? "#777" : "#666"}
        fill="#666"
        // onClick={() => setSelected(!selected)}
        onClick={() => dispatch(mapperActions.selectDate(datum.firstDate))}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{cursor: 'pointer'}}
      />
    )
  }

  return (
    <div className="h-48 border-2 border-gray-300 rounded-xl">

      <VictoryChart width={600} height={200} padding={30}  >

        <VictoryStack>
          <VictoryArea
            data={getComparisionLineData(s => s.cf_mean - (s.cf_mean_sd * 2))}
            colorScale={['transparent']}
            interpolation="cardinal"
            />
          <VictoryArea
            data={getComparisionLineData(s => s.cf_mean_sd)}
            colorScale={['#eee']}
            interpolation="cardinal"
            />
          <VictoryArea
            data={getComparisionLineData(s => s.cf_mean_sd * 2)}
            colorScale={['#ddd']}
            interpolation="cardinal"
            />
          <VictoryArea
            data={getComparisionLineData(s => s.cf_mean_sd)}
            colorScale={['#eee']}
            interpolation="cardinal"
            />
        </VictoryStack>
           
        <VictoryLine
          style={{ data: {stroke: "#666"}}}
          interpolation="cardinal"
          data={polygonLineData}
        />
        <VictoryScatter
          style={{data: {fill: ({datum}) => getPointStyleForZScore(datum.z_score).color}}}
          data={polygonLineData}
          size={({ datum }) => getPointStyleForZScore(datum.z_score).size}
        />

        <VictoryScatter
          style={{data: {fill: "#666"}}}
          data={frameScatterData}
          // size={({ datum }) => datum.frameCount}
          size={6}

          dataComponent={<DateScatterPoint />}          
        />

        <VictoryAxis style={{axis: {stroke: "transparent"}}}   />
        <VictoryAxis dependentAxis style={{axis: {stroke: "transparent"}}}  />

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
                 {size: 4, color: '#555'}
}

