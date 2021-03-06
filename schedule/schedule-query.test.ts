import { coreMarbles } from '@core/marbles'
import { scheduleQuery } from './schedule-query'
import type { AppStore, AppStoreState } from '@app/app-store'
import type { ScheduleStatus } from './schedule-store'

test('isLoaded$ should be false if initial', coreMarbles((m) => {
  const { isLoaded$ } = scheduleQuery({
    state$: m.cold('iyn', STATE_VALUES),
  } as unknown as AppStore)
  m.expect(isLoaded$).toBeObservable(m.coldBoolean('ftt'))
}))

test('isOn$ should be true on on', coreMarbles((m) => {
  const { isOn$ } = scheduleQuery({
    state$: m.cold('iyn', STATE_VALUES),
  } as unknown as AppStore)
  m.expect(isOn$).toBeObservable(m.coldBoolean('ftf'))
}))

const scheduleStatus = (value: ScheduleStatus): Partial<AppStoreState> => ({
  schedule: {
    scheduleStatus: value,
    interval: 0,
  },
})

const STATE_VALUES = {
  i: scheduleStatus('initial'),
  y: scheduleStatus('on'),
  n: scheduleStatus('off'),
}
