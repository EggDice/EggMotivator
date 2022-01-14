import { createCoreStoreSlice } from '@core/store';
import type { PayloadStoreEvent } from '@core/store';

export interface Metric {
  type: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  payload: any;
};

export interface MetricState {
  toLog: Metric[];
};

export type MetricEventPush = PayloadStoreEvent<Metric>;


const initialState: MetricState = {
  toLog: [],
};

export const metricSlice = () => createCoreStoreSlice({
  name: 'metric',
  initialState,
  reducers: {
    pushMetric,
  },
});

const pushMetric = (state: MetricState, event: MetricEventPush) => ({
  toLog: [...state.toLog, event.payload],
});
