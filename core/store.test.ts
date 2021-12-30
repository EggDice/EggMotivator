import { Observable } from 'rxjs';
import { marbles, fakeSchedulers } from "rxjs-marbles/jest";
import { createCoreStore, createCoreStoreSlice } from './store';
import type { CoreReducer } from './store';

type CountState = number;

type AppendState = string;

interface TestIncrement {
  type: 'count/increment';
};

interface TestIncrementAmount {
  type: 'count/incrementAmount';
  payload: number;
};

interface TestAppendA {
  type: 'append/appendA';
}

type AllTestEvents = TestIncrement | TestIncrementAmount | TestAppendA;

interface AllCountState {
  count: CountState;
};

interface AllTestState {
  count: CountState;
  append: AppendState;
};

beforeEach(() => jest.useFakeTimers());


test('store has inital state', marbles(m => {
  const initialState: CountState = 0;
  const coreStore = createCoreStore<AllCountState, AllTestEvents>({
    count: (state = initialState, event: AllTestEvents) => {
      return event.type === 'count/increment' ? state + 1 : state;
    }
  });
  m.expect(coreStore.state$).toBeObservable(m.cold('0', {'0': { count: 0 }}));
}));

test('store has incremented state', marbles(m => {
  const initialState: CountState = 0;
  const coreStore = createCoreStore<AllCountState, AllTestEvents>({
    count: (state = initialState, event: AllTestEvents) => {
      return event.type === 'count/increment' ? state + 1 : state;
    }
  });
  coreStore.send({type: 'count/increment'});
  coreStore.send({type: 'count/incrementAmount', payload: 5});
  m.expect(coreStore.state$).toBeObservable(m.cold('1', {'1': { count: 1 }}));
}));

test('create store slice', () => {
  const initialState: CountState = 0;
  const slice = createCoreStoreSlice({
    name: 'count',
    initialState,
    reducers: {
      increment: (state: CountState, event: TestIncrement) => state + 1,
      incrementAmount: (state: CountState, event: TestIncrementAmount) =>
        state + event.payload,
    }
  });
  const reducer: CoreReducer<CountState, AllTestEvents> = slice.reducer;
  const event: TestIncrement = slice.eventCreators.increment();
  const event2: TestIncrementAmount = slice.eventCreators.incrementAmount(5);
  expect(event.type).toEqual('count/increment');
  expect(event2.type).toEqual('count/incrementAmount');
  expect(reducer(initialState, event)).toEqual(1);
  expect(reducer(initialState, event2)).toEqual(5);
});

test('create combined store', marbles(m => {
  const countSlice = createCoreStoreSlice({
    name: 'count',
    initialState: 0,
    reducers: {
      increment: (state: CountState, event: TestIncrement) => state + 1,
      incrementAmount: (state: CountState, event: TestIncrementAmount) =>
        state + event.payload,
    }
  });
  const appendSlice = createCoreStoreSlice({
    name: 'append',
    initialState: '',
    reducers: {
      appendA: (state: AppendState, event: TestAppendA) => state + 'A',
    }
  });
  const coreStore = createCoreStore<AllTestState, AllTestEvents>({
    count: countSlice.reducer,
    append: appendSlice.reducer,
  });

  coreStore.send(countSlice.eventCreators.increment());
  coreStore.send(appendSlice.eventCreators.appendA());
  m.expect(coreStore.state$).toBeObservable(m.cold('1', {'1': {
    count: 1,
    append: 'A',
  }}));

}));
