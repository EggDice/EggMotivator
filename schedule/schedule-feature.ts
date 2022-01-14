import { scheduleQuery } from './schedule-query';
import { scheduleCommand } from './schedule-command';
import { scheduleSlice } from './schedule-store';
import { alertSlice } from '@alert/alert-store';
import { metricSlice } from '@metric/metric-store';

import { of } from 'rxjs';
import { filter, mergeMap, map, catchError } from 'rxjs/operators';

import type { NotificationService } from '@notification/notification';
import type { AppStore } from '@app/app-store';

type ScheduleServiceArgs = {
  store: AppStore,
  notificationService: NotificationService,
};

export const createSchedule =
    ({ store, notificationService }: ScheduleServiceArgs) => {
  const query = scheduleQuery(store);
  const command = scheduleCommand(store);

  const { eventCreators: { setSchedule } } = scheduleSlice();
  const { eventCreators: { showAlert } } = alertSlice();
  const { eventCreators: { pushRawMetric } } = metricSlice();

  store.registerEffect((event$) => event$.pipe(
    filter(({type}) => type === 'schedule/initialize'),
    mergeMap(() => notificationService.getIntervalNotifications().pipe(
      map((notifications) => notifications.length ?
        setSchedule({ scheduleStatus: 'on', interval: 5000 }) :
        setSchedule({ scheduleStatus: 'off', interval: 0 })
      ),
      catchError((exception) => of(
        setSchedule({ scheduleStatus: 'off', interval: 0 }),
        showAlert({ message: 'Could not check scheduled notifications' }),
        pushRawMetric({
          type: 'ERROR_NOTIFICATIONS_UNABLE_TO_LOAD',
          level: 'error',
          payload: { exception },
        }),
      )),
    )),
  ));

  return {
    ...command,
    ...query,
  };
};
