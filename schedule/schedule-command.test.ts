import { scheduleCommand } from './schedule-command';
import { map } from 'rxjs/operators';
import { coreMarbles } from '@core/marbles';
import { appStore } from '@app/app-store';

test('It should turn schedule on', coreMarbles((m) => {
  const store = appStore();
  const command = scheduleCommand(store);
  command.on({ interval: 5000 });
  const scheduleState$ = store.state$.pipe(map(({ schedule }) => schedule));
  m.expect(scheduleState$).toBeObservable('y', {'y': {
    scheduleStatus: 'on', interval: 5000,
  }});
}));

test('It should turn schedule off', coreMarbles((m) => {
  const store = appStore();
  const command = scheduleCommand(store);
  command.off();
  const scheduleState$ = store.state$.pipe(map(({ schedule }) => schedule));
  m.expect(scheduleState$).toBeObservable('n', {'n': {
    scheduleStatus: 'off', interval: 0,
  }});
}));
