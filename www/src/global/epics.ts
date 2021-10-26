
import { timer ,  } from 'rxjs'
import { combineEpics, ofType, } from 'redux-observable'
import { mapTo, tap, delay, debounceTime, ignoreElements, map, } from 'rxjs/operators'

import { globalActions } from './slice'

let errorMessageEpic = (action$: any) => action$.pipe(
  ofType(globalActions.errorOccurred.type),
  map((a: any) => globalActions.showError(a.payload)),
  // delay(5000),
  // mapTo(globalActions.hideError())
)

let devEpic =  (action$: any) => action$.pipe(
  tap(console.log),
  ignoreElements(),
)

let pingEpic = (action$: any) => action$.pipe(
  // tap(console.log),
  ofType(globalActions.ping.type),
  debounceTime(500),
  delay(1000),
  mapTo(globalActions.pong()),
)

export let globalEpics: any = combineEpics(
  devEpic,
  errorMessageEpic,
  pingEpic,
)
