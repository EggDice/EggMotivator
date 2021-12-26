import { notificationAdapter } from './notification-adapter';

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

  expect(mockExpoNotifications.scheduleNotificationAsync)
    .toHaveBeenCalledWith({
      content: {
        title: 'hello',
        body: 'this is it',
      },
      trigger: {
        seconds: 10,
      },
    });
  expect(id).toBe('1');
});

const createNotificationService = () => {
  const mockExpoNotifications = {
    setNotificationHandler: jest.fn(),
    scheduleNotificationAsync: jest.fn(async () => '1'),
  };
  return {
    mockExpoNotifications,
    notificationService: notificationAdapter(mockExpoNotifications),
  };
};
