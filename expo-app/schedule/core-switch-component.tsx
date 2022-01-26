import React from 'react'
import { StyleSheet, Pressable, Text } from 'react-native'
import type { Observable } from 'rxjs'
import { useObservableState } from 'observable-hooks'
import { LinearGradient } from 'expo-linear-gradient'

interface CoreSwitchProps {
  isOn$: Observable<boolean>
  onToggle?: (state: boolean) => void
}

export const CoreSwitch = ({ isOn$, onToggle = () => {} }: CoreSwitchProps): JSX.Element => {
  const isOn = useObservableState(isOn$, false)
  const accessibilityValue = {
    text: isOn ? 'on' : 'off',
  }
  return (
    <Pressable
      testID='switch'
      accessibilityRole='switch'
      accessibilityValue={ accessibilityValue }
      onPressOut={ () => { onToggle(!isOn) } }
    >
      <LinearGradient
        colors={ buttonColors(isOn) }
        style={ styles.background }
        start={ [0, 1] }
        end={ [1, 0] }
      >
        <Text
          style={ styles.text }
        >{ isOn ? 'Stop' : 'Start' }</Text>
      </LinearGradient>
    </Pressable>
  )
}

const buttonColors = (isOn: boolean): string[] => isOn
  ? [
      'rgba(0, 187, 249, 1)',
      'rgba(0, 245, 212, 1)',
    ]
  : [
      'rgba(155, 93, 229, 1)',
      'rgba(241, 91, 181, 1)',
    ]

const styles = StyleSheet.create({
  background: {
    borderRadius: 40,
    width: 160,
    height: 100,
  },
  text: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    padding: 30,
    textAlign: 'center',
  },
})
