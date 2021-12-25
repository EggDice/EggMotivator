import type {
  NotificationHandler,
  NotificationRequestInput
} from 'expo-notifications';
import type { FunctionComponent } from 'react';

import { application } from './core/application';
import { getRoot } from './core/Root';

type ExpoNotifications = {
  setNotificationHandler:
    (handler: NotificationHandler) => void,
  scheduleNotificationAsync:
    (request: NotificationRequestInput) => Promise<string>,
};
type InternalServices = { Root: FunctionComponent };
type ExternalServices = { Notifications: ExpoNotifications };

export const main = ({
  run,
  services,
}: {
  run: ({ Root }: { Root: InternalServices["Root"] }) => FunctionComponent,
  services: ExternalServices,
}) => application<
  ExternalServices,
  InternalServices
>({
  externalServices: services,
  run,
  configure: ({ Notifications }) => {
   Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
    const Root = getRoot({Notifications});
    return { Root };
  }
});
