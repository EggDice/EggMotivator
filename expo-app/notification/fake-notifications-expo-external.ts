import { addErrorMethodsToFake } from '@core/fake'
import type { FakeConfigs } from '@core/fake'
import type {
  NotificationHandler,
  NotificationRequest,
  NotificationRequestInput,
} from 'expo-notifications'
import type { ExpoNotifications } from './notifications-expo-external'

export type ExpoNotificationsFakeConfigs = FakeConfigs<ExpoNotifications>

export const fakeExpoNotifications =
    addErrorMethodsToFake((): ExpoNotifications => {
      let notifications: NotificationRequest[] = []

      return {
        setNotificationHandler:
      (handler: NotificationHandler) => undefined,
        scheduleNotificationAsync:
        async (request: NotificationRequestInput) => {
          const id = String(notifications.length)
          notifications.push({
            content: {
              autoDismiss: true,
              badge: null,
              body: '',
              data: null,
              sound: 'default',
              sticky: false,
              subtitle: null,
              title: '',
              ...request.content,
            },
            identifier: id,
            trigger: {
              channelId: null,
              repeats: false,
              seconds: 0,
              type: 'timeInterval',
              ...(request.trigger as object),
            },
          } as unknown as NotificationRequest)
          return id
        },
        cancelScheduledNotificationAsync: async (id: string) => {
          notifications = notifications.filter((n) => n.identifier !== id)
        },
        cancelAllScheduledNotificationsAsync: async () => {
          notifications.length = 0
        },
        getAllScheduledNotificationsAsync: async () => notifications,
      }
    })
