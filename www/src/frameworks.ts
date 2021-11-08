
import { Framework } from "./mapper/types"

// could dynamically load framework boundaries in the future to avoid packaging them
import liveng0Boundary from './assets/frameworks/liveng0-boundary.json'

export const frameworks: {[index: string]: Framework} = {
  liveng0: {
    name: `Living England: Yorkshire subset`,
    boundary: liveng0Boundary,
    maxBounds: {northEast: {lat: 60, lng: 3}, southWest: {lat: 48, lng: -11}},
    defaultZoom: 13,
    defaultQuery: {
      framework: 'liveng0',
      center: {lat: 54.155, lng: -2.446},
      indexname: 'NDVI',
      statistic: 'mean',
      yearFrom: 2020,
      monthFrom: 1,
      yearTo: 2020,
      monthTo: 12,
    },
    availableDates: {from: {year: 2015, month: 7}, to: {year: 2021, month: 7}}
  }
}
