import { throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs';
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

test('init should show an error if unable to read notifications',
     marbles((m) => {
  const store = appStore();
  const notificationService = fakeNotificationService();
  notificationService.getIntervalNotifications = () =>
    timer(1).pipe(mergeMap(() => throwError(() =>
      new Error('Unable to check if notifications are scheduled')
    )));
  const schedule = createSchedule({ store, notificationService });
  schedule.initialize();
  m.expect(schedule.isLoaded$).toBeObservable('ft', {f: false, t: true});
  m.expect(schedule.isOn$).toBeObservable('ff', {f: false, t: true});
}));

test('turn on and off the schedule', marbles((m) => {
  const store = appStore();
  const notificationService = fakeNotificationService();
  const schedule = createSchedule({ store, notificationService });
  m.cold('tf', {t: true, f: false}).subscribe(isOn => isOn ?
    schedule.on({ interval: 5000 }):
    schedule.off()
  );
  m.expect(schedule.isLoaded$).toBeObservable('tt', {f: false, t: true});
  m.expect(schedule.isOn$).toBeObservable('tf', {f: false, t: true});
}));
