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
    Promise<string>;
  clearIntervalNotification(id: string): Promise<void>;
  getIntervalNotifications(): Promise<IntervalNotification[]>;
  clearAllIntervalNotification(): Promise<void>;
};
