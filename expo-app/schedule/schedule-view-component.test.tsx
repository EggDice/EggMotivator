import React from 'react'
import { render, act, waitFor, fireEvent } from '@testing-library/react-native'
import { ScheduleView } from './schedule-view-component'
import { appStore } from '@app/app-store'
import {
  fakeNotificationService,
} from '@notification/fake-notification-service'
import type { NotificationService } from '@notification/notification'
import { createSchedule } from '@schedule/schedule-feature'
import type { ScheduleFeature } from '@schedule/schedule-feature'

test('it should render', () => {
  const { schedule } = createFeature()
  const { getByTestId } = render(<ScheduleView schedule={ schedule }/>)
  expect(getByTestId('schedule-view')).not.toBeEmpty()
})

test('get switch info from schedule', async () => {
  const { schedule } = createFeature()
  const { getByTestId } = render(<ScheduleView schedule={ schedule }/>)
  expect(getByTestId('switch'))
    .toHaveProp('accessibilityValue', { text: 'off' })
  void act(() => {
    schedule.switchOn({ interval: 5 * 60 * 1000 })
  })
  await waitFor(() => expect(getByTestId('switch'))
    .toHaveProp('accessibilityValue', { text: 'on' }))
})

test('should switch on', async () => {
  const { schedule } = createFeature()
  const { getByTestId } = render(<ScheduleView schedule={ schedule }/>)
  fireEvent(getByTestId('switch'), 'pressOut')
  await waitFor(() => expect(getByTestId('switch'))
    .toHaveProp('accessibilityValue', { text: 'on' }))
})

test('should switch off', async () => {
  const { schedule } = createFeature()
  const { getByTestId } = render(<ScheduleView schedule={ schedule }/>)
  schedule.switchOn({ interval: 5 * 60 * 1000 })
  await waitFor(() => expect(getByTestId('switch'))
    .toHaveProp('accessibilityValue', { text: 'on' }))
  fireEvent(getByTestId('switch'), 'pressOut')
  // Unfortunatelly two waitFor calls are raising an error
  // eslint-disable-next-line
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1))
  })
  expect(getByTestId('switch'))
    .toHaveProp('accessibilityValue', { text: 'off' })
})

const createFeature = (configs = {}): {
  schedule: ScheduleFeature
  notificationService: NotificationService
} => {
  const store = appStore()
  const notificationService = fakeNotificationService(configs)
  const schedule = createSchedule({ store, notificationService })
  return { schedule, notificationService }
}
