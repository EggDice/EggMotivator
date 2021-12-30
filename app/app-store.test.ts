import { appStore } from './app-store';
import { marbles } from 'rxjs-marbles/jest';
import { map } from 'rxjs/operators';

test('Should have schedule', marbles((m) => {
  const store = appStore();
  const keys$ = store.state$.pipe(map((state) =>
    Object.keys(state).filter((key) => key === 'schedule')));
  m.expect(keys$).toBeObservable(m.cold('s', {'s': ['schedule']}));
}));
