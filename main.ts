import type {
  ExpoNotifications
} from './notification/notifications-expo-external';
import type { FunctionComponent } from 'react';
import type { NotificationService } from './notification/notification';

import { application } from './core/application';
import { getRoot } from './core/Root';
import { notificationAdapter } from './notification/notification-adapter';

type InternalServices = {
  Root: FunctionComponent,
  notification: NotificationService
};
type ExternalServices = { ExternalNotifications: ExpoNotifications };

export const main = ({
  run,
  services,
}: {
  run: (services: InternalServices) => FunctionComponent,
  services: ExternalServices,
}) => application<
  ExternalServices,
  InternalServices
>({
  externalServices: services,
  run,
  configure: ({ ExternalNotifications }) => {
    const notification = notificationAdapter(ExternalNotifications);
    const Root = getRoot({notification});
    return { Root, notification };
  }
});
