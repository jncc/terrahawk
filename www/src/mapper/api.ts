
import { Observable, of, merge, EMPTY } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { map  } from 'rxjs/operators'
import LRUCache from 'lru-cache'

import { RootState } from '../state/store'
import { bboxToWkt, getBboxFromBounds } from '../utility/geospatialUtility'
import { ChoroplethItem, ChoroplethKeyParams, ChoroplethParams, ChoroplethQueryResult, ChoroplethNone, PolygonQueryResult, PolygonsQuery, Query } from './types'
import { getBoundsOfBboxRectangle } from './helpers/bboxHelpers'

// polygons
// --------

export let fetchPolygons = (query: RootState['mapper']['query']): Observable<PolygonQueryResult> => {

  let getParamsForFetchPolygons = (query: RootState['mapper']['query']): PolygonsQuery => {
    let bounds = getBoundsOfBboxRectangle(query.center)
    return {
      framework: query.framework,
      bbox: bboxToWkt(getBboxFromBounds(bounds))
    }
  }

  let keyParams = { framework: query.framework }
  
  // todo: we could also cache the polygons...
  return api('polygons', getParamsForFetchPolygons(query)).pipe(
    map(r =>( { params: keyParams, polys: r.response.polygons }))
  )
}

// choropleth
// ----------

let cache = new LRUCache<string, ChoroplethItem | ChoroplethNone>({ max: 10000 })

let getKeyParams = (params: ChoroplethKeyParams): ChoroplethKeyParams => (({ framework, indexname, yearFrom, monthFrom, yearTo, monthTo }) =>
({ framework, indexname, yearFrom, monthFrom, yearTo, monthTo }))(params)

let makeCacheKey = (polyid: string, keyParams: ChoroplethKeyParams) => `${Object.values(keyParams).join(':')}::${polyid}`

export let fetchChoropleth = (state: RootState['mapper']): Observable<ChoroplethQueryResult> => {

  let cached = state.polygons.polys
    .map(p => {
      let key = makeCacheKey(p.polyid, getKeyParams(state.query))
      return cache.get(key)
    })
    .filter(item => item !== undefined) as (ChoroplethItem | ChoroplethNone)[]

  let needed = state.polygons.polys.filter(
    p => !cached.find(c => c.polyid === p.polyid)
  )

  let params: ChoroplethParams = {
    ...state.query, // actually some properties (e.g. center) are not needed for this request, but...
    polyids:        needed.map(p => p.polyid),
    polyPartitions: [...new Set(needed.map(p => p.partition))] // distinct
  }

  let keyParams = getKeyParams(params)

  let api$ = api('choropleth', params).pipe(
    map(r => {
      // todo: this "no data" impl. is a bit gnarly
      let dataItems = r.response as ChoroplethItem[]
      let noneItems = params.polyids.filter(polyid => !dataItems.find(c => c.polyid === polyid)).map(polyid => ({ polyid } as ChoroplethNone))
      let allItems: (ChoroplethItem | ChoroplethNone)[] = [...dataItems, ...noneItems]
      // cache the items
      allItems.forEach(c => {
        let k = makeCacheKey(c.polyid, keyParams)
        cache.set(k, c)
      })
      return { items: allItems, params: keyParams }
    })
  )

  let cached$ = cached.length ? of({ items: cached, params: keyParams }) : EMPTY

  return merge(cached$, needed.length ? api$ : EMPTY)
}

let api = (endpoint: string, params: any) => {
  return ajax.post(
    `https://xnqk0s6yzh.execute-api.eu-west-2.amazonaws.com/${endpoint}`,
    params,
    { 'Content-Type': 'application/json' }
  )
}
