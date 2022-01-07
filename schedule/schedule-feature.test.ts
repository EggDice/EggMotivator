import { of, from, firstValueFrom } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { appStore } from '@app/app-store';
import {
  fakeNotificationService
} from '@notification/fake-notification-service';
import { createSchedule } from './schedule-feature';

test('init with no notifications scheduled', marbles((m) => {
  const store = appStore();
  const notificationService = fakeNotificationService();
  const schedule = createSchedule({ store, notificationService });
  schedule.initialize();
  m.expect(schedule.isLoaded$).toBeObservable('ft', {f: false, t: true});
  m.expect(schedule.isOn$).toBeObservable('ff', {f: false, t: true});
}));

test('init should recognize old notifications scheduled', marbles((m) => {
  const store = appStore();
  const notificationService = fakeNotificationService();
  notificationService.setIntervalNotification({
    title: '',
    body: '',
    interval: 5000,
  });
  const schedule = createSchedule({ store, notificationService });
  schedule.initialize();
  m.expect(schedule.isLoaded$).toBeObservable('ft', {f: false, t: true});
  m.expect(schedule.isOn$).toBeObservable('ft', {f: false, t: true});
}));


