import type { Observable } from 'rxjs';

export interface IntervalNotificationSchedule {
  title: string;
  body: string;
  interval: number;
};

export interface IntervalNotification extends IntervalNotificationSchedule {
  id: string;
};

export interface NotificationService {
  setIntervalNotification(schedule: IntervalNotificationSchedule):
    Observable<string>;
  clearIntervalNotification(id: string): Observable<void>;
  getIntervalNotifications(): Observable<IntervalNotification[]>;
  clearAllIntervalNotifications(): Observable<void>;
};
