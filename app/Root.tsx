import React from 'react'
import type { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import type { ScheduleFeature } from '@schedule/schedule-feature'
import { useObservableState } from 'observable-hooks'
import { ScheduleView } from '@expo-app/schedule/schedule-view-component'

export const getRoot = ({ schedule }: {schedule: ScheduleFeature}): FunctionComponent => () => {
  return (
    <View style={ styles.container }>
      <ScheduleView schedule={ schedule } />
      <StatusBar style='light' />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
})
