import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { CoreSwitch } from './core-switch-component'
import { of, EMPTY } from 'rxjs'

test('render default state', () => {
  const { getByTestId } = render(<CoreSwitch isOn$={ EMPTY }/>)
  expect(getByTestId('switch')).toHaveProp('accessibilityRole', 'switch')
})

test('by default it should be off', () => {
  const { getByTestId } = render(<CoreSwitch isOn$={ EMPTY }/>)
  expect(getByTestId('switch'))
    .toHaveProp('accessibilityValue', { text: 'off' })
})

test('isOn$ prop should set the value', () => {
  const isOn$ = of(true)
  const { getByTestId } = render(<CoreSwitch isOn$={ isOn$ }/>)
  expect(getByTestId('switch'))
    .toHaveProp('accessibilityValue', { text: 'on' })
})

test('onToggle receives next state', async () => {
  const { getByTestId, rerender } = render(
      <CoreSwitch
        isOn$={ of(false) }
        onToggle={ (state) => {
          rerender(<CoreSwitch isOn$={ of(state) }/>)
        } }
      />,
  )
  fireEvent(getByTestId('switch'), 'pressOut')
  await waitFor(() => expect(getByTestId('switch'))
    .toHaveProp('accessibilityValue', { text: 'on' }))
})
