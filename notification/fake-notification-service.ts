import { of } from 'rxjs';
import { delay } from "rxjs/operators";

import { addErrorMethodsToFake } from '@core/fake';

import type { Observable } from 'rxjs';
import type {
  NotificationService,
  IntervalNotification,
  IntervalNotificationSchedule
} from './notification';

/*
 * Because rxjs-marbles can't handle promises,
 * it is needed to fake the service as well
 */
export const fakeNotificationService =
    addErrorMethodsToFake((): NotificationService => {
  let notifications: IntervalNotification[] = [];
  return {
    setIntervalNotification: (schedule: IntervalNotificationSchedule):
        Observable<string> => {
      const id = String(notifications.length);
      notifications.push({
        ...schedule,
        id,
      });
      return of(id).pipe(delay(1));
    },
    clearIntervalNotification: (id: string): Observable<void> => {
      notifications = notifications.filter((n) => n.id !== id);
      return of(undefined).pipe(delay(1));
    },
    getIntervalNotifications: (): Observable<IntervalNotification[]> =>
      of(notifications).pipe(delay(1)),
    clearAllIntervalNotifications: (): Observable<void> => {
      notifications.length = 0;
      return of(undefined).pipe(delay(1));
    }
  };
});
