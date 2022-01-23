import { scheduleEffect } from './schedule-effect'
import type { ScheduleEffect } from './schedule-effect'
import { coreMarbles } from '@core/marbles'
import {
  fakeNotificationService,
} from '@notification/fake-notification-service'
import {
  ScheduleEventInitialize,
  ScheduleEventOn,
  ScheduleEventOff,
  ScheduleEventSwitchOn,
  ScheduleEventSwitchOff,
} from './schedule-store'
import { MetricEventRawPush } from '@metric/metric-store'
import { AlertEventShow } from '@alert/alert-store'
import type {
  NotificationService,
} from '@notification/notification'
import { mergeMap, last } from 'rxjs/operators'

test('init with no notifications scheduled', coreMarbles((m) => {
  const { effect } = createEffect()
  const event$ = m.cold('i', {
    i: EVENT_INIT,
  })
  m.expect(effect.handleInitialize(event$)).toBeObservable('-(nm)', {
    n: EVENT_SET_SCHEDULE_OFF,
    m: EVENT_METRIC_INFO_OFF('init'),
  })
}))

test('init with notifications scheduled', coreMarbles((m) => {
  const { notificationService, effect } = createEffect()
  notificationService.setIntervalNotification({
    title: '',
    body: '',
    interval: 5 * 60 * 1000,
  })
  const event$ = m.cold('i', {
    i: EVENT_INIT,
  })
  m.expect(effect.handleInitialize(event$)).toBeObservable('-(ym)', {
    y: EVENT_SET_SCHEDULE_ON,
    m: EVENT_METRIC_INFO_ON('init'),
  })
}))

test('init error handling', coreMarbles((m) => {
  const error = new Error('Unable to check if notifications are scheduled')
  const { effect } = createEffect({
    getIntervalNotifications: { type: 'observable', error },
  })
  const event$ = m.cold('i', {
    i: EVENT_INIT,
  })
  m.expect(effect.handleInitialize(event$)).toBeObservable('-(nam)', {
    n: EVENT_SET_SCHEDULE_OFF,
    m: EVENT_METRIC_ERROR('ERROR_NOTIFICATIONS_UNABLE_TO_LOAD', error),
    a: EVENT_ALERT('Could not check scheduled notifications'),
  })
}))

test('switch on', coreMarbles((m) => {
  const { effect } = createEffect()
  const event$ = m.cold('i', {
    i: EVENT_SWITCH_ON,
  })
  m.expect(effect.handleSwitchOn(event$)).toBeObservable('-(nm)', {
    n: EVENT_SET_SCHEDULE_ON,
    m: EVENT_METRIC_INFO_ON('switch'),
  })
}))

test('switch on should create the notifications', coreMarbles((m) => {
  const { effect, notificationService } = createEffect()
  const event$ = m.cold('i|', {
    i: EVENT_SWITCH_ON,
  })
  const notifications$ =
    effect.handleSwitchOn(event$).pipe(
      last(),
      mergeMap(() => notificationService.getIntervalNotifications()),
    )
  m.expect(notifications$).toBeObservable('--(1|)', {
    1: [{
      title: 'Ping',
      body: '5 minutes passed',
      interval: 5 * 60 * 1000,
      id: '0',
    }],
  })
}))

test('switch on error handling', coreMarbles((m) => {
  const error = new Error('Unable to schedule notifications')
  const { effect } = createEffect({
    setIntervalNotification: { type: 'observable', error },
  })
  const event$ = m.cold('i', {
    i: EVENT_SWITCH_ON,
  })
  m.expect(effect.handleSwitchOn(event$)).toBeObservable('-(am)', {
    m: EVENT_METRIC_ERROR('ERROR_NOTIFICATIONS_UNABLE_TO_SCHEDULE', error),
    a: EVENT_ALERT('Could not schedule notifications'),
  })
}))

test('switch off', coreMarbles((m) => {
  const { effect } = createEffect()
  const event$ = m.cold('i', {
    i: EVENT_SWITCH_OFF,
  })
  m.expect(effect.handleSwitchOff(event$)).toBeObservable('-(nm)', {
    n: EVENT_SET_SCHEDULE_OFF,
    m: EVENT_METRIC_INFO_OFF('switch'),
  })
}))

test('switch off error handling', coreMarbles((m) => {
  const error = new Error('Unable to cancel notifications')
  const { effect } = createEffect({
    clearAllIntervalNotifications: { type: 'observable', error },
  })
  const event$ = m.cold('i', {
    i: EVENT_SWITCH_OFF,
  })
  m.expect(effect.handleSwitchOff(event$)).toBeObservable('-(am)', {
    m: EVENT_METRIC_ERROR('ERROR_NOTIFICATIONS_UNABLE_TO_CLEAR', error),
    a: EVENT_ALERT('Could not turn off notifications'),
  })
}))

test('switch off should clear the notifications', coreMarbles((m) => {
  const { effect, notificationService } = createEffect()
  notificationService.setIntervalNotification({
    title: '',
    body: '',
    interval: 5 * 60 * 1000,
  })
  const event$ = m.cold('i|', {
    i: EVENT_SWITCH_OFF,
  })
  const notifications$ =
    effect.handleSwitchOff(event$).pipe(
      last(),
      mergeMap(() => notificationService.getIntervalNotifications()),
    )
  m.expect(notifications$).toBeObservable('--(0|)', {
    0: [],
  })
}))

const createEffect = (configs = {}): {
  notificationService: NotificationService
  effect: ScheduleEffect
} => {
  const notificationService = fakeNotificationService(configs)
  const effect = scheduleEffect({ notificationService })
  return { notificationService, effect }
}

const EVENT_INIT: ScheduleEventInitialize = {
  type: 'schedule/initialize',
}

const EVENT_SWITCH_ON: ScheduleEventSwitchOn = {
  type: 'schedule/switchOn',
  payload: {
    interval: 5 * 60 * 1000,
  },
}

const EVENT_SWITCH_OFF: ScheduleEventSwitchOff = {
  type: 'schedule/switchOff',
}

const EVENT_SET_SCHEDULE_OFF: ScheduleEventOff = {
  type: 'schedule/setSchedule',
  payload: { scheduleStatus: 'off' },
}

const EVENT_SET_SCHEDULE_ON: ScheduleEventOn = {
  type: 'schedule/setSchedule',
  payload: { scheduleStatus: 'on', interval: 5 * 60 * 1000 },
}

const EVENT_METRIC_INFO_OFF = (trigger: string): MetricEventRawPush => ({
  type: 'metric/pushRawMetric',
  payload: {
    type: 'SCHEDULE_NOTIFICATIONS',
    level: 'info',
    payload: {
      interval: 0,
      state: 'off',
      trigger,
    },
  },
})

const EVENT_METRIC_INFO_ON = (trigger: string): MetricEventRawPush => ({
  type: 'metric/pushRawMetric',
  payload: {
    type: 'SCHEDULE_NOTIFICATIONS',
    level: 'info',
    payload: {
      interval: 5 * 60 * 1000,
      state: 'on',
      trigger,
    },
  },
})

const EVENT_METRIC_ERROR =
  (type: string, { stack, message }: Error): MetricEventRawPush => ({
    type: 'metric/pushRawMetric',
    payload: {
      type,
      level: 'error',
      payload: { stack, message },
    },
  })

const EVENT_ALERT = (message: string): AlertEventShow => ({
  type: 'alert/showAlert',
  payload: {
    message,
  },
})
