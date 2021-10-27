
import { Bounds } from '../mapper/types'
import { roundTo3Decimals } from './numberUtility'

export type Bbox = {
    west:  number,
    south: number,
    east:  number,
    north: number,
  }

export const bboxToWkt = (bbox: Bbox) => {
  return `POLYGON((${bbox.west} ${bbox.south}, ${bbox.west} ${bbox.north}, ${bbox.east} ${bbox.north}, ${bbox.east} ${bbox.south}, ${bbox.west} ${bbox.south}))`
}

export const getBboxFromBounds = (bounds: Bounds): Bbox => {
  return {
    west:  roundTo3Decimals(bounds.southWest.lng),
    south: roundTo3Decimals(bounds.southWest.lat),
    east:  roundTo3Decimals(bounds.northEast.lng),
    north: roundTo3Decimals(bounds.northEast.lat),
  }
}
