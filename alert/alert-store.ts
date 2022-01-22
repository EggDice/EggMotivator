import { createCoreStoreSlice } from '@core/store'
import type { PayloadStoreEvent, CoreStoreSlice } from '@core/store'

export interface RawAlert {
  message: string
}

export interface Alert extends RawAlert {
  timestamp: string
};

export interface AlertState {
  display: Alert[]
};

export type AlertEventShow = PayloadStoreEvent<'alert/showAlert', RawAlert>

export type AlertEvent =
  | AlertEventShow

const initialState: AlertState = {
  display: [],
}

const showAlert = (state: AlertState, event: AlertEventShow): AlertState => ({
  display: [
    ...state.display,
    { ...event.payload, timestamp: new Date().toISOString() },
  ],
})

const reducers = {
  showAlert,
}

export const alertSlice: CoreStoreSlice<AlertState, typeof reducers> =
  createCoreStoreSlice({
    name: 'alert',
    initialState,
    reducers,
  })
