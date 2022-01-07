import { marbles } from 'rxjs-marbles/jest';
import { scheduleQuery } from './schedule-query';
import type { AppStore } from '@app/app-store';

test('isLoaded$ should be false if initial', marbles((m) => {
  const { isLoaded$ } = scheduleQuery({
    state$:
      m.cold('iyn', STATE_VALUES),
  } as unknown as AppStore);
  m.expect(isLoaded$).toBeObservable('ftt', BOOLEAN_VALUES);
}));

test('isOn$ should be true on on', marbles((m) => {
  const { isOn$ } = scheduleQuery({
    state$:
      m.cold('iyn', STATE_VALUES),
  } as unknown as AppStore);
  m.expect(isOn$).toBeObservable('ftf', BOOLEAN_VALUES);
}));

const scheduleStatus = (value: string) => ({
  schedule: {
    scheduleStatus: value,
  },
});

const STATE_VALUES = {
  'i': scheduleStatus('initial'),
  'y': scheduleStatus('on'),
  'n': scheduleStatus('off'),
};

const BOOLEAN_VALUES = {
  'f': false,
  't': true,
}


