import { filter } from 'rxjs/operators'

import type { OperatorFunction, Observable } from 'rxjs'
import type { StoreEvent } from '@core/store'

export type CoreEffectFunction<T extends StoreEvent> =
 (event$: Observable<T>) => Observable<T>

export interface CoreEffect<T extends StoreEvent> {
  [key: string]: CoreEffectFunction<T>
}

export const filterByType = <
  ALL_EVENTS extends StoreEvent,
  TYPE_STRING = string,
  EVENT extends StoreEvent = Extract<{ type: TYPE_STRING }, ALL_EVENTS>,
> (selectedType: TYPE_STRING): OperatorFunction<StoreEvent, EVENT> =>
    filter(({ type }) => type === selectedType) as OperatorFunction<StoreEvent, EVENT>
