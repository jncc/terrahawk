
export type Indexname = 'EVI' | 'NBR' | 'NDMI' | 'NDVI' | 'NDWI'
export type Statistic = 'mean' | 'median' | 'min' | 'max' | 'Q1' | 'Q3'

export type PolygonsQuery = {
  framework: string
  bbox: string
}

export type Poly = {
  polyid: string
  habitat: string
  geojson: any
  partition: string
}

export type PolygonQueryResult = {
  polys:  Poly[]
  params: { framework: string }
}

export type ChoroplethQuery = {
  framework: string
  indexname: string
  bbox: string
}

export type ChoroplethItem = {
  polyid: string
  max_z_mean: number
  max_z_median: number
  max_z_min: number
  max_z_max: number
  max_z_q1: number
  max_z_q3: number
}

export function isChoroplethItem(c: ChoroplethItem | NoDataChoroplethItem): c is ChoroplethItem {
  return (c as ChoroplethItem).max_z_mean !== undefined
}

export type NoDataChoroplethItem = {
  polyid: string
}

export type ChoroplethQueryResult = {
  items: (ChoroplethItem | NoDataChoroplethItem)[]
  params: {
    framework: string
    indexname: Indexname
  }
}

// util
export type Bounds = { southWest: { lat: number, lng: number }, northEast: { lat: number, lng: number }}
