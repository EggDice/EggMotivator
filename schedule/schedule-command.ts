import type { AppStore } from '@app/app-store';
import { scheduleSlice } from './schedule-store';

export const scheduleCommand = (appStore: AppStore) => {
  const { eventCreators: { setSchedule } } = scheduleSlice();
  return {
    scheduleOn: ({ interval }: { interval: number }) => {
      appStore.send(setSchedule({ scheduleStatus: 'on', interval }));
    },
    scheduleOff: () => {
      appStore.send(setSchedule({ scheduleStatus: 'off', interval: 0 }));
    },
  };
};
