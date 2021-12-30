import {
  setNotificationHandler,
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
  cancelAllScheduledNotificationsAsync,
  getAllScheduledNotificationsAsync,
} from 'expo-notifications';

import { main } from './app/main';

const ExternalNotifications = {
  setNotificationHandler,
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
  cancelAllScheduledNotificationsAsync,
  getAllScheduledNotificationsAsync,
};

export default main({
  services: { ExternalNotifications },
  run: ({ Root }) => {
    return Root;
  },
});
