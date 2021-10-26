
import { of, concat } from 'rxjs'
import { map, switchMap, catchError, delay, delayWhen } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import { RootState } from '../state/store'
import { globalActions } from '../global/slice'
import { mapperActions  } from './slice'
import { fetchChoropleth, fetchPolygons } from './api'


let fetchPolygonsEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(mapperActions.mapCenterChanged.type),
  switchMap(() =>
    concat(
      of(globalActions.startLoading('polygons')),
      fetchPolygons(state$.value.mapper.query).pipe(
        map(r => mapperActions.fetchPolygonsCompleted(r.response.polygons)),
        catchError(e => of(mapperActions.fetchPolygonsFailed(e.message)))),
      of(globalActions.stopLoading('polygons')),
    )
  )
)

let fetchChoroplethEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(mapperActions.fetchPolygonsCompleted.type),
  switchMap(() =>
    concat(
      of(globalActions.startLoading('choropleth')),
      fetchChoropleth(state$.value.mapper).pipe(
        map(r => mapperActions.fetchChoroplethCompleted(r.response)),
        catchError(e => of(globalActions.showError(e.message))),
      ),
      of(globalActions.stopLoading('choropleth')),
    )
  )
)

// replace with global error action
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
