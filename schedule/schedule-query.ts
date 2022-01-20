import { map } from 'rxjs/operators'
import type { Observable } from 'rxjs'
import type { CoreQuery } from '@core/query'
import type { AppStore } from '@app/app-store'
import type { ScheduleState, ScheduleStatus } from './schedule-store'

interface ScheduleQuery extends CoreQuery {
  isLoaded$: Observable<boolean>
  isOn$: Observable<boolean>
}

export const scheduleQuery = (store: AppStore): ScheduleQuery =>
  ({
    isLoaded$: store.state$.pipe(
      map(getScheduleStatus),
      map((scheduleStatus) => scheduleStatus !== 'initial'),
    ),
    isOn$: store.state$.pipe(
      map(getScheduleStatus),
      map((scheduleStatus) => scheduleStatus === 'on'),
    ),
  })

const getScheduleStatus = ({
  schedule: {
    scheduleStatus,
  },
}: { schedule: ScheduleState }): ScheduleStatus => scheduleStatus
