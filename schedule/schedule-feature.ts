import { scheduleQuery } from './schedule-query';
import { scheduleCommand } from './schedule-command';
import { scheduleSlice } from './schedule-store';

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
  store.registerEffect((event$) => event$.pipe(
    filter(({type}) => type === 'schedule/initialize'),
    mergeMap(() => notificationService.getIntervalNotifications().pipe(
      map((notifications) => notifications.length ?
        setSchedule({ scheduleStatus: 'on', interval: 5000 }) :
        setSchedule({ scheduleStatus: 'off', interval: 0 })
      ),
      catchError(() => of(setSchedule({ scheduleStatus: 'off', interval: 0 }))),
    )),
  ));

  return {
    ...command,
    ...query,
  };
};
