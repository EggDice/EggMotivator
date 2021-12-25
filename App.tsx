import {
  setNotificationHandler,
  scheduleNotificationAsync,
} from 'expo-notifications';

import { main } from './main';

const Notifications = {
  setNotificationHandler,
  scheduleNotificationAsync,
};

export default main({
  services: { Notifications },
  run: ({ Root }) => {
    return Root;
  },
});
