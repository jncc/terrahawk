
import { Framework } from './slices/mapper/types'

// could dynamically load framework boundaries in the future to avoid bundling them
import liveng0Boundary from './assets/frameworks/liveng0-boundary.json'

export const frameworks: {[framework: string]: Framework} = {
  liveng0: {
    name: `Living England: Yorkshire subset`,
    srs: `osgb`,
    boundary: liveng0Boundary,
    maxBounds: {northEast: {lat: 60, lng: 3}, southWest: {lat: 48, lng: -11}},
    defaultZoom: 9,
    // defaultZoom: 13,
    polygonZoomThreshold: 13,
    defaultQuery: {
      framework: 'liveng0',
      center: {lat: 54, lng: -1.4},
      // center: {lat: 53.7, lng: -0.45},
      indexname: 'NDVI',
      statistic: 'mean',
      yearFrom: 2020,
      monthFrom: 1,
      yearTo: 2021,
      monthTo: 12,
    },
    availableDates: {from: {year: 2015, month: 7}, to: {year: 2021, month: 7}}
  }
}
