import React from 'react';
import type { FunctionComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export const getRoot = ({Notifications}: {Notifications: any}): FunctionComponent => () => (
  <View style={styles.container}>
    <Text onPress={() => {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Time's up!",
          body: 'Change sides!',
        },
        trigger: {
      seconds: 10,
        },
      }).then(console.log);
    }}>Hello Open up App.tsx to start working on your app!</Text>
    <StatusBar style="auto" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
