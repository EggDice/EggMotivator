import React from 'react';
import type { FunctionComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NotificationService } from '../notification/notification';

export const getRoot = ({notification}: {notification: NotificationService}): FunctionComponent => () => (
  <View style={styles.container}>
    <Text onPress={() => {
      notification.setIntervalNotification({
        title: 'Focus',
        body: 'I mean really',
        interval: 10000,

      });
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
