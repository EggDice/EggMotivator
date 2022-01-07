import { scheduleQuery } from './schedule-query';
import { scheduleCommand } from './schedule-command';

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
  const initialize = () => {
    notificationService.getIntervalNotifications().subscribe((n) => {
    if (n.length) {
      command.scheduleOn({ interval: 10 });
    }
    else {
      command.scheduleOff();
    }
    });
  };
  return {
    initialize,
    ...query,
  };
};
