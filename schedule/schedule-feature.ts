import { scheduleQuery } from './schedule-query';
import { scheduleCommand } from './schedule-command';
import { scheduleSlice } from './schedule-store';
import { alertSlice } from '@alert/alert-store';
import { metricSlice } from '@metric/metric-store';

import { of } from 'rxjs';
import { filter, mergeMap, catchError } from 'rxjs/operators';

import type { Observable } from 'rxjs';
import type {
  NotificationService,
  IntervalNotification,
} from '@notification/notification';
import type { StoreEvent } from '@core/store';
import type { AppStore } from '@app/app-store';

type ScheduleServiceArgs = {
  store: AppStore,
  notificationService: NotificationService,
};

type ScheduleMetricArgs = {
  state: string,
  trigger: string,
  interval: number,
};

export const createSchedule =
    ({ store, notificationService }: ScheduleServiceArgs) => {
  const query = scheduleQuery(store);
  const command = scheduleCommand(store);

  const handleInitEffect = (event$: Observable<StoreEvent>) => event$.pipe(
    filter(({type}) => type === 'schedule/initialize'),
    mergeMap(() => notificationService.getIntervalNotifications().pipe(
      mergeMap(turnOnOrOffAfterInit),
      catchError(handleGetNotificationsError),
    )),
  );
  store.registerEffect(handleInitEffect);

  const { eventCreators: { setSchedule } } = scheduleSlice();
  const { eventCreators: { showAlert } } = alertSlice();
  const { eventCreators: { pushRawMetric } } = metricSlice();

  const turnOnOrOffAfterInit = (notifications: IntervalNotification[]) =>
    notifications.length ? toOnAfterInit() : toOffAfterInit()

  const handleGetNotificationsError = (exception: Error) => of(
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
  );

  const onOfActionCreator =
      ({ state, interval, trigger }: ScheduleMetricArgs) => () =>
    of(
      setSchedule({ scheduleStatus: state, interval }),
      metricScheduleNotification({ state, trigger, interval }),
    );

  const toOffAfterInit = onOfActionCreator({
    state: 'off',
    trigger: 'init',
    interval: 0,
  });

  const toOnAfterInit = onOfActionCreator({
    state: 'on',
    trigger: 'init',
    interval: 5000,
  });

  const metricScheduleNotification =
      ({state, trigger, interval}: ScheduleMetricArgs) =>
    pushRawMetric({
      type: 'SCHEDULE_NOTIFICATIONS',
      level: 'info',
      payload: { state, trigger, interval },
    });


  return {
    ...command,
    ...query,
  };
};
