import type {
  NotificationHandler,
  NotificationRequestInput
} from 'expo-notifications';

export type ExpoNotifications = {
  setNotificationHandler:
    (handler: NotificationHandler) => void,
  scheduleNotificationAsync:
    (request: NotificationRequestInput) => Promise<string>,
};
