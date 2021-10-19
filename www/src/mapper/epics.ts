
import { of } from 'rxjs'
import { map, switchMap, catchError, mapTo, } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import { RootState } from '../state/store'
import { globalActions } from '../global/slice'
import { mapperActions  } from './slice'
import { fetchChoropleth, fetchPolygons } from './api'


let fetchPolygonsEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(mapperActions.mapCenterChanged.type),
  switchMap(() => fetchPolygons(state$.value.mapper.query).pipe(
    map(r => mapperActions.fetchPolygonsCompleted(r.response.polygons)),
    catchError(e => of(mapperActions.fetchPolygonsFailed(e.message))),
  ))
)

let fetchChoroplethEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(mapperActions.fetchPolygonsCompleted.type),
  switchMap(() => fetchChoropleth(state$.value.mapper).pipe(
    map(r => mapperActions.fetchChoroplethCompleted(r.response)),
    catchError(e => of(globalActions.showError(e.message))),
  ))
)

let startLoadingEpic = (action$: any) => action$.pipe(
  ofType(
    mapperActions.mapCenterChanged.type,
    mapperActions.fetchPolygonsCompleted.type,
  ),
  mapTo(globalActions.startLoading())
)

let stopLoadingEpic = (action$: any) => action$.pipe(
  ofType(
    mapperActions.fetchPolygonsCompleted.type,
    mapperActions.fetchPolygonsFailed.type,
    mapperActions.fetchChoroplethCompleted.type,
    mapperActions.fetchChoroplethFailed.type,
  ),
  mapTo(globalActions.stopLoading())
)

let showErrorEpic = (action$: any) => action$.pipe(
  ofType(
    mapperActions.fetchPolygonsFailed.type,
    mapperActions.fetchChoroplethFailed.type,
  ),
  map((a: any) => globalActions.showError(a.payload))
)

export let mapperEpics: any = combineEpics(
  fetchPolygonsEpic,
  fetchChoroplethEpic,
  startLoadingEpic,
  stopLoadingEpic,
  showErrorEpic,
)
