import { createCoreStoreSlice } from '@core/store';
import type { PayloadStoreEvent } from '@core/store';

export interface Alert {
  message: string;
  timestamp: string;
};

export interface AlertState {
  display: Alert[];
};

export type AlertEventShow = PayloadStoreEvent<Alert>;


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
  display: [...state.display, event.payload],
});
