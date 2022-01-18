import { createCoreStoreSlice } from '@core/store';
import type { PayloadStoreEvent } from '@core/store';

export interface RawMetric {
  type: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  payload: any;
}

export interface Metric extends RawMetric {
  timestamp: string;
};

export interface MetricState {
  toLog: Metric[];
};

export type MetricEventPush = PayloadStoreEvent<Metric>;
export type MetricEventRawPush = PayloadStoreEvent<RawMetric>;

export type MetricEvent =
  | MetricEventPush
  | MetricEventRawPush
  ;

const initialState: MetricState = {
  toLog: [],
};

export const metricSlice = () => createCoreStoreSlice({
  name: 'metric',
  initialState,
  reducers: {
    pushMetric,
    pushRawMetric,
  },
});

const pushMetric = (state: MetricState, event: MetricEventPush) => ({
  toLog: [...state.toLog, event.payload],
});

const pushRawMetric = (state: MetricState, event: MetricEventRawPush) => ({
  toLog: [
    ...state.toLog,
    { ...event.payload, timestamp: new Date().toISOString() },
  ]
});
