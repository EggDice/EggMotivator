import type {
  ExpoNotifications,
} from '@expo/notification/notifications-expo-external'
import type { FunctionComponent } from 'react'
import type { NotificationService } from '@notification/notification'

import { application } from '@core/application'
import { getRoot } from './Root'
import { notificationAdapter } from '@expo/notification/notification-adapter'

interface InternalServices {
  Root: FunctionComponent
  notification: NotificationService
}
interface ExternalServices { ExternalNotifications: ExpoNotifications }

export const main = ({
  run,
  services,
}: {
  run: (services: InternalServices) => FunctionComponent
  services: ExternalServices
}): ReturnType<typeof run> => application<ExternalServices, InternalServices>({
  externalServices: services,
  run,
  configure: ({ ExternalNotifications }) => {
    const notification = notificationAdapter(ExternalNotifications)
    const Root = getRoot({ notification })
    return { Root, notification }
  },
})
