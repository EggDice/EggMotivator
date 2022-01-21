import { scheduleQuery } from './schedule-query'
import { scheduleCommand } from './schedule-command'
import { scheduleSlice } from './schedule-store'
import { alertSlice } from '@alert/alert-store'
import { metricSlice } from '@metric/metric-store'
import { filterByType } from '@core/effect'

import { of } from 'rxjs'
import { mergeMap, catchError, map } from 'rxjs/operators'

import type { Observable } from 'rxjs'
import type {
  NotificationService,
  IntervalNotification,
} from '@notification/notification'
import type { AppStore, AppStoreEvent } from '@app/app-store'

export interface ScheduleFeature {
  isOn$: Observable<boolean>
  isLoaded$: Observable<boolean>
  initialize: () => void
  switchOn: (arg: { interval: number }) => void
  switchOff: () => void
}

interface ScheduleServiceArgs {
  store: AppStore
  notificationService: NotificationService
}

interface ScheduleMetricArgs {
  state: string
  trigger: string
  interval: number
}

export const createSchedule =
    ({ store, notificationService }: ScheduleServiceArgs): ScheduleFeature => {
      const query = scheduleQuery(store)
      const command = scheduleCommand(store)

      const handleInitEffect =
        (event$: Observable<AppStoreEvent>): Observable<AppStoreEvent> =>
          event$.pipe(
            filterByType<AppStoreEvent>('schedule/initialize'),
            mergeMap(() => notificationService.getIntervalNotifications().pipe(
              mergeMap(turnOnOrOffAfterInit),
              catchError(handleGetNotificationsError),
            )),
          )
      store.registerEffect(handleInitEffect)

      const handleSwitchOn =
        (event$: Observable<AppStoreEvent>): Observable<AppStoreEvent> =>
          event$.pipe(
            filterByType<AppStoreEvent>('schedule/switch-on'),
            mergeMap(
              ({ payload: { interval } }) =>
                notificationService.setIntervalNotification({
                  title: 'Ping',
                  body: '5 minutes passed',
                  interval,
                }).pipe(
                  map(() => setSchedule({ scheduleStatus: 'on', interval })),
                  catchError((exception: Error) => of(
                    showAlert({ message: 'Could not schedule notifications' }),
                    pushRawMetric({
                      type: 'ERROR_NOTIFICATIONS_UNABLE_TO_SCHEDULE',
                      level: 'error',
                      payload: {
                        stack: exception.stack,
                        message: exception.message,
                      },
                    }),
                  )),
                ),
            ),
          )
      store.registerEffect(handleSwitchOn)

      const handleSwitchOff =
        (event$: Observable<AppStoreEvent>): Observable<AppStoreEvent> =>
          event$.pipe(
            filterByType<AppStoreEvent>('schedule/switch-off'),
            mergeMap(
              () =>
                notificationService.clearAllIntervalNotifications().pipe(
                  map(() => setSchedule({ scheduleStatus: 'off' })),
                  catchError((exception: Error) => of(
                    showAlert({ message: 'Could not turn off notifications' }),
                    pushRawMetric({
                      type: 'ERROR_NOTIFICATIONS_UNABLE_TO_CANCEL',
                      level: 'error',
                      payload: {
                        stack: exception.stack,
                        message: exception.message,
                      },
                    }),
                  )),
                ),
            ),
          )
      store.registerEffect(handleSwitchOff)

      const { eventCreators: { setSchedule } } = scheduleSlice()
      const { eventCreators: { showAlert } } = alertSlice()
      const { eventCreators: { pushRawMetric } } = metricSlice()

      const turnOnOrOffAfterInit =
        (notifications: IntervalNotification[]): Observable<AppStoreEvent> =>
          (notifications.length > 0) ? toOnAfterInit() : toOffAfterInit()

      const handleGetNotificationsError =
        (exception: Error): Observable<AppStoreEvent> => of(
          setSchedule({ scheduleStatus: 'off', interval: 0 }),
          showAlert({ message: 'Could not check scheduled notifications' }),
          pushRawMetric({
            type: 'ERROR_NOTIFICATIONS_UNABLE_TO_LOAD',
            level: 'error',
            payload: {
              stack: exception.stack,
              message: exception.message,
            },
          }),
        )

      const onOfActionCreator =
      ({ state, interval, trigger }: ScheduleMetricArgs) => () =>
        of(
          setSchedule({ scheduleStatus: state, interval }),
          metricScheduleNotification({ state, trigger, interval }),
        )

      const toOffAfterInit = onOfActionCreator({
        state: 'off',
        trigger: 'init',
        interval: 0,
      })

      const toOnAfterInit = onOfActionCreator({
        state: 'on',
        trigger: 'init',
        interval: 5000,
      })

      const metricScheduleNotification =
      ({ state, trigger, interval }: ScheduleMetricArgs): AppStoreEvent =>
        pushRawMetric({
          type: 'SCHEDULE_NOTIFICATIONS',
          level: 'info',
          payload: { state, trigger, interval },
        })

      return {
        switchOn: command.switchOn,
        switchOff: command.switchOff,
        initialize: command.initialize,
        ...query,
      }
    }
