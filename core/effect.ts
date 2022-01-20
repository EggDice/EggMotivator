import { filter } from 'rxjs/operators'

import type { OperatorFunction } from 'rxjs'
import type { StoreEvent } from '@core/store'

export const filterByType = <
  ALL_EVENTS extends StoreEvent,
  TYPE_STRING = string,
  EVENT extends StoreEvent = Extract<{ type: TYPE_STRING }, ALL_EVENTS>,
> (selectedType: TYPE_STRING): OperatorFunction<StoreEvent, EVENT> =>
    filter(({ type }) => type === selectedType) as OperatorFunction<StoreEvent, EVENT>
