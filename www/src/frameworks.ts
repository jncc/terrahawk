
import { Framework } from './slices/mapper/types'

// could dynamically load framework boundaries in the future to avoid bundling them
import liveng0Boundary from './assets/frameworks/liveng0-boundary.json'
import liveng1Boundary from './assets/frameworks/liveng1-boundary.json'

export const frameworks: {[framework: string]: Framework} = {
  liveng0: {
    name: `Living England: Yorkshire subset`,
    srs: `osgb`,
    boundary: liveng0Boundary,
    maxBounds: {northEast: {lat: 60, lng: 3}, southWest: {lat: 48, lng: -11}},
    defaultZoom: 9,
    maxZoom: 18,
    minZoom: 7,
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
  ,
  liveng1: {
    name: `Living England`,
    srs: `osgb`,
    boundary: liveng1Boundary,
    maxBounds: {northEast: {lat: 60, lng: 3}, southWest: {lat: 48, lng: -11}},
    defaultZoom: 9,
    maxZoom: 25,
    minZoom: 7,
    // defaultZoom: 13,
    polygonZoomThreshold: 13,
    defaultQuery: {
      framework: 'liveng1',
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
