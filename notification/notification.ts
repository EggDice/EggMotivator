export interface IntervalNotificationSchedule {
  title: string;
  body: string;
  interval: number;
};

export interface NotificationService {
  setIntervalNotification(schedule: IntervalNotificationSchedule):
    Promise<string>;
  clearIntervalNotification(id: string): Promise<void>;
};
