import { from, throwError } from 'rxjs'
import type { Observable, MonoTypeOperatorFunction } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { CoreError } from '@core/error'

import type {
  NotificationRequest,
  TimeIntervalNotificationTrigger,
} from 'expo-notifications'
import type { ExpoNotifications } from './notifications-expo-external'
import type {
  NotificationService,
  IntervalNotificationSchedule,
  IntervalNotification,
} from '@notification/notification'

const MILISECONDS: number = 1000

export const notificationAdapter =
    (expoNotifications: ExpoNotifications): NotificationService => {
      expoNotifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      })

      const setIntervalNotification = (
        { title, body, interval }: IntervalNotificationSchedule,
      ): Observable<string> => from(
        expoNotifications.scheduleNotificationAsync({
          content: {
            title,
            body,
          },
          trigger: {
            seconds: interval / MILISECONDS,
            repeats: true,
          },
        }),
      ).pipe(
        rethrowError('Could not schedule notification'),
      )

      const clearIntervalNotification = (id: string): Observable<void> => from(
        expoNotifications.cancelScheduledNotificationAsync(id),
      ).pipe(
        rethrowError('Could not clear notification'),
      )

      const getIntervalNotifications =
      (): Observable<IntervalNotification[]> =>
        from(expoNotifications.getAllScheduledNotificationsAsync()).pipe(
          map((notifications) => notifications.map(toIntervalNotification)),
          rethrowError('Unable to check the scheduled notifications'),
        )

      const clearAllIntervalNotifications = (): Observable<void> => from(
        expoNotifications.cancelAllScheduledNotificationsAsync(),
      ).pipe(
        rethrowError('Could not clear notifications'),
      )

      const rethrowError = <T>(message: string): MonoTypeOperatorFunction<T> =>
        catchError((cause) => throwError(() => new CoreError(message, { cause })))

      const toIntervalNotification = ({
        content: { title, body },
        trigger,
        identifier,
      }: NotificationRequest): IntervalNotification => ({
        title: title as string,
        body: body as string,
        interval: getInterval(trigger as TimeIntervalNotificationTrigger),
        id: identifier,
      })

      const getInterval =
    (trigger: TimeIntervalNotificationTrigger): number =>
      trigger.seconds * MILISECONDS

      return {
        setIntervalNotification,
        clearIntervalNotification,
        getIntervalNotifications,
        clearAllIntervalNotifications,
      }
    }
