
export type Indexname = 'EVI' | 'NBR' | 'NDMI' | 'NDVI' | 'NDWI'
export type Statistic = 'mean' | 'median' | 'min' | 'max' | 'Q1' | 'Q3'

export type Framework = {
  name: string
  boundary: any
  maxBounds: Bounds
  defaultZoom: number
  defaultQuery: {
    framework: string
    center: {lat: number, lng: number}
    indexname: Indexname
    statistic: Statistic
    yearFrom: number
    monthFrom: number
    yearTo: number
    monthTo: number
  }
}

export type Query = Framework['defaultQuery']

export type PolygonsQuery = Pick<Query,
  | "framework"
> & {
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

export type ChoroplethKeyParams = Pick<Query,
  | "framework"
  | "indexname"
  | "yearFrom"
  | "monthFrom"
  | "yearTo"
  | "monthTo"
>

export type ChoroplethParams = ChoroplethKeyParams & {
  polyids: string[],
  polyPartitions: string[],
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

/// A "no-data" choropleth item
export type ChoroplethNone = {
  polyid: string
}

export function isChoroplethItem(c: ChoroplethItem | ChoroplethNone): c is ChoroplethItem {
  return (c as ChoroplethItem).max_z_mean !== undefined
}

export type ChoroplethQueryResult = {
  items: (ChoroplethItem | ChoroplethNone)[]
  params: {
    framework: string
    indexname: Indexname
  }
}


// util
export type Bounds = { southWest: { lat: number, lng: number }, northEast: { lat: number, lng: number }}
