
import { of, concat, merge } from 'rxjs'
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

  // todo: only ask the api for polygons we don't already have?
  return api('polygons', getParamsForFetchPolygons(query))
}

// type CacheKey = {
//   framework: string
//   indexname: string
//   polyid: string
//   // date-range
//   // monthly/seasonally
// }

let cache = new QuickLRU<string, ChoroplethItem>({ maxSize: 10000 })

export let fetchChoropleth = (state: RootState['mapper']) => {

  let makeCacheKey = (polyid: string): string => (JSON.stringify({
    framework: state.query.framework,
    indexname: state.query.indexname,
    polyid:    polyid,
    // date range
    // monthly/seasonally
  }))

  let choroplethItemsWeAlreadyHave = state.polygons
    .map(p => cache.get(makeCacheKey(p.polyid)))
    .filter(item => item !== undefined) as ChoroplethItem[]

  // console.log('choroplethItemsWeAlreadyHave')
  // console.log(choroplethItemsWeAlreadyHave)
  console.log('cachesize')
  console.log(cache.size)

  let polysWeNeedChoroplethItemFor = state.polygons.filter(
    p => !choroplethItemsWeAlreadyHave.find(c => c.polyid === p.polyid)
  )
  console.log('polysWeNeedChoroplethItemFor')
  console.log(polysWeNeedChoroplethItemFor.length)

  let params = {
    framework: state.query.framework,
    indexname: state.query.indexname,
    polyids: polysWeNeedChoroplethItemFor.map(p => p.polyid),
    polyPartitions: [...new Set(polysWeNeedChoroplethItemFor.map(p => p.partition))] // distinct partitions
  }

  if (params.polyids.length) {

    return merge(
      of(choroplethItemsWeAlreadyHave),
      api('choropleth', params).pipe(
        map(x => {
          let vals = x.response
          vals.forEach((c: ChoroplethItem) => {
            cache.set(makeCacheKey(c.polyid), c)
          })
          return vals
        })
      )
    )
  } else {
    return of(choroplethItemsWeAlreadyHave)
  }
}

let api = (endpoint: string, params: any) => {
  return ajax.post(
    `https://xnqk0s6yzh.execute-api.eu-west-2.amazonaws.com/${endpoint}`,
    params,
    { 'Content-Type': 'application/json' }
  )
}
