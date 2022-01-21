import { map, distinctUntilChanged } from 'rxjs/operators'
import { coreMarbles } from '@core/marbles'
import { appStore } from '@app/app-store'
import type { AppStore } from '@app/app-store'
import {
  fakeNotificationService,
} from '@notification/fake-notification-service'
import type { NotificationService } from '@notification/notification'
import { createSchedule } from './schedule-feature'
import type { ScheduleFeature } from './schedule-feature'

test('init with no notifications scheduled', coreMarbles((m) => {
  const { schedule } = createFeature()
  schedule.initialize()
  const isLoaded$ = schedule.isLoaded$.pipe(distinctUntilChanged())
  m.expect(isLoaded$).toBeObservable(m.coldBoolean('ft'))
  const isOn$ = schedule.isOn$.pipe(distinctUntilChanged())
  m.expect(isOn$).toBeObservable(m.coldBoolean('f'))
}))

test('init with no notifications scheduled should log', coreMarbles((m) => {
  const { schedule, store } = createFeature()
  schedule.initialize()
  const metricState$ = store.state$.pipe(
    map(({ metric }) => metric),
    distinctUntilChanged(),
  )
  m.expect(metricState$).toBeObservable('01', {
    0: {
      toLog: [],
    },
    1: {
      toLog: [{
        type: 'SCHEDULE_NOTIFICATIONS',
        level: 'info',
        payload: { state: 'off', trigger: 'init', interval: 0 },
        timestamp: '2022-01-13T16:21:38.123Z',
      }],
    },
  })
}))

test('init should recognize old notifications scheduled', coreMarbles((m) => {
  const { schedule, notificationService } = createFeature()
  notificationService.setIntervalNotification({
    title: '',
    body: '',
    interval: 5000,
  })
  schedule.initialize()
  const isLoaded$ = schedule.isLoaded$.pipe(distinctUntilChanged())
  m.expect(isLoaded$).toBeObservable(m.coldBoolean('ft'))
  const isOn$ = schedule.isOn$.pipe(distinctUntilChanged())
  m.expect(isOn$).toBeObservable(m.coldBoolean('ft'))
}))

test('init should recognize old notifications scheduled', coreMarbles((m) => {
  const { schedule, notificationService, store } = createFeature()
  notificationService.setIntervalNotification({
    title: '',
    body: '',
    interval: 5000,
  })
  schedule.initialize()
  const metricState$ = store.state$.pipe(
    map(({ metric }) => metric),
    distinctUntilChanged(),
  )
  m.expect(metricState$).toBeObservable('01', {
    0: {
      toLog: [],
    },
    1: {
      toLog: [{
        type: 'SCHEDULE_NOTIFICATIONS',
        level: 'info',
        payload: { state: 'on', trigger: 'init', interval: 5000 },
        timestamp: '2022-01-13T16:21:38.123Z',
      }],
    },
  })
}))

test('init should set it off if unable to read notifications',
  coreMarbles((m) => {
    const error = new Error('Unable to check if notifications are scheduled')
    const { schedule } = createFeature({
      getIntervalNotifications: { type: 'observable', error },
    })
    schedule.initialize()
    const isLoaded$ = schedule.isLoaded$.pipe(distinctUntilChanged())
    m.expect(isLoaded$).toBeObservable(m.coldBoolean('ft'))
    const isOn$ = schedule.isOn$.pipe(distinctUntilChanged())
    m.expect(isOn$).toBeObservable(m.coldBoolean('f'))
  }))

test('init should show an alert if unable to read notifications',
  coreMarbles((m) => {
    const error = new Error('Unable to check if notifications are scheduled')
    const { schedule, store } = createFeature({
      getIntervalNotifications: { type: 'observable', error },
    })
    schedule.initialize()
    const alertState$ = store.state$.pipe(
      map(({ alert }) => alert),
      distinctUntilChanged(),
    )
    m.expect(alertState$).toBeObservable('01', {
      0: {
        display: [],
      },
      1: {
        display: [{
          message: 'Could not check scheduled notifications',
          timestamp: '2022-01-13T16:21:38.123Z',
        }],
      },
    })
  }))

test('init should log if unable to read notifications',
  coreMarbles((m) => {
    const error = new Error('Unable to check if notifications are scheduled')
    const { schedule, store } = createFeature({
      getIntervalNotifications: { type: 'observable', error },
    })
    schedule.initialize()
    const metricState$ = store.state$.pipe(
      map(({ metric }) => metric),
      distinctUntilChanged(),
    )
    m.expect(metricState$).toBeObservable('01', {
      0: {
        toLog: [],
      },
      1: {
        toLog: [{
          type: 'ERROR_NOTIFICATIONS_UNABLE_TO_LOAD',
          level: 'error',
          payload: {
            stack: error.stack,
            message: error.message,
          },
          timestamp: '2022-01-13T16:21:38.123Z',
        }],
      },
    })
  }))

