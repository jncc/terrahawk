
import { Observable, of, merge, EMPTY } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { map  } from 'rxjs/operators'
import LRUCache from 'lru-cache'

import { RootState } from '../state/store'
import { bboxToWkt, getBboxFromBounds } from '../utility/geospatialUtility'
import { ChoroplethItem, ChoroplethQueryResult, NoDataChoroplethItem, PolygonQueryResult, PolygonsQuery } from './types'
import { getBoundsOfBboxRectangle } from './helpers/bboxHelpers'

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

// let cache = new QuickLRU<string, ChoroplethItem | NoDataChoroplethItem>({ maxSize: 10000 })
let cache = new LRUCache<string, ChoroplethItem | NoDataChoroplethItem>({ max: 10000 })

let makeCacheKey = (framework: string, indexname: string, polyid: string): string => 
`${framework}::${indexname}::${polyid}`
// todo: date range, monthly/seasonally

export let fetchChoropleth = (state: RootState['mapper']): Observable<ChoroplethQueryResult> => {

  let alreadyGot = state.polygons.polys
    .map(p => cache.get(makeCacheKey(state.query.framework, state.query.indexname, p.polyid)))
    .filter(item => item !== undefined) as ChoroplethItem[]

  let needed = state.polygons.polys.filter(
    p => !alreadyGot.find(c => c.polyid === p.polyid)
  )

  let params = {
    framework: state.query.framework,
    indexname: state.query.indexname,
    polyids: needed.map(p => p.polyid),
    polyPartitions: [...new Set(needed.map(p => p.partition))] // distinct partitions
  }

  let keyParams = { framework: params.framework, indexname: params.indexname }

  let api$ = api('choropleth', params).pipe(
    map(r => {
      let items = r.response as ChoroplethItem[]
      let noValueItems = params.polyids.filter(polyid => !items.find(c => c.polyid === polyid)).map(polyid => ({ polyid } as NoDataChoroplethItem))
      let allItems: (ChoroplethItem | NoDataChoroplethItem)[] = [...items, ...noValueItems]
      // store the items in the cache before we return them
      allItems.forEach((c: ChoroplethItem | NoDataChoroplethItem) => {
        cache.set(makeCacheKey(params.framework, params.indexname, c.polyid), c)
      })
      return { items: allItems, params: keyParams }
    })
  )

  let alreadyGot$ = alreadyGot.length ? of({ items: alreadyGot, params: keyParams }) : EMPTY

  let dump = cache.dump()
  console.log(dump)

  return merge(alreadyGot$, needed.length ? api$ : EMPTY)
}

let api = (endpoint: string, params: any) => {
  return ajax.post(
    `https://xnqk0s6yzh.execute-api.eu-west-2.amazonaws.com/${endpoint}`,
    params,
    { 'Content-Type': 'application/json' }
  )
}
