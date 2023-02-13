
import { of, concat } from 'rxjs'
import { map, filter, switchMap, catchError, } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import { RootState } from '../../state/store'
import { globalActions } from '../global/slice'
import { mapperActions  } from './slice'
import { fetchPolygons, fetchChoropleth, fetchPolygon, fetchHabitats } from './api'
import { frameworks } from '../../frameworks'

let fetchPolygonsEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(
    mapperActions.mapZoomChanged.type,
    mapperActions.mapCenterChanged.type,
    mapperActions.alterQueryFramework.type,
  ),
  filter(() => state$.value.mapper.zoomedEnoughToShowPolygons),
  switchMap(() =>
    concat(
      of(globalActions.startLoading('polygons')),
      fetchPolygons(state$.value.mapper.query, state$.value.mapper.currentFramework).pipe(
        map(result => mapperActions.fetchPolygonsCompleted(result)),
        catchError(e => of(globalActions.errorOccurred(e.message)))),
      of(globalActions.stopLoading('polygons')),
    )
  )
)

let fetchChoroplethEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(
    mapperActions.fetchPolygonsCompleted.type,
    mapperActions.alterQueryFramework.type,
    mapperActions.alterQueryIndexname.type,
    mapperActions.alterQueryYearFrom.type,
    mapperActions.alterQueryMonthFrom.type,
    mapperActions.alterQueryYearTo.type,
    mapperActions.alterQueryMonthTo.type,
    mapperActions.incrementQueryPeriodByOneMonth.type,
    mapperActions.decrementQueryPeriodByOneMonth.type,
  ),
  switchMap(() =>
    concat(
      of(globalActions.startLoading('choropleth')),
      fetchChoropleth(state$.value.mapper).pipe(
        map(result => mapperActions.fetchChoroplethCompleted(result)),
        catchError(e => of(globalActions.errorOccurred(e.message))),
      ),
      of(globalActions.stopLoading('choropleth')),
    )
  )
)

let fetchPolygonStatsEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(
    mapperActions.selectPolygon.type,
    mapperActions.alterQueryIndexname.type,
  ),
  filter(()  => state$.value.mapper.selectedPolygon !== undefined),
  switchMap(() =>
    concat(
      of(globalActions.startLoading('polygon')),
      fetchPolygon(state$.value.mapper).pipe(
        map(result => mapperActions.fetchPolygonCompleted(result)),
        catchError(e => of(globalActions.errorOccurred(e.message)))),
      of(globalActions.stopLoading('polygon')),
    )
  )
)

// Field data not currently available
/* let fetchFieldDataEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(
    mapperActions.mapZoomChanged.type,
    mapperActions.mapCenterChanged.type,
  ),
  filter(() => state$.value.mapper.zoomedEnoughToShowPolygons),
  switchMap(() =>
    concat(
      of(globalActions.startLoading('fieldData')),
      fetchFieldData(state$.value.mapper.query).pipe(
        map(result => mapperActions.fetchFieldDataCompleted(result)),
        catchError(e => of(globalActions.errorOccurred(e.message)))),
      of(globalActions.stopLoading('fieldData')),
    )
  )
) */

let fetchHabitatsEpic = (action$: any, state$: StateObservable<RootState>) => action$.pipe(
  ofType(
    mapperActions.initialise.type,
  ),
  switchMap(() =>
    concat(
      of(globalActions.startLoading('habitats')),
      ...Object.values(frameworks).map(framework => 
        fetchHabitats(framework).pipe(
          map(result => mapperActions.fetchHabitatsCompleted(result)),
          catchError(e => of(globalActions.errorOccurred(e.message)))
        )
      ),        
      of(globalActions.stopLoading('habitats')),
    )
  )
)

export let mapperEpics: any = combineEpics(
  fetchPolygonsEpic,
  fetchChoroplethEpic,
  fetchPolygonStatsEpic,
  //fetchFieldDataEpic,
  fetchHabitatsEpic
)
