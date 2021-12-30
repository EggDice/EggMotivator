import { createCoreStore } from '@core/store';
import { scheduleSlice } from '@schedule/schedule-store';

export const appStore = () => createCoreStore({
  schedule: scheduleSlice().reducer,
});

export type AppStore = ReturnType<typeof appStore>;
