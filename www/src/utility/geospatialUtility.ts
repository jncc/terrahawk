
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

export const getPaddedBoundsAroundPoint = (point: { lat: number, lng: number }) => {
  let [ latPad, lngPad ] = [ 0.03, 0.06 ]

  return {
    southWest: { lat: point.lat - latPad, lng: point.lng - lngPad },
    northEast: { lat: point.lat + latPad, lng: point.lng + lngPad },
  }
}

export const getBboxFromBounds = (bounds: { southWest: { lat: number, lng: number }, northEast: { lat: number, lng: number }}): Bbox => {
  return {
    west:  roundTo3Decimals(bounds.southWest.lng),
    south: roundTo3Decimals(bounds.southWest.lat),
    east:  roundTo3Decimals(bounds.northEast.lng),
    north: roundTo3Decimals(bounds.northEast.lat),
  }
}
