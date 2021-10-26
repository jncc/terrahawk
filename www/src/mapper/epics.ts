
import { of, concat } from 'rxjs'
import { map, switchMap, catchError, delay, delayWhen, tap, } from 'rxjs/operators'
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
        map(polys => mapperActions.fetchPolygonsCompleted(polys)),
        catchError(e => of(globalActions.errorOccurred(e.message)))),
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
        map(items => mapperActions.fetchChoroplethCompleted(items)),
        catchError(e => of(globalActions.errorOccurred(e.message))),
      ),
      of(globalActions.stopLoading('choropleth')),
    )
  )
)

export let mapperEpics: any = combineEpics(
  fetchPolygonsEpic,
  fetchChoroplethEpic,
)
