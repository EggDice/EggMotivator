import { map } from 'rxjs/operators';
import type { AppStore } from '@app/app-store';
import type { ScheduleState } from './schedule-store';

export const scheduleQuery = (store: AppStore) =>
  ({
    isLoaded$: store.state$.pipe(
      map(getScheduleStatus),
      map((scheduleStatus) => scheduleStatus !== 'initial')
    ),
    isOn$: store.state$.pipe(
      map(getScheduleStatus),
      map((scheduleStatus) => scheduleStatus === 'on')
    ),
  });

const getScheduleStatus = ({
  schedule: {
    scheduleStatus
  },
}: { schedule: ScheduleState }) => scheduleStatus;
