import { createCoreStore } from '@core/store';
import { scheduleSlice } from '@schedule/schedule-store';
import { alertSlice } from '@alert/alert-store';
import { metricSlice } from '@metric/metric-store';

export const appStore = () => createCoreStore({
  schedule: scheduleSlice().reducer,
  alert: alertSlice().reducer,
  metric: metricSlice().reducer,
});

export type AppStore = ReturnType<typeof appStore>;
