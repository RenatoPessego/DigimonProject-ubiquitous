import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import { homeStyles } from '../styles/homeStyles';
import NavBar from '../components/NavBar';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Not authenticated');
        return;
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        Alert.alert('Error', data.message || 'Unauthorized');
      }
    } catch (err) {
      Alert.alert('Error', 'Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={homeStyles.loading}>
        <ActivityIndicator size="large" color="#2894B0" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={homeStyles.notAuth}>
        <Text>You are not logged in.</Text>
      </View>
    );
  }

  return (
    <View>
        <NavBar />
    
    <View style={homeStyles.container}>
      <Text style={homeStyles.welcomeText}>Welcome, {user.email}!</Text>
      <Text style={homeStyles.subText}>You are logged in.</Text>
    </View>
    </View>
  );
}
