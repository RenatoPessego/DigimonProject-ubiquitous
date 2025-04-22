import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomePage from './pages/WelcomePage';
import AppNavigator from './navigation/AppNavigator';



const Stack = createNativeStackNavigator();

export default function App() {
  return <AppNavigator />;
}

