import { notificationAdapter } from './notification-adapter';
import { fakeExpoNotifications } from './fake-notifications-expo-external';

test('Init expo notification on creation', () => {
  const { mockExpoNotifications } = createNotificationService();

  expect(mockExpoNotifications.setNotificationHandler).toHaveBeenCalled();
});

test('Start notification interval', async () => {
  const {
    mockExpoNotifications,
    notificationService,
  } = createNotificationService();

  const id = await notificationService.setIntervalNotification({
    title: 'hello',
    body: 'this is it',
    interval: 10000,
  });

  expect(await mockExpoNotifications.getAllScheduledNotificationsAsync())
    .toEqual([{
      'content': {
        'autoDismiss': true,
        'badge': null,
        'body': 'this is it',
        'data': null,
        'sound': 'default',
        'sticky': false,
        'subtitle': null,
        'title': 'hello',
      },
      'identifier': '0',
      'trigger': {
        'channelId': null,
        'repeats': true,
        'seconds': 10,
        'type': 'timeInterval',
      },
    }]);
  expect(id).toBe('0');
});

test('Stop notification interval', async () => {
  const {
    mockExpoNotifications,
    notificationService,
  } = createNotificationService();

  const id = await notificationService.setIntervalNotification({
    title: 'hello',
    body: 'this is it',
    interval: 10000,
  });
  await notificationService.clearIntervalNotification(id);

  expect(await mockExpoNotifications.getAllScheduledNotificationsAsync())
    .toEqual([]);
});

test('List scheduled interval notifications', async () => {
  const {
    mockExpoNotifications,
    notificationService,
  } = createNotificationService();

  await mockExpoNotifications.scheduleNotificationAsync({
    content: {
      title: 'hello',
      body: 'this is it',
    },
    trigger: {
      seconds: 10,
      repeats: true,
    },
  });
  await mockExpoNotifications.scheduleNotificationAsync({
    content: {
      title: 'hello 2',
      body: 'this is it',
    },
    trigger: {
      seconds: 5,
      repeats: true,
    },
  });

  expect(await notificationService.getIntervalNotifications())
    .toEqual([{
        title: 'hello',
        body: 'this is it',
        interval: 10000,
        id: '0',
      }, {
        title: 'hello 2',
        body: 'this is it',
        interval: 5000,
        id: '1',
    }]);
});

test('Clear all interval notiications', async () => {
  const {
    mockExpoNotifications,
    notificationService,
  } = createNotificationService();

  await mockExpoNotifications.scheduleNotificationAsync({
    content: {
      title: 'hello',
      body: 'this is it',
    },
    trigger: {
      seconds: 10,
      repeats: true,
    },
  });
  await mockExpoNotifications.scheduleNotificationAsync({
    content: {
      title: 'hello 2',
      body: 'this is it',
    },
    trigger: {
      seconds: 5,
      repeats: true,
    },
  });
  await notificationService.clearAllIntervalNotification();
  expect(await mockExpoNotifications.getAllScheduledNotificationsAsync())
    .toEqual([]);
});

const createNotificationService = () => {
  const mockExpoNotifications = fakeExpoNotifications();
  jest.spyOn(mockExpoNotifications, 'setNotificationHandler');
  return {
    mockExpoNotifications,
    notificationService: notificationAdapter(mockExpoNotifications),
  };
};
