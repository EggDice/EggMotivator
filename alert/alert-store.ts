import { createCoreStoreSlice } from '@core/store';
import type { PayloadStoreEvent } from '@core/store';

export interface RawAlert {
  message: string;
}

export interface Alert extends RawAlert {
  timestamp: string;
};

export interface AlertState {
  display: Alert[];
};

export type AlertEventShow = PayloadStoreEvent<RawAlert>;


const initialState: AlertState = {
  display: [],
};

export const alertSlice = () => createCoreStoreSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert,
  },
});

const showAlert = (state: AlertState, event: AlertEventShow) => ({
  display: [
    ...state.display,
    { ...event.payload, timestamp: new Date().toISOString() },
  ],
});
