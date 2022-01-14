import { throwError, timer } from 'rxjs';
import { mergeMap, map, distinctUntilChanged } from 'rxjs/operators';
import { coreMarbles } from '@core/marbles';
import { appStore } from '@app/app-store';
import {
  fakeNotificationService
} from '@notification/fake-notification-service';
import { createSchedule } from './schedule-feature';

test('init with no notifications scheduled', coreMarbles((m) => {
  const { schedule } = createFeature();
  schedule.initialize();
  m.expect(schedule.isLoaded$).toBeObservable(m.coldBoolean('ft'));
  m.expect(schedule.isOn$).toBeObservable(m.coldBoolean('ff'));
}));

test('init should recognize old notifications scheduled', coreMarbles((m) => {
  const { schedule, notificationService, } = createFeature();
  notificationService.setIntervalNotification({
    title: '',
    body: '',
    interval: 5000,
  });
  schedule.initialize();
  m.expect(schedule.isLoaded$).toBeObservable(m.coldBoolean('ft'));
  m.expect(schedule.isOn$).toBeObservable(m.coldBoolean('ft'));
}));

test('init should set it off if unable to read notifications',
     coreMarbles((m) => {
  const error = new Error('Unable to check if notifications are scheduled');
  const { schedule, } = createFeature({
    getIntervalNotifications: { type: 'observable', error }
  });
  schedule.initialize();
  const isLoaded$ = schedule.isLoaded$.pipe(distinctUntilChanged());
  m.expect(isLoaded$).toBeObservable(m.coldBoolean('ft'));
  const isOn$ = schedule.isOn$.pipe(distinctUntilChanged());
  m.expect(isOn$).toBeObservable(m.coldBoolean('f'));
}));

test('init should show an alert if unable to read notifications',
     coreMarbles((m) => {
  jest
    .useFakeTimers()
    .setSystemTime(new Date('2022-01-13T16:21:38.123Z').getTime());
  const error = new Error('Unable to check if notifications are scheduled');
  const { schedule, store, } = createFeature({
    getIntervalNotifications: { type: 'observable', error }
  });
  schedule.initialize();
  const alertState$ = store.state$.pipe(
    map(({ alert }) => alert),
    distinctUntilChanged(),
  );
  m.expect(alertState$).toBeObservable('01', {
    '0': {
      display: [],
    },
    '1': {
      display: [{
        message: 'Could not check scheduled notifications',
        timestamp: '2022-01-13T16:21:38.123Z',
      }],
    },
  });
}));

test('init should log if unable to read notifications',
     coreMarbles((m) => {
  jest
    .useFakeTimers()
    .setSystemTime(new Date('2022-01-13T16:21:38.123Z').getTime());
  const error = new Error('Unable to check if notifications are scheduled');
  const { schedule, store, } = createFeature({
    getIntervalNotifications: { type: 'observable', error }
  });
  schedule.initialize();
  const metricState$ = store.state$.pipe(
    map(({ metric }) => metric),
    distinctUntilChanged(),
  );
  m.expect(metricState$).toBeObservable('01', {
    '0': {
      toLog: [],
    },
    '1': {
      toLog: [{
        type: 'ERROR_NOTIFICATIONS_UNABLE_TO_LOAD',
        level: 'error',
        payload: { exception: error },
        timestamp: '2022-01-13T16:21:38.123Z',
      }],
    },
  });
}));

test('turn on and off the schedule', coreMarbles((m) => {
  const { schedule } = createFeature();
  m.coldCall('tf', {
    t: () => schedule.on({ interval: 5000 }),
    f: () => schedule.off(),
  });
  m.expect(schedule.isLoaded$).toBeObservable(m.coldBoolean('tt'));
  m.expect(schedule.isOn$).toBeObservable(m.coldBoolean('tf'));
}));

const createFeature = (configs = {}) => {
  const store = appStore();
  const notificationService = fakeNotificationService(configs);
  const schedule = createSchedule({ store, notificationService });
  return { schedule, store, notificationService };
};
