import { throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
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

test('init should show an error if unable to read notifications',
     coreMarbles((m) => {
  const error = new Error('Unable to check if notifications are scheduled');
  const { schedule } = createFeature({
    getIntervalNotifications: { type: 'observable', error }
  });
  schedule.initialize();
  m.expect(schedule.isLoaded$).toBeObservable(m.coldBoolean('ft'));
  m.expect(schedule.isOn$).toBeObservable(m.coldBoolean('ff'));
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
  return { schedule, notificationService };
};
