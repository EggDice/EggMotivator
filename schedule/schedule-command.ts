import { scheduleSlice } from './schedule-store'
import type { CoreCommand } from '@core/command'
import type { AppStore } from '@app/app-store'

const { eventCreators: { setSchedule } } = scheduleSlice

interface ScheduleCommand extends CoreCommand {
  on: (arg: { interval: number }) => void
  off: () => void
  initialize: () => void
  switchOn: (arg: { interval: number }) => void
  switchOff: () => void
}

export const scheduleCommand = (appStore: AppStore): ScheduleCommand => {
  return {
    on: ({ interval }: { interval: number }) => {
      appStore.send(setSchedule({ scheduleStatus: 'on', interval }))
    },
    off: () => {
      appStore.send(setSchedule({ scheduleStatus: 'off', interval: 0 }))
    },
    initialize: () => {
      appStore.send({ type: 'schedule/initialize' })
    },
    switchOn: ({ interval }: { interval: number }) => {
      appStore.send({ type: 'schedule/switchOn', payload: { interval } })
    },
    switchOff: () => {
      appStore.send({ type: 'schedule/switchOff' })
    },
  }
}
