import type { AppStore } from '@app/app-store';
import { scheduleSlice } from './schedule-store';

export const scheduleCommand = (appStore: AppStore) => {
  const { eventCreators: { setSchedule } } = scheduleSlice();
  return {
    scheduleOn: ({ timeout }: { timeout: number }) => {
      appStore.send(setSchedule({ scheduleStatus: 'on', timeout }));
    },
    scheduleOff: () => {
      appStore.send(setSchedule({ scheduleStatus: 'off', timeout: 0 }));
    },
  };
};
