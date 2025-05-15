import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getLoginStyles } from '../styles/loginStyles';
import { API_URL } from '../config';

export default function LoginPage() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const styles = getLoginStyles(isPortrait);

  const handleLogin = async () => {
    if (!username || !password) {
      return Alert.alert('Please fill in all fields');
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('authToken', data.token);
        navigation.replace('Home');
      } else {
        Alert.alert('Login failed', data.message || 'Invalid credentials');
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to connect to server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Welcome')}>
        <Text style={styles.backText}>Back to Welcome Page</Text>
      </TouchableOpacity>
    </View>
  );
}
