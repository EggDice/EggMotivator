import type {
  ExpoNotifications,
} from '@expo-app/notification/notifications-expo-external'
import type { FunctionComponent } from 'react'
import type { NotificationService } from '@notification/notification'
import type { ScheduleFeature } from '@schedule/schedule-feature'
import type { AppStore } from '@app/app-store'

import { application } from '@core/application'
import { getRoot } from './Root'
import {
  notificationAdapter,
} from '@expo-app/notification/notification-adapter'
import { createSchedule } from '@schedule/schedule-feature'
import { appStore } from '@app/app-store'

interface InternalServices {
  Root: FunctionComponent
  notificationService: NotificationService
  schedule: ScheduleFeature
  store: AppStore
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
    const notificationService = notificationAdapter(ExternalNotifications)
    const store = appStore()
    const schedule = createSchedule({ store, notificationService })
    const Root = getRoot({ schedule })
    return { Root, notificationService, schedule, store }
  },
})
