import { appStore } from './app-store';
import { coreMarbles } from '@core/marbles';
import { map } from 'rxjs/operators';

test('Should have schedule', coreMarbles((m) => {
  const store = appStore();
  const keys$ = store.state$.pipe(map((state) =>
    Object.keys(state).filter((key) => key === 'schedule')));
  m.expect(keys$).toBeObservable('s', {'s': ['schedule']});
}));

test('Should have alert', coreMarbles((m) => {
  const store = appStore();
  const keys$ = store.state$.pipe(map((state) =>
    Object.keys(state).filter((key) => key === 'alert')));
  m.expect(keys$).toBeObservable('a', {'a': ['alert']});
}));

test('Should have metric', coreMarbles((m) => {
  const store = appStore();
  const keys$ = store.state$.pipe(map((state) =>
    Object.keys(state).filter((key) => key === 'metric')));
  m.expect(keys$).toBeObservable('m', {'m': ['metric']});
}));
