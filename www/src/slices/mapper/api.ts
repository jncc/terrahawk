
import { Observable, of, merge, EMPTY } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { map  } from 'rxjs/operators'
import LRUCache from 'lru-cache'
import { frameworks } from '../../frameworks'
import { RootState } from '../../state/store'
import { bboxToWkt, getBboxFromBounds } from '../../utility/geospatialUtility'
import { ChoroplethItem, ChoroplethKeyParams, ChoroplethParams, ChoroplethQueryResult, ChoroplethNone, PolygonsQueryResult, PolygonsQuery,
  FieldDataQueryResult, MonthStats, HabitatsQuery, FrameworkHabitats, Framework} from './types'
import { getBoundsOfBboxRectangle } from './helpers/bboxHelpers'

// polygons
// --------

export let fetchPolygons = (query: RootState['mapper']['query']): Observable<PolygonsQueryResult> => {

  let getParamsForFetchPolygons = (query: RootState['mapper']['query']): PolygonsQuery => {
    let bounds = getBoundsOfBboxRectangle(query.center, query.framework)
    return {
      framework: frameworks[query.framework].defaultQuery.framework,
      bbox: bboxToWkt(getBboxFromBounds(bounds)),
      limit: 3001
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

let choroplethCache = new LRUCache<string, ChoroplethItem | ChoroplethNone>({ max: 10000 })

/// Get *only* the key params (from a potentially wider object!)
let pickKeyParams = (params: ChoroplethKeyParams): ChoroplethKeyParams =>
  (({ framework, indexname, yearFrom, monthFrom, yearTo, monthTo }) =>
    ({ framework, indexname, yearFrom, monthFrom, yearTo, monthTo }))(params)

let makeCacheKey = (polyid: string, params: ChoroplethKeyParams) => {
  let keyParams = pickKeyParams(params)
  return `${Object.values(keyParams).join(':')}::${polyid}`
}

export let fetchChoropleth = (state: RootState['mapper']): Observable<ChoroplethQueryResult> => {

  let cached = state.polygons.polys
    .map(p => {
      let key = makeCacheKey(p.polyid, state.query)
      return choroplethCache.get(key)
    })
    .filter(item => item !== undefined) as (ChoroplethItem | ChoroplethNone)[]

  let needed = state.polygons.polys.filter(p => !cached.find(c => c.polyid === p.polyid))

  let params: ChoroplethParams = {
    framework:      frameworks[state.query.framework].defaultQuery.framework, 
    indexname:      state.query.indexname,
    yearFrom:       state.query.yearFrom,
    monthFrom:      state.query.monthFrom,
    yearTo:         state.query.yearTo,
    monthTo:        state.query.monthTo,
    polyids:        needed.map(p => p.polyid),
    polyPartitions: [...new Set(needed.map(p => p.partition))] // distinct
  }

  let api$ = api('choropleth', params).pipe(
    map(r => {
      // todo: this "no data" impl. is a bit gnarly
      let dataItems = r.response as ChoroplethItem[]
      let noneItems = params.polyids.filter(polyid => !dataItems.find(c => c.polyid === polyid)).map(polyid => ({ polyid } as ChoroplethNone))
      let allItems: (ChoroplethItem | ChoroplethNone)[] = [...dataItems, ...noneItems]
      // cache the items
      allItems.forEach(c => {
        let key = makeCacheKey(c.polyid, params)
        choroplethCache.set(key, c)
      })
      // This asynchronous return from the database will replace the immediate synchronous return from the cache
      // So we need to add the cached items to the retrieved items to avoid the cached ones being blatted out by the asynch return
      return { items: allItems.concat(cached), params: pickKeyParams(params) }
    })
  )

  let cached$ = cached.length ? of({ items: cached, params: pickKeyParams(params) }) : EMPTY

  // (Syntactically hard to understand but observedly results in two returns from the function
  // Firstly an immediate synchronous return of cached$ and then a later asynchronous return of api$)
  return merge(cached$, needed.length ? api$ : EMPTY)
}

// polygon stats
// -------------

let statsCache = new LRUCache<string, MonthStats>({ max: 100 })

export let fetchPolygon = (state: RootState['mapper']): Observable<any> => {

if (!state.selectedPolygon)
  throw 'Shouldn\'t get here - no polygon selected'

  let params = {
    framework:      frameworks[state.query.framework].defaultQuery.framework,
    indexname:      state.query.indexname,
    polyids:        [state.selectedPolygon.polyid],
    polyPartitions: [state.selectedPolygon.partition],
  }

  let cacheKey = `${Object.values(params).join(':')}`
  let cached = statsCache.get(cacheKey)

  if (cached) {
    return of(cached)
  } else {
    return api('polygon', params).pipe(
      map(r => {
        let result =  r.response
        statsCache.set(cacheKey, result)
        return result
      })
    )
  }
}

// field data - Not Currently used - data not available
// ----------------------------------------------------

export let fetchFieldData = (query: RootState['mapper']['query']): Observable<FieldDataQueryResult> => {

  let bounds = getBoundsOfBboxRectangle(query.center, query.framework)

  let params = {
    framework: frameworks[query.framework].defaultQuery.framework,
    bbox: bboxToWkt(getBboxFromBounds(bounds))
  }

  return api('npms', params).pipe(
    map(r =>( { fieldData: r.response.data }))
  )
}

// habitats
// --------

export let fetchHabitats = (requiredFramework: Framework): Observable<FrameworkHabitats> => {

  let getParamsForFetchHabitats = (requiredFramework: Framework): HabitatsQuery => {
    return {
      framework: requiredFramework.defaultQuery.framework,
    }
  }
  
  return api('habitats', getParamsForFetchHabitats(requiredFramework)).pipe(
    map(r =>( { framework: requiredFramework, habitats: r.response.habitats }))
  )
}

let api = (endpoint: string, params: any) => {
  return ajax.post(
    `https://xnqk0s6yzh.execute-api.eu-west-2.amazonaws.com/${endpoint}`,
    //`http://localhost:8000/${endpoint}`,
    params,
    { 'Content-Type': 'application/json' }
  )
}
