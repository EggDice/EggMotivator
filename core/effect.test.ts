import { filterByType } from './effect'
import { coreMarbles } from '@core/marbles'
import { map } from 'rxjs/operators'
import type { StoreEvent, PayloadStoreEvent } from '@core/store'
import type { Observable } from 'rxjs'

test('type safe filtering', coreMarbles((m) => {
  type EVENT_1 = PayloadStoreEvent<'event-1', number>
  type EVENT_2 = StoreEvent<'event-2'>
  type ALL = EVENT_1 | EVENT_2
  const event$: Observable<ALL> = m.cold('-12', {
    1: { type: 'event-1', payload: 1 },
    2: { type: 'event-2' },
  })
  const filtered$: Observable<number> = event$.pipe(
    filterByType<ALL>('event-1'),
    map(({ payload }) => payload),
  )
  m.expect(filtered$).toBeObservable('-1-', { 1: 1 })
}))
