
import { of, concat } from 'rxjs'
import { tap, delay, ignoreElements, concatMap, } from 'rxjs/operators'
import { combineEpics, ofType, } from 'redux-observable'

import { globalActions } from './slice'

let errorMessageEpic = (action$: any) => action$.pipe(
  ofType(globalActions.errorOccurred.type),
  concatMap((a: any, index: number) =>
    concat(
      of(globalActions.showError(`${a.payload} (${index})`)),
      of(globalActions.hideError()).pipe(delay(5000))
    )
  ),
)

let devEpic =  (action$: any) => action$.pipe(
  tap(console.log),
  ignoreElements(),
)

export let globalEpics: any = combineEpics(
  devEpic,
  errorMessageEpic,
)
