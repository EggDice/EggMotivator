import {
  setNotificationHandler,
  scheduleNotificationAsync,
} from 'expo-notifications';

import { main } from './main';

const ExternalNotifications = {
  setNotificationHandler,
  scheduleNotificationAsync,
};

export default main({
  services: { ExternalNotifications },
  run: ({ Root }) => {
    return Root;
  },
});
