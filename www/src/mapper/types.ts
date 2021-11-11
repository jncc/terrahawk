
export type Indexname = 'EVI' | 'NBR' | 'NDMI' | 'NDVI' | 'NDWI'
export type Statistic = 'mean' | 'median' | 'min' | 'max' | 'Q1' | 'Q3'

export type Framework = {
  name: string
  boundary: any
  maxBounds: Bounds
  defaultZoom: number
  polygonZoomThreshold: number
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
  availableDates: {from: {year: number, month: number}, to: {year: number, month: number}}
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

export type PolygonsQueryResult = {
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

export type MonthStats = {
  count: string
  polyid: string
  seasonyear: number
  season: string
  date: string
  frame: string
  platform: string
  habitat: string
  mean: number
  sd: number
  median: number
  min: number
  max: number
  q1: number
  q3: number
  year: string
  month: string
  cf_count: string
  cf_mean: number
  cf_mean_sd: number
  cf_median: number
  cf_median_sd: number
  cf_min: number
  cf_min_sd: number
  cf_max: number
  cf_max_sd: number
  cf_q1: number
  cf_q1_sd: number
  cf_q3: number
  cf_q3_sd: number
  z_mean: number
  z_median: number
  z_min: number
  z_max: number
  z_q1: number
  z_q3: number
  framework: string
  indexname: string
  poly_partition: string
}

// util
export type Bounds = { southWest: { lat: number, lng: number }, northEast: { lat: number, lng: number }}
export type SimpleDate = { year: number, month: number, day: number }
