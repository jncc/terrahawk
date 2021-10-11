
import { timer  } from 'rxjs'
import { combineEpics, ofType } from 'redux-observable'
import { mapTo, tap, delay, debounceTime, } from 'rxjs/operators'

import { globalActions } from './slice'

let pingEpic = (action$: any) => action$.pipe(
  // tap(console.log),
  ofType(globalActions.ping.type),
  debounceTime(500),
  delay(1000),
  mapTo(globalActions.pong()),
)

let errorMessageEpic = (action$: any) => action$.pipe(
  ofType(globalActions.showError.type),
  delay(5000),
  mapTo(globalActions.hideError())
)

export let globalEpics: any = combineEpics(
  pingEpic,
  errorMessageEpic,
)
