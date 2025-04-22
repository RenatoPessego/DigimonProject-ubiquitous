import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config';
import NavBar from '../components/NavBar';

export default function HomePage() {
  const navigation = useNavigation();
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
        headers: { Authorization: `Bearer ${token}` },
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
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#E0F7FA',
        }}
      >
        <ActivityIndicator size="large" color="#2894B0" />
      </View>
    );
  }

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#E0F7FA',
        }}
      >
        <Text>You are not logged in.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#E0F7FA' }}>
      <NavBar />

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          Welcome, {user.email}!
        </Text>
        <Text style={{ fontSize: 16, color: '#666' }}>You are logged in.</Text>

        <TouchableOpacity
          style={{
            marginTop: 30,
            backgroundColor: '#2894B0',
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
          }}
          onPress={() => navigation.navigate('OpenPacks')}
        >
          <Text
            style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}
          >
            🎁 Open Packs
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
