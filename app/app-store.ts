import { createCoreStore } from '@core/store';
import { scheduleSlice } from '@schedule/schedule-store';
import { alertSlice } from '@alert/alert-store';

export const appStore = () => createCoreStore({
  schedule: scheduleSlice().reducer,
  alert: alertSlice().reducer,
});

export type AppStore = ReturnType<typeof appStore>;
