import { createCoreStore } from '@core/store';
import { scheduleSlice } from '@schedule/schedule-store';
import { alertSlice } from '@alert/alert-store';
import { metricSlice } from '@metric/metric-store';

import type { ScheduleState, ScheduleEvent } from '@schedule/schedule-store';
import type { AlertState, AlertEvent } from '@alert/alert-store';
import type { MetricState, MetricEvent } from '@metric/metric-store';

export type AppStoreState = {
  schedule: ScheduleState,
  alert: AlertState,
  metric: MetricState,
};

export type AppStoreEvent =
  | ScheduleEvent
  | AlertEvent
  | MetricEvent
  ;

export const appStore = () => createCoreStore<AppStoreState, AppStoreEvent>({
  schedule: scheduleSlice().reducer,
  alert: alertSlice().reducer,
  metric: metricSlice().reducer,
});

export type AppStore = ReturnType<typeof appStore>;
