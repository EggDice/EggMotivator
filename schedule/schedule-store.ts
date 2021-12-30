import { createCoreStoreSlice } from '@core/store';
import type { PayloadStoreEvent } from '@core/store';

export interface ScheduleState {
  scheduleStatus: 'initial' | 'off' | 'on';
  timeout: number,
};

export interface SchedulePayloadOn {
  scheduleStatus: 'on';
  timeout: number;
};

export interface SchedulePayloadOff {
  scheduleStatus: 'off';
};

export type SchedulePayload = SchedulePayloadOn | SchedulePayloadOff;

export type ScheduleEventOn = PayloadStoreEvent<
  'schedule/setSchedule',
  SchedulePayloadOn
>;

export type ScheduleEventOff = PayloadStoreEvent<
  'schedule/setSchedule',
  SchedulePayloadOff
>;

export type ScheduleEvent = PayloadStoreEvent
 | ScheduleEventOn
 | ScheduleEventOff;

const initialState: ScheduleState = {
  scheduleStatus: 'initial',
  timeout: 0,
};

export const scheduleSlice = () => createCoreStoreSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSchedule,
  },
});

const setSchedule = (state: ScheduleState, event: ScheduleEvent) => ({
  ...state,
  ...event.payload,
});
