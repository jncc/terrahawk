
import { of } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { map, switchMap, startWith, endWith, catchError, finalize, } from 'rxjs/operators'
import * as rx from 'rxjs'
import * as rxo from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import { RootState } from '../state/store'
import { globalActions } from '../global/slice'
import { mapperActions  } from './slice'
import { PolygonsQuery } from './types'
import { bboxToWkt, getBboxFromBounds, getPaddedBoundsAroundPoint } from '../utility/geospatialUtility'

export let devEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(mapperActions.devAction.type),
  rxo.tap(console.log),
  rxo.ignoreElements()
)

export let fetchPolygonsEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(mapperActions.mapCenterChanged.type),
  switchMap(() => api('polygons', getPolygonsParams(state$.value.mapper.query)).pipe(
    map(r => mapperActions.fetchPolygonsCompleted(r.response.polygons)),
    catchError(e => of(globalActions.showError(e.message))),
    )),
  startWith(globalActions.startLoading()),
  endWith(globalActions.stopLoading()),
)

export let fetchChoroplethEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(mapperActions.fetchPolygonsCompleted.type),
  switchMap(() => api('choropleth', getChoroplethParams(state$.value.mapper)).pipe(
    map(r => mapperActions.fetchChoroplethCompleted(r.response)),
    catchError(e => of(globalActions.showError(e.message))),
    startWith(globalActions.startLoading()),
    endWith(globalActions.stopLoading()),
  ))
)

export const api = (endpoint: string, params: any) => {
  return ajax.post(
    `https://xnqk0s6yzh.execute-api.eu-west-2.amazonaws.com/${endpoint}`,
    params,
    { 'Content-Type': 'application/json' }
  )
}

export let getPolygonsParams = (query: RootState['mapper']['query']): PolygonsQuery => {
  let bounds = getPaddedBoundsAroundPoint(query.center) // could vary the size of the bbox dynamically here
  return {
    framework: query.framework,
    bbox:      bboxToWkt(getBboxFromBounds(bounds))
  }
}

export let getChoroplethParams = (state: RootState['mapper']) => ({
  framework:      state.query.framework,
  indexname:      state.query.indexname,
  polyids:        state.polygons.map(p => p.polyid),
  polyPartitions: [...new Set(state.polygons.map(p => p.partition))], // distinct partitions
})

export let mapperEpics: any = combineEpics(
  fetchPolygonsEpic,
  devEpic,
  // fetchChoroplethEpic,
)
