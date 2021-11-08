
import React from 'react'
import { VictoryChart, VictoryAxis, VictoryScatter, VictoryLine, VictoryStack, VictoryArea  } from 'victory'

import { MonthStats } from './types'

export let YearChart = (props: {data: MonthStats[]}) => {

  let polygonLineData = monthlyTicks.map(({value, label}) => {
    let dataForPeriod = props.data.find(d => d.month === value)
    return {
      x: label,
      y: dataForPeriod ? dataForPeriod.mean : null
    }
  })

  let getComparisionLineData = (f: (s: MonthStats) => number) => monthlyTicks.map(({value, label}) => {
    let dataForPeriod = props.data.find(d => d.month === value)
    return {
      x: label,
      y: dataForPeriod ? f(dataForPeriod)  : null,
    }
  })

  return (
    <div className="h-48 border-2 border-gray-300 rounded-xl">

      <VictoryChart width={600} height={200} padding={30}>

        <VictoryStack>
          <VictoryArea
            data={getComparisionLineData(s => s.cf_mean + s.cf_mean_sd * -2)}
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
          style={{ data: {stroke: "orange"}}}
          interpolation="cardinal"
          data={polygonLineData}
        />
        <VictoryScatter
          style={{data: {fill: "tomato"}}}
          data={polygonLineData}
        />
        
        <VictoryAxis style={{axis: {stroke: "transparent"}}}  />
        <VictoryAxis dependentAxis style={{axis: {stroke: "transparent"}}}  />

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
