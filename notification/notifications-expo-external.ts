import type {
  NotificationHandler,
  NotificationRequest,
  NotificationRequestInput,
} from 'expo-notifications'

export interface ExpoNotifications {
  setNotificationHandler:
  (handler: NotificationHandler) => void
  scheduleNotificationAsync:
  (request: NotificationRequestInput) => Promise<string>
  cancelScheduledNotificationAsync:
  (id: string) => Promise<void>
  cancelAllScheduledNotificationsAsync: () => Promise<void>
  getAllScheduledNotificationsAsync: () => Promise<NotificationRequest[]>
}
