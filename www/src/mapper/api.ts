
import { ajax } from 'rxjs/ajax'
import { tap } from 'rxjs/operators'
import QuickLRU from 'quick-lru'

import { RootState } from '../state/store'
import { bboxToWkt, getBboxFromBounds } from '../utility/geospatialUtility'
import { PolygonsQuery } from './types'
import { getBoundsOfBboxRectangle } from './helpers/bboxHelpers'

export let fetchPolygons = (query: RootState['mapper']['query']) => {

  let getParamsForFetchPolygons = (query: RootState['mapper']['query']): PolygonsQuery => {
    let bounds = getBoundsOfBboxRectangle(query.center)
    return {
      framework: query.framework,
      bbox: bboxToWkt(getBboxFromBounds(bounds))
    }
  }

  // todo: only ask the api for polygons we don't already have?
  return api('polygons', getParamsForFetchPolygons(query))
}

export let fetchChoropleth = (state: RootState['mapper']) => {

  /*
  a cache key is {
    framework,
    indexname,
    date-range
    polyid
    monthly/seasonally
  }
  if i had a key-value fixed-length searchable queue...

  foreach poly in state, tryget out of the cache 
  
  */
  // let cache = new QuickLRU({maxSize: 10000})

  // cache.set({

  // }, )

  let getParamsForFetchChoropleth = (state: RootState['mapper']) => ({
    framework: state.query.framework,
    indexname: state.query.indexname,
    polyids: state.polygons.map(p => p.polyid),
    polyPartitions: [...new Set(state.polygons.map(p => p.partition))], // distinct partitions
  })

  return api('choropleth', getParamsForFetchChoropleth(state)).pipe(
    tap(x => console.log(x))
  )
}

let api = (endpoint: string, params: any) => {
  return ajax.post(
    `https://xnqk0s6yzh.execute-api.eu-west-2.amazonaws.com/${endpoint}`,
    params,
    { 'Content-Type': 'application/json' }
  )
}
