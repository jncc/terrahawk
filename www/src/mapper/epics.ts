
import { of, concat } from 'rxjs'
import { map, switchMap, catchError, mapTo, delay, } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import { RootState } from '../state/store'
import { globalActions } from '../global/slice'
import { mapperActions  } from './slice'
import { fetchChoropleth, fetchPolygons } from './api'


let fetchPolygonsEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(mapperActions.mapCenterChanged.type),
  switchMap(() =>
    concat(
      of(globalActions.startLoading('fetchPolygons')),
      fetchPolygons(state$.value.mapper.query).pipe(
        map(r => mapperActions.fetchPolygonsCompleted(r.response.polygons)),
        catchError(e => of(mapperActions.fetchPolygonsFailed(e.message)))),
      of(globalActions.stopLoading('fetchPolygons')),
    )
  )
)

let fetchChoroplethEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(mapperActions.fetchPolygonsCompleted.type),
  switchMap(() =>
    concat(
      of(globalActions.startLoading('fetchChoropleth')),
      fetchChoropleth(state$.value.mapper).pipe(
        map(r => mapperActions.fetchChoroplethCompleted(r.response)),
        catchError(e => of(globalActions.showError(e.message))),
      ),
      of(globalActions.stopLoading('fetchChoropleth')),
    )
  )
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
  showErrorEpic,
)
