import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ThemeProvider } from './components/ThemeContext'; 
import AppNavigator from './navigation/AppNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider> {}
        <AppNavigator />
    </ThemeProvider>
  );
}
