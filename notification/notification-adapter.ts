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
  ): Promise<string> =>
    expoNotifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: {
        seconds: interval / MILISECONDS,
        repeats: true,
      },
    });

  const clearIntervalNotification = (id: string): Promise<void> =>
    expoNotifications.cancelScheduledNotificationAsync(id);

  const getIntervalNotifications =
        async (): Promise<IntervalNotification[]> => {
    const notifications =
      await expoNotifications.getAllScheduledNotificationsAsync();
    return notifications.map(toIntervalNotification);
  };

  const clearAllIntervalNotification = (): Promise<void> =>
    expoNotifications.cancelAllScheduledNotificationsAsync();

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
    clearAllIntervalNotification,
  };
};
