import { marbles } from 'rxjs-marbles/jest';
import { scheduleCommand } from './schedule-command';
import { appStore } from '@app/app-store';

test('It should turn schedule on', marbles((m) => {
  const store = appStore();
  const command = scheduleCommand(store);
  command.scheduleOn({ interval: 5000 });
  m.expect(store.state$).toBeObservable('y', {'y': {
    schedule: { scheduleStatus: 'on', interval: 5000 },
  }});
}));

test('It should turn schedule off', marbles((m) => {
  const store = appStore();
  const command = scheduleCommand(store);
  command.scheduleOff();
  m.expect(store.state$).toBeObservable('n', {'n': {
    schedule: { scheduleStatus: 'off', interval: 0 },
  }});
}));
