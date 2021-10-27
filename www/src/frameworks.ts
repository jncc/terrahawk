
import { Bounds, Indexname, Statistic } from "./mapper/types"

// could dynamically load framework boundaries in the future to avoid packaging them
import liveng0Boundary from './assets/frameworks/liveng0-boundary.json'

export const frameworks: { [index: string]: Framework } = {
  liveng0: {
    name: `Living England: Yorkshire subset`,
    defaultCenter: { lat: 54.067, lng: -2.280 },
    defaultZoom: 13,
    defaultIndexname: 'NDVI',
    defaultStatistic: 'mean',
    boundary: liveng0Boundary,
    maxBounds: { northEast: { lat: 60, lng: 3 }, southWest: { lat: 48, lng: -11 }}
  }
}

export type Framework = {
  name: string
  defaultCenter: { lat: number, lng: number }
  defaultZoom: number
  defaultIndexname: Indexname
  defaultStatistic: Statistic
  boundary: any
  maxBounds: Bounds
}
