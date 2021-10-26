
import { of, merge } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { tap, map,  } from 'rxjs/operators'
import QuickLRU from 'quick-lru'

import { RootState } from '../state/store'
import { bboxToWkt, getBboxFromBounds } from '../utility/geospatialUtility'
import { ChoroplethItem, PolygonsQuery } from './types'
import { getBoundsOfBboxRectangle } from './helpers/bboxHelpers'

export let fetchPolygons = (query: RootState['mapper']['query']) => {

  let getParamsForFetchPolygons = (query: RootState['mapper']['query']): PolygonsQuery => {
    let bounds = getBoundsOfBboxRectangle(query.center)
    return {
      framework: query.framework,
      bbox: bboxToWkt(getBboxFromBounds(bounds))
    }
  }

  // todo: we could also cache the polygons...
  return api('polygons', getParamsForFetchPolygons(query)).pipe(
    map(r => r.response.polygons)
  )
}

let cache = new QuickLRU<string, ChoroplethItem>({ maxSize: 10000 })

export let fetchChoropleth = (state: RootState['mapper']) => {

  let makeCacheKey = (polyid: string): string => 
    `${state.query.framework}::${state.query.indexname}::${polyid}`
    // todo: date range, monthly/seasonally

  let alreadyGot = state.polygons
    .map(p => cache.get(makeCacheKey(p.polyid)))
    .filter(item => item !== undefined) as ChoroplethItem[]

  let needed = state.polygons.filter(
    p => !alreadyGot.find(c => c.polyid === p.polyid)
  )

  let params = {
    framework: state.query.framework,
    indexname: state.query.indexname,
    polyids: needed.map(p => p.polyid),
    polyPartitions: [...new Set(needed.map(p => p.partition))] // distinct partitions
  }

  // an observable of an API call result, or of an empty array (if we need nothing)
  let fetchIfNecessary = needed.length ?
    api('choropleth', params).pipe(
      map(r => {
        let items = r.response
        // store the items in the cache before we return them
        items.forEach((c: ChoroplethItem) => {
          cache.set(makeCacheKey(c.polyid), c)
        })
        return items
      })
    ) :
    of([])

  return merge(of(alreadyGot), fetchIfNecessary)
}

let api = (endpoint: string, params: any) => {
  return ajax.post(
    `https://xnqk0s6yzh.execute-api.eu-west-2.amazonaws.com/${endpoint}`,
    params,
    { 'Content-Type': 'application/json' }
  )
}
