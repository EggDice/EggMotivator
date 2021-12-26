import type { ExpoNotifications } from './notifications-expo-external';
import type {
  NotificationService,
  IntervalNotificationSchedule,
} from './notification';

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
        seconds: interval / 1000,
      },
    });

  return { setIntervalNotification };
};
