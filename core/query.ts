import type { Observable } from 'rxjs'

export interface CoreQuery {
  [key: string]: Observable<any>
}
