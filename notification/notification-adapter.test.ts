import { notificationAdapter } from './notification-adapter';
import { fakeExpoNotifications } from './fake-notifications-expo-external';
import { firstValueFrom } from 'rxjs';
import { CoreError } from '@core/error';

test('Init expo notification on creation', () => {
  const { mockExpoNotifications } = createNotificationService();

  expect(mockExpoNotifications.setNotificationHandler).toHaveBeenCalled();
});

test('Start notification interval', async () => {
  const {
    mockExpoNotifications,
    notificationService,
  } = createNotificationService();

  const id = await firstValueFrom(
    notificationService.setIntervalNotification({
      title: 'hello',
      body: 'this is it',
      interval: 10000,
    })
  );

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

test('Scheduling error propagation', async () => {
  const cause = new Error('original error');
  const {
    mockExpoNotifications,
    notificationService,
  } = createNotificationService({
    scheduleNotificationAsync: { type: 'async', error: cause, },
  });

  await expect(firstValueFrom(notificationService.setIntervalNotification({
    title: 'hello',
    body: 'this is it',
    interval: 1000,
  })))
    .rejects.toEqual(
      new CoreError('Could not schedule notification', { cause })
    );
});


test('Stop notification interval', async () => {
  const {
    mockExpoNotifications,
    notificationService,
  } = createNotificationService();

  const id = await mockExpoNotifications.scheduleNotificationAsync({
    content: {
      title: 'hello',
      body: 'this is it',
    },
    trigger: {
      seconds: 10,
      repeats: true,
    },
  });
  await firstValueFrom(notificationService.clearIntervalNotification(id));

  expect(await mockExpoNotifications.getAllScheduledNotificationsAsync())
    .toEqual([]);
});

test('Clearing error propagation', async () => {
  const cause = new Error('original error');
  const {
    mockExpoNotifications,
    notificationService,
  } = createNotificationService({
    cancelScheduledNotificationAsync: { type: 'async', error: cause },
  });

  await expect(firstValueFrom(notificationService.clearIntervalNotification(
    '1',
  )))
    .rejects.toEqual(
      new CoreError('Could not clear notification', { cause })
    );
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

  expect(await firstValueFrom(notificationService.getIntervalNotifications()))
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

test('List error propagation', async () => {
  const cause = new Error('original error');
  const {
    mockExpoNotifications,
    notificationService,
  } = createNotificationService({
    getAllScheduledNotificationsAsync: { type: 'async', error: cause, },
  });

  await expect(firstValueFrom(notificationService.getIntervalNotifications()))
    .rejects.toEqual(
      new CoreError('Unable to check the scheduled notifications', { cause })
    );
});

test('Clear all interval notifications', async () => {
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
  await notificationService.clearAllIntervalNotifications();
  expect(await mockExpoNotifications.getAllScheduledNotificationsAsync())
    .toEqual([]);
});

test('Clearing all error propagation', async () => {
  const cause = new Error('original error');
  const {
    mockExpoNotifications,
    notificationService,
  } = createNotificationService({
    cancelAllScheduledNotificationsAsync: { type: 'async', error: cause, },
  });

  await expect(
    firstValueFrom(notificationService.clearAllIntervalNotifications()))
      .rejects.toEqual(
        new CoreError('Could not clear notifications', { cause })
      );
});

const createNotificationService = (configs = {}) => {
  const mockExpoNotifications = fakeExpoNotifications(configs);
  jest.spyOn(mockExpoNotifications, 'setNotificationHandler');
  return {
    mockExpoNotifications,
    notificationService: notificationAdapter(mockExpoNotifications),
  };
};
