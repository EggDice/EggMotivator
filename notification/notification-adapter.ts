import { from } from 'rxjs';
import type { Observable } from 'rxjs';

import type {
  NotificationRequest,
  TimeIntervalNotificationTrigger,
} from 'expo-notifications';
import type { ExpoNotifications } from './notifications-expo-external';
import type {
  NotificationService,
  IntervalNotificationSchedule,
  IntervalNotification,
} from './notification';

const MILISECONDS: number = 1000;

export const notificationAdapter =
    (expoNotifications: ExpoNotifications): NotificationService => {
  expoNotifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const setIntervalNotification = (
    { title, body, interval }: IntervalNotificationSchedule
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
    })
  );

  const clearIntervalNotification = (id: string): Observable<void> => from(
    expoNotifications.cancelScheduledNotificationAsync(id)
  );

  const getIntervalNotifications =
      (): Observable<IntervalNotification[]> => from((async() => {
    const notifications =
      await expoNotifications.getAllScheduledNotificationsAsync();
    return notifications.map(toIntervalNotification);
  })());

  const clearAllIntervalNotifications = (): Observable<void> => from(
    expoNotifications.cancelAllScheduledNotificationsAsync()
  );

  const toIntervalNotification = ({
      content: { title, body },
      trigger,
      identifier,
    }: NotificationRequest) => ({
      title: title as string,
      body: body as string,
      interval: getInterval(trigger as TimeIntervalNotificationTrigger),
      id: identifier,
    });

  const getInterval =
    (trigger: TimeIntervalNotificationTrigger): number =>
      trigger.seconds * MILISECONDS;

  return {
    setIntervalNotification,
    clearIntervalNotification,
    getIntervalNotifications,
    clearAllIntervalNotifications,
  };
};
