import { metricSlice } from './metric-store';

import { coreMarbles } from '@core/marbles';
import { createCoreStore } from '@core/store';

test('Default state is loading', coreMarbles((m) => {
  const slice = metricSlice();
  const store = createCoreStore({ metric: slice.reducer });
  m.expect(store.state$).toBeObservable('0', {'0': {
    metric: {
      toLog: [],
    }
  }});
}));

test('Add new metric', () => {
  const { reducer, eventCreators: { pushMetric } } = metricSlice();
  const initialState = {
    toLog: [],
  };
  const state = reducer(initialState, pushMetric({
    type: 'metric',
    timestamp: '2022-01-13T16:21:38Z',
    level: 'info',
    payload: 1,
  }));
  expect(state).toEqual({
    toLog: [{
      type: 'metric',
      timestamp: '2022-01-13T16:21:38Z',
      level: 'info',
      payload: 1,
    }],
  });
});

