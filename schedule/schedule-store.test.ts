import { marbles } from 'rxjs-marbles/jest';
import { createCoreStore } from '@core/store';
import { scheduleSlice } from './schedule-store';
import type {
  ScheduleState,
} from './schedule-store';

test('Default state is loading', marbles((m) => {
  const slice = scheduleSlice();
  const store = createCoreStore({schedule: slice.reducer});
  m.expect(store.state$).toBeObservable(m.cold('L', {'L': {
    schedule: {
      scheduleStatus: 'initial',
      interval: 0,
    },
  }}));
}));

test('Set schedule to off', () => {
  const { reducer, eventCreators: { setSchedule } } = scheduleSlice();
  const initialState: ScheduleState = {
    scheduleStatus: 'initial',
    interval: 0,
  };
  const state = reducer(initialState, setSchedule({
    scheduleStatus: 'off',
  }));
  expect(state).toEqual({
    scheduleStatus: 'off',
    interval: 0,
  });
});

test('Set schedule to on', () => {
  const { reducer, eventCreators: { setSchedule } } = scheduleSlice();
  const initialState: ScheduleState = {
    scheduleStatus: 'initial',
    interval: 0,
  };
  const state = reducer(initialState, setSchedule({
    scheduleStatus: 'on',
    interval: 5000,
  }));
  expect(state).toEqual({
    scheduleStatus: 'on',
    interval: 5000,
  });
});