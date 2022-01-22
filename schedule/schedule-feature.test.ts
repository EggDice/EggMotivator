import { distinctUntilChanged } from 'rxjs/operators'
import { coreMarbles } from '@core/marbles'
import { appStore } from '@app/app-store'
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

const createFeature = (configs = {}): {
  schedule: ScheduleFeature
  notificationService: NotificationService
} => {
  const store = appStore()
  const notificationService = fakeNotificationService(configs)
  const schedule = createSchedule({ store, notificationService })
  return { schedule, notificationService }
}
