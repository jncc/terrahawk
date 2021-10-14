
import { of } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { map, switchMap, catchError, mapTo, } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import { RootState } from '../state/store'
import { globalActions } from '../global/slice'
import { mapperActions  } from './slice'
import { PolygonsQuery } from './types'
import { bboxToWkt, getBboxFromBounds, getPaddedBoundsAroundPoint } from '../utility/geospatialUtility'

let fetchPolygonsEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(mapperActions.mapCenterChanged.type),
  switchMap(() => api('polygons', getPolygonsParams(state$.value.mapper.query)).pipe(
    map(r => mapperActions.fetchPolygonsCompleted(r.response.polygons)),
    catchError(e => of(mapperActions.fetchPolygonsFailed(e.message))),
  )),
)

let fetchChoroplethEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(mapperActions.fetchPolygonsCompleted.type),
  switchMap(() => api('choropleth', getChoroplethParams(state$.value.mapper)).pipe(
    map(r => mapperActions.fetchChoroplethCompleted(r.response)),
    catchError(e => of(globalActions.showError(e.message))),
  ))
)

let startLoadingEpic = (action$: any) => action$.pipe(
  ofType(
    mapperActions.mapCenterChanged.type,
    mapperActions.fetchPolygonsCompleted.type,
  ),
  mapTo(globalActions.startLoading()),
)

let stopLoadingEpic = (action$: any) => action$.pipe(
  ofType(
    mapperActions.fetchPolygonsCompleted.type,
    mapperActions.fetchPolygonsFailed.type,
    mapperActions.fetchChoroplethCompleted.type,
    mapperActions.fetchChoroplethFailed.type,
  ),
  mapTo(globalActions.stopLoading()),
)

let showErrorEpic = (action$: any) => action$.pipe(
  ofType(
    mapperActions.fetchPolygonsFailed.type,
    mapperActions.fetchChoroplethFailed.type,
  ),
  map((a: any) => globalActions.showError(a.payload))
)

// let fakeRequest = () => new rx.Observable<string>(
//   subscriber =>  subscriber.next('Hello')).pipe(
//   rxo.delay(1000)
// )

let api = (endpoint: string, params: any) => {
  return ajax.post(
    `https://xnqk0s6yzh.execute-api.eu-west-2.amazonaws.com/${endpoint}`,
    params,
    { 'Content-Type': 'application/json' }
  )
}

let getPolygonsParams = (query: RootState['mapper']['query']): PolygonsQuery => {
  let bounds = getPaddedBoundsAroundPoint(query.center) // we could vary the size of the bbox dynamically here
  return {
    framework: query.framework,
    bbox:      bboxToWkt(getBboxFromBounds(bounds))
  }
}

let getChoroplethParams = (state: RootState['mapper']) => ({
  framework:      state.query.framework,
  indexname:      state.query.indexname,
  polyids:        state.polygons.map(p => p.polyid),
  polyPartitions: [...new Set(state.polygons.map(p => p.partition))], // distinct partitions
})

export let mapperEpics: any = combineEpics(
  fetchPolygonsEpic,
  fetchChoroplethEpic,
  startLoadingEpic,
  stopLoadingEpic,
  showErrorEpic,
)
