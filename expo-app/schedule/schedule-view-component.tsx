import React from 'react'
import { StyleSheet, View } from 'react-native'
import { CoreSwitch } from '@expo-app/schedule/core-switch-component'
import { ScheduleFeature } from '@schedule/schedule-feature'

interface ScheduleViewProps {
  schedule: ScheduleFeature
}

export const ScheduleView = ({ schedule }: ScheduleViewProps): JSX.Element => (
  <View testID="schedule-view" style={styles.mainView}>
    <CoreSwitch isOn$={ schedule.isOn$ } onToggle={(isOn) => {
      isOn
        ? schedule.switchOn({ interval: 5 * 60 * 1000 })
        : schedule.switchOff()
    }} />
  </View>
)

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222222',
  },
})
