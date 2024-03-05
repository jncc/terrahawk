
export type Indexname = 'RVI' | 'VVVH' | 'VHVV' | 'RFDI' | 'NBR' | 'NDMI' | 'NDVI' | 'NDWI'

export function isS1Index(s: Indexname): s is Indexname {
  return ['RVI', 'VVVH', 'VHVV', 'RFDI'].includes(s)
}

export function isS2Index(s: Indexname): s is Indexname {
  return ['NBR', 'NDMI', 'NDVI', 'NDWI'].includes(s)
}

export type Statistic = 'mean' | 'median' | 'min' | 'max' | 'Q1' | 'Q3'

export type Framework = {
  name: string
  srs: string
  boundary: any
  maxBounds: Bounds
  defaultZoom: number
  bboxPadding: {latPad: number, lngPad: number}
  maxZoom: number
  minZoom: number
  polygonZoomThreshold: number
  defaultQuery: {
    tableName: string
    center: {lat: number, lng: number}
    indexname: Indexname
    statistic: Statistic
    yearFrom: number
    monthFrom: number
    yearTo: number
    monthTo: number
    habitatids: Array<number> 
  }
  availableIndices: Indexname[]
}

export type Query = Framework['defaultQuery']

export type PolygonsQuery = {
  framework: string
  bbox: string
  limit: number
}

export type Habitat = {
  id: number
  habitat: string
}

export type FrameworkHabitats = {
  framework: Framework
  habitats: Habitat[]
}

export type Poly = {
  polyid: string
  habitatid: number
  habitat: string
  geojson: any
  partition: string
}

export type PolygonsQueryResult = {
  polys:  Poly[]
  params: { framework: string}
}

export type FieldDataQuery = {
  framework: string
  bbox: string
}

export type HabitatsQuery = {
  framework: string
}

export type FieldData = {
  sampleid: string,
  date: Date,
  latitude: number,
  longitude: number,
  surveyname: string,
  broadhabitat: string,
  finehabitat: string,
  classsystem: string,
  habitatcondition: string,
  management: string,
  species: string,
  structure: string,
  other: string,
  match: string
}

export type FieldDataQueryResult = {
  fieldData: FieldData[]
}

export type ChoroplethKeyParams = Pick<Query,
  | 'indexname'
  | 'yearFrom'
  | 'monthFrom'
  | 'yearTo'
  | 'monthTo'
> & {
  framework: string
}

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

export type StatValues = {
  value:       number
  cf_value:    number
  cf_value_sd: number
  z_score:     number
}

// util
export type Bounds = { southWest: { lat: number, lng: number }, northEast: { lat: number, lng: number }}
export type SimpleDate = { year: number, month: number, day: number }
