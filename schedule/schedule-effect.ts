import { scheduleSlice } from './schedule-store'
import { alertSlice } from '@alert/alert-store'
import { metricSlice } from '@metric/metric-store'
import { filterByType } from '@core/effect'
import type { CoreEffect, CoreEffectFunction } from '@core/effect'
import { of } from 'rxjs'
import type { Observable } from 'rxjs'
import { mergeMap, catchError } from 'rxjs/operators'
import type { AppStoreEvent } from '@app/app-store'
import type {
  NotificationService,
  IntervalNotification,
} from '@notification/notification'

const { eventCreators: { showAlert } } = alertSlice
const { eventCreators: { setSchedule } } = scheduleSlice
const { eventCreators: { pushRawMetric } } = metricSlice

export interface ScheduleEffect extends CoreEffect<AppStoreEvent> {
  handleInitialize: CoreEffectFunction<AppStoreEvent>
  handleSwitchOn: CoreEffectFunction<AppStoreEvent>
  handleSwitchOff: CoreEffectFunction<AppStoreEvent>
}

interface ScheduleEffectArgs {
  notificationService: NotificationService
}

interface ScheduleMetricArgs {
  state: string
  trigger: string
  interval: number
}

interface ErrorMetricArgs {
  error: Error
  type: string
}

export const scheduleEffect =
  ({ notificationService }: ScheduleEffectArgs): ScheduleEffect => {
    const handleInitialize =
    (event$: Observable<AppStoreEvent>): Observable<AppStoreEvent> =>
      event$.pipe(
        filterByType<AppStoreEvent>('schedule/initialize'),
        mergeMap(() => notificationService.getIntervalNotifications().pipe(
          mergeMap(turnOnOrOffAfterInit),
          catchError(handleGetNotificationsError),
        )),
      )

    const handleSwitchOn =
      (event$: Observable<AppStoreEvent>): Observable<AppStoreEvent> =>
        event$.pipe(
          filterByType<AppStoreEvent>('schedule/switchOn'),
          mergeMap(
            ({ payload: { interval } }) =>
              notificationService.setIntervalNotification({
                title: 'Ping',
                body: '5 minutes passed',
                interval,
              }).pipe(
                mergeMap(() => toOnAfterSchedule(interval)),
                catchError(handleScheduleNotificationsError),
              ),
          ),
        )

    const handleSwitchOff =
        (event$: Observable<AppStoreEvent>): Observable<AppStoreEvent> =>
          event$.pipe(
            filterByType<AppStoreEvent>('schedule/switchOff'),
            mergeMap(
              () =>
                notificationService.clearAllIntervalNotifications().pipe(
                  mergeMap(() => toOffAfterSchedule(0)),
                  catchError(handleCancelNotificationsError),
                ),
            ),
          )

    return {
      handleInitialize,
      handleSwitchOn,
      handleSwitchOff,
    }
  }
const turnOnOrOffAfterInit =
  (notifications: IntervalNotification[]): Observable<AppStoreEvent> =>
    (notifications.length > 0)
      ? toOnAfterInit(notifications[0].interval)
      : toOffAfterInit(0)

const handleGetNotificationsError =
  (error: Error): Observable<AppStoreEvent> => of(
    setSchedule({ scheduleStatus: 'off' }),
    showAlert({ message: 'Could not check scheduled notifications' }),
    metricError({ error, type: 'ERROR_NOTIFICATIONS_UNABLE_TO_LOAD' }),
  )

const handleScheduleNotificationsError =
  (error: Error): Observable<AppStoreEvent> => of(
    showAlert({ message: 'Could not schedule notifications' }),
    metricError({ error, type: 'ERROR_NOTIFICATIONS_UNABLE_TO_SCHEDULE' }),
  )

const handleCancelNotificationsError =
  (error: Error): Observable<AppStoreEvent> => of(
    showAlert({ message: 'Could not turn off notifications' }),
    metricError({ error, type: 'ERROR_NOTIFICATIONS_UNABLE_TO_CLEAR' }),
  )

const onOffActionCreator =
  ({ state, trigger }: { state: string, trigger: string }) =>
    (interval: number) =>
      of(
        state === 'on'
          ? setSchedule({ scheduleStatus: 'on', interval })
          : setSchedule({ scheduleStatus: 'off' }),
        metricScheduleNotification({ state, trigger, interval }),
      )

const toOffAfterInit = onOffActionCreator({
  state: 'off',
  trigger: 'init',
})

const toOnAfterInit = onOffActionCreator({
  state: 'on',
  trigger: 'init',
})

const toOnAfterSchedule = onOffActionCreator({
  state: 'on',
  trigger: 'switch',
})

const toOffAfterSchedule = onOffActionCreator({
  state: 'off',
  trigger: 'switch',
})

const metricError =
  ({ error: { stack, message }, type }: ErrorMetricArgs):
  AppStoreEvent =>
    pushRawMetric({
      type,
      level: 'error',
      payload: { stack, message },
    })

const metricScheduleNotification =
  ({ state, trigger, interval }: ScheduleMetricArgs): AppStoreEvent =>
    pushRawMetric({
      type: 'SCHEDULE_NOTIFICATIONS',
      level: 'info',
      payload: { state, trigger, interval },
    })