test('switch on schedule', coreMarbles((m) => {
  const { schedule, notificationService } = createFeature()
  schedule.switchOn({ interval: 5 * 60 * 1000 })
  const notifications$ = notificationService.getIntervalNotifications()
  m.expect(notifications$).toBeObservable('-(1|)', {
    1: [{
      title: 'Ping',
      body: '5 minutes passed',
      interval: 5 * 60 * 1000,
      id: '0',
    }],
  })
  const isLoaded$ = schedule.isLoaded$.pipe(distinctUntilChanged())
  m.expect(isLoaded$).toBeObservable(m.coldBoolean('ft'))
  const isOn$ = schedule.isOn$.pipe(distinctUntilChanged())
  m.expect(isOn$).toBeObservable(m.coldBoolean('ft'))
}))

test('switch on error should show an alert', coreMarbles((m) => {
  const error = new Error('Unable to schedule notifications')
  const { schedule, store } = createFeature({
    setIntervalNotification: { type: 'observable', error },
  })
  schedule.switchOn({ interval: 5 * 60 * 1000 })
  const alertState$ = store.state$.pipe(
    map(({ alert }) => alert),
    distinctUntilChanged(),
  )
  m.expect(alertState$).toBeObservable('01', {
    0: {
      display: [],
    },
    1: {
      display: [{
        message: 'Could not schedule notifications',
        timestamp: '2022-01-13T16:21:38.123Z',
      }],
    },
  })
}))

test('switch on error should log',
  coreMarbles((m) => {
    const error = new Error('Unable to schedule notifications')
    const { schedule, store } = createFeature({
      setIntervalNotification: { type: 'observable', error },
    })
    schedule.switchOn({ interval: 5 * 60 * 1000 })
    const metricState$ = store.state$.pipe(
      map(({ metric }) => metric),
      distinctUntilChanged(),
    )
    m.expect(metricState$).toBeObservable('01', {
      0: {
        toLog: [],
      },
      1: {
        toLog: [{
          type: 'ERROR_NOTIFICATIONS_UNABLE_TO_SCHEDULE',
          level: 'error',
          payload: {
            stack: error.stack,
            message: error.message,
          },
          timestamp: '2022-01-13T16:21:38.123Z',
        }],
      },
    })
  }))

test('switch off schedule', coreMarbles((m) => {
  const { schedule, notificationService } = createFeature()
  notificationService.setIntervalNotification({
    title: '',
    body: '',
    interval: 5000,
  })
  schedule.switchOff()
  const notifications$ = notificationService.getIntervalNotifications()
  m.expect(notifications$).toBeObservable('-(0|)', { 0: [] })
  const isLoaded$ = schedule.isLoaded$.pipe(distinctUntilChanged())
  m.expect(isLoaded$).toBeObservable(m.coldBoolean('ft'))
  const isOn$ = schedule.isOn$.pipe(distinctUntilChanged())
  m.expect(isOn$).toBeObservable(m.coldBoolean('f'))
}))

test('switch off error should show an alert', coreMarbles((m) => {
  const error = new Error('Unable to cancel notifications')
  const { schedule, store } = createFeature({
    clearAllIntervalNotifications: { type: 'observable', error },
  })
  schedule.switchOff()
  const alertState$ = store.state$.pipe(
    map(({ alert }) => alert),
    distinctUntilChanged(),
  )
  m.expect(alertState$).toBeObservable('01', {
    0: {
      display: [],
    },
    1: {
      display: [{
        message: 'Could not turn off notifications',
        timestamp: '2022-01-13T16:21:38.123Z',
      }],
    },
  })
}))

test('switch off error should log',
  coreMarbles((m) => {
    const error = new Error('Unable to schedule notifications')
    const { schedule, store } = createFeature({
      clearAllIntervalNotifications: { type: 'observable', error },
    })
    schedule.switchOff()
    const metricState$ = store.state$.pipe(
      map(({ metric }) => metric),
      distinctUntilChanged(),
    )
    m.expect(metricState$).toBeObservable('01', {
      0: {
        toLog: [],
      },
      1: {
        toLog: [{
          type: 'ERROR_NOTIFICATIONS_UNABLE_TO_CANCEL',
          level: 'error',
          payload: {
            stack: error.stack,
            message: error.message,
          },
          timestamp: '2022-01-13T16:21:38.123Z',
        }],
      },
    })
  }))

const createFeature = (configs = {}): {
  schedule: ScheduleFeature
  store: AppStore
  notificationService: NotificationService
} => {
  const store = appStore()
  const notificationService = fakeNotificationService(configs)
  const schedule = createSchedule({ store, notificationService })
  return { schedule, store, notificationService }
}

beforeEach(() => {
  jest
    .useFakeTimers()
    .setSystemTime(new Date('2022-01-13T16:21:38.123Z').getTime())
})
