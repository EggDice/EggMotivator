import { alertSlice } from './alert-store';

import { coreMarbles } from '@core/marbles';
import { createCoreStore } from '@core/store';

test('Default state is loading', coreMarbles((m) => {
  const slice = alertSlice();
  const store = createCoreStore({ alert: slice.reducer });
  m.expect(store.state$).toBeObservable('0', {'0': {
    alert: {
      display: [],
    }
  }});
}));

test('Add new alert', () => {
  jest
    .useFakeTimers()
    .setSystemTime(new Date('2022-01-13T16:21:38.123Z').getTime());
  const { reducer, eventCreators: { showAlert } } = alertSlice();
  const initialState = {
    display: [],
  };
  const state = reducer(initialState, showAlert({
    message: 'Something bad happened',
  }));
  expect(state).toEqual({
    display: [{
      message: 'Something bad happened',
      timestamp: '2022-01-13T16:21:38.123Z',
    }],
  });
});
