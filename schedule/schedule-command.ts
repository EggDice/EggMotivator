import type { AppStore } from '@app/app-store';
import { scheduleSlice } from './schedule-store';

export const scheduleCommand = (appStore: AppStore) => {
  const { eventCreators: { setSchedule } } = scheduleSlice();
  return {
    on: ({ interval }: { interval: number }) => {
      appStore.send(setSchedule({ scheduleStatus: 'on', interval }));
    },
    off: () => {
      appStore.send(setSchedule({ scheduleStatus: 'off', interval: 0 }));
    },
    initialize: () => {
      appStore.send({ type: 'schedule/initialize' });
    },
  };
};
