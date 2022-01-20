import { Observable, Subject } from 'rxjs'
import { mergeAll } from 'rxjs/operators'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import type { SliceCaseReducers } from '@reduxjs/toolkit'

export interface CoreStore<ALL_STATE, ALL_EVENT> {
  state$: Observable<ALL_STATE>
  send: (event: ALL_EVENT) => void
  registerEffect: (effect: CoreEffect<ALL_EVENT>) => void
}

export type CoreReducer<STATE, EVENT extends StoreEvent = StoreEvent> = (
  state: STATE | undefined,
  event: EVENT
) => STATE

export type CoreReducersObject<ALL_STATE, ALL_EVENT extends StoreEvent> = {
  [KEY in keyof ALL_STATE]: CoreReducer<ALL_STATE[KEY], ALL_EVENT>;
}

export interface StoreEvent<TYPE = any> {
  type: TYPE
}

export interface PayloadStoreEvent<
  TYPE = any,
  PAYLOAD = any,
> extends StoreEvent<TYPE> {
  payload: PAYLOAD
}

export type CoreCaseReducer<
  STATE,
  EVENT extends StoreEvent = StoreEvent,
> = (
  state: STATE,
  event: EVENT
) => STATE

export interface CoreCaseReducersObject<STATE> {
  [KEY: string]: CoreCaseReducer<STATE, StoreEvent>
  | CoreCaseReducer<STATE, PayloadStoreEvent>
}

export interface CoreStoreConfig<
  STATE,
  CASE_REDUCERS extends CoreCaseReducersObject<STATE>,
> {
  name: string
  initialState: STATE
  reducers: CASE_REDUCERS
};

export type StoreEventCreator<EVENT> =
  EVENT extends { type: infer TYPE, payload: infer PAYLOAD } ?
      (payload: PAYLOAD) => PayloadStoreEvent<TYPE, PAYLOAD>:
      () => EVENT

export type StoreEventCreators<
  STATE,
  CASE_REDUCERS extends CoreCaseReducersObject<STATE>,
> = {
  [KEY in keyof CASE_REDUCERS]:
  CASE_REDUCERS[KEY] extends (state: any, event: infer EVENT) => any ?
    StoreEventCreator<EVENT> :
    StoreEventCreator<StoreEvent>
}

export interface CoreStoreSlice<
  STATE,
  CASE_REDUCERS extends CoreCaseReducersObject<STATE>,
> {
  name: string
  reducer: CoreReducer<STATE>
  eventCreators: StoreEventCreators<STATE, CASE_REDUCERS>
};

export type CoreEffect<EVENT> =
  (event$: Observable<EVENT>) => Observable<EVENT>

export const createCoreStore = <
  STATE,
  EVENT extends StoreEvent | PayloadStoreEvent,
> (reducer: CoreReducersObject<STATE, EVENT>): CoreStore<STATE, EVENT> => {
  const store = configureStore({ reducer })
  const event$ = new Subject<EVENT>()
  const event$$ = new Subject<Observable<EVENT>>()
  event$$.pipe(mergeAll()).subscribe((event) => store.dispatch(event))
  event$$.next(event$)
  return {
    state$: new Observable(subscriber => {
      subscriber.next(store.getState())
      store.subscribe(() => {
        subscriber.next(store.getState())
      })
    }),
    send: (action) => {
      event$.next(action)
    },
    registerEffect: (effect) => {
      event$$.next(effect(event$))
    },
  }
}

export const createCoreStoreSlice = <
  STATE,
  CASE_REDUCERS extends CoreCaseReducersObject<STATE>,
> (config: CoreStoreConfig<STATE, CASE_REDUCERS>):
  CoreStoreSlice<STATE, CASE_REDUCERS> => {
  const {
    name,
    reducer,
    actions,
  } = createSlice({
    name: config.name,
    initialState: config.initialState,
    reducers: config.reducers as SliceCaseReducers<STATE>,
  })
  return {
    name,
    reducer: reducer as CoreReducer<STATE, StoreEvent>,
    eventCreators: actions as
        unknown as StoreEventCreators<STATE, CASE_REDUCERS>,
  }
}
