
import React from 'react'

import {
    AnimatedAxis, // any of these can be non-animated equivalents
    AnimatedGrid,
    AnimatedLineSeries,
    XYChart,
    Tooltip,
  } from '@visx/xychart'
  
import { useStateSelector } from '../state/hooks'

export let VisxChart = () => {

  let polygon = useStateSelector(s => s.mapper.selectedPolygon)

  return (

    <div className="h-48">



      {render()}



    </div>
  )
}

const data1 = [
  { x: '2020-01-01', y: 50 },
  { x: '2020-01-02', y: 10 },
  { x: '2020-01-03', y: 20 },
];

const data2 = [
  { x: '2020-01-01', y: 30 },
  { x: '2020-01-02', y: 40 },
  { x: '2020-01-03', y: 80 },
];

const accessors = {
  xAccessor: (d: any) => d.x,
  yAccessor: (d: any) => d.y,
};

const render = () => (
  <XYChart height={300} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
    <AnimatedAxis orientation="bottom" />
    <AnimatedGrid columns={false} numTicks={4} />
    <AnimatedLineSeries dataKey="Line 1" data={data1} {...accessors} />
    <AnimatedLineSeries dataKey="Line 2" data={data2} {...accessors} />
    <Tooltip
      snapTooltipToDatumX
      snapTooltipToDatumY
      showVerticalCrosshair
      showSeriesGlyphs
      renderTooltip={({ tooltipData, colorScale }) => {
        console.log(tooltipData)
        return <>
        {tooltipData && tooltipData.nearestDatum && colorScale &&
        <div>
          <div style={{ color: colorScale(tooltipData.nearestDatum.key) }}>
            {tooltipData.nearestDatum.key}
          </div>
          {accessors.xAccessor(tooltipData.nearestDatum.datum)}
          {', '}
          {accessors.yAccessor(tooltipData.nearestDatum.datum)}
          Hello
        </div>
        }
      </>}}
    />
  </XYChart>
);