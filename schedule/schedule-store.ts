import { createCoreStoreSlice } from '@core/store'
import type {
  PayloadStoreEvent,
  StoreEvent,
  CoreStoreSlice,
} from '@core/store'

export type ScheduleStatus =
  | 'initial'
  | 'off'
  | 'on'

export interface ScheduleState {
  scheduleStatus: ScheduleStatus
  interval: number
}

export interface SchedulePayloadOn {
  scheduleStatus: 'on'
  interval: number
}

export interface SchedulePayloadOff {
  scheduleStatus: 'off'
}

export interface SchedulePayloadSwitchOn {
  interval: number
}

export type SchedulePayload = SchedulePayloadOn | SchedulePayloadOff

export type ScheduleEventOn =
  PayloadStoreEvent<'schedule/setSchedule', SchedulePayloadOn>

export type ScheduleEventOff =
  PayloadStoreEvent<'schedule/setSchedule', SchedulePayloadOff>

export type ScheduleEventInitialize = StoreEvent<'schedule/initialize'>

export type ScheduleEventSwitchOn =
  PayloadStoreEvent<'schedule/switchOn', SchedulePayloadSwitchOn>

export type ScheduleEventSwitchOff = StoreEvent<'schedule/switchOff'>

type ScheduleEventOnOff =
 | PayloadStoreEvent
 | ScheduleEventOn
 | ScheduleEventOff

export type ScheduleEvent =
 | ScheduleEventOnOff
 | ScheduleEventInitialize
 | ScheduleEventSwitchOn
 | ScheduleEventSwitchOff

const initialState: ScheduleState = {
  scheduleStatus: 'initial',
  interval: 0,
}

const setSchedule =
  (state: ScheduleState, event: ScheduleEventOnOff): ScheduleState => ({
    ...state,
    ...event.payload,
  })

const reducers = {
  setSchedule,
}

export const scheduleSlice: CoreStoreSlice<ScheduleState, typeof reducers> =
  createCoreStoreSlice({
    name: 'schedule',
    initialState,
    reducers: {
      setSchedule,
    },
  })
