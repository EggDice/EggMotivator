import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from "expo-background-fetch"


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text onPress={() => {
      console.log('mamlasz');
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
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
