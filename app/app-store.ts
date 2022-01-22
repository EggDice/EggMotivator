import { createCoreStore } from '@core/store'
import { scheduleSlice } from '@schedule/schedule-store'
import { alertSlice } from '@alert/alert-store'
import { metricSlice } from '@metric/metric-store'

import type { CoreStore } from '@core/store'
import type { ScheduleState, ScheduleEvent } from '@schedule/schedule-store'
import type { AlertState, AlertEvent } from '@alert/alert-store'
import type { MetricState, MetricEvent } from '@metric/metric-store'

export interface AppStoreState {
  schedule: ScheduleState
  alert: AlertState
  metric: MetricState
}

export type AppStoreEvent =
  | ScheduleEvent
  | AlertEvent
  | MetricEvent

export type AppStore = CoreStore<AppStoreState, AppStoreEvent>

export const appStore = (): AppStore => createCoreStore<AppStoreState, AppStoreEvent>({
  schedule: scheduleSlice.reducer,
  alert: alertSlice.reducer,
  metric: metricSlice.reducer,
})
