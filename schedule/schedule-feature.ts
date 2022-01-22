import { scheduleQuery } from './schedule-query'
import { scheduleCommand } from './schedule-command'
import { scheduleEffect } from './schedule-effect'

import type { Observable } from 'rxjs'
import type {
  NotificationService,
} from '@notification/notification'
import type { AppStore } from '@app/app-store'

export interface ScheduleFeature {
  isOn$: Observable<boolean>
  isLoaded$: Observable<boolean>
  initialize: () => void
  switchOn: (arg: { interval: number }) => void
  switchOff: () => void
}

interface ScheduleFeatureArgs {
  store: AppStore
  notificationService: NotificationService
}

export const createSchedule =
    ({ store, notificationService }: ScheduleFeatureArgs): ScheduleFeature => {
      const query = scheduleQuery(store)
      const { initialize, switchOn, switchOff } = scheduleCommand(store)
      const {
        handleInitialize,
        handleSwitchOn,
        handleSwitchOff,
      } = scheduleEffect({ notificationService })
      store.registerEffect(handleInitialize)
      store.registerEffect(handleSwitchOn)
      store.registerEffect(handleSwitchOff)

      return {
        switchOn,
        switchOff,
        initialize,
        ...query,
      }
    }
