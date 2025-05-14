import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

export default function usePushNotifications() {
  useEffect(() => {
    console.log('🚀 usePushNotifications hook iniciado');
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    console.log('📲 A iniciar registo de notificações...');

    let token;

    if (!Device.isDevice) {
      console.warn('⚠️ Notificações push requerem dispositivo físico');
      return;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('🔒 Permissão atual:', existingStatus);

      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log('🔐 Permissão solicitada, novo status:', finalStatus);
      }

      if (finalStatus !== 'granted') {
        console.warn('❌ Permissões negadas para notificações');
        return;
      }

      const tokenObj = await Notifications.getExpoPushTokenAsync();
      token = tokenObj.data;
      console.log('📱 Token Expo obtido:', token);

      if (!token) {
        console.warn('❌ Token é undefined!');
        return;
      }

      const jwt = await AsyncStorage.getItem('authToken');
      console.log('🔑 Token JWT:', jwt);

      if (!jwt) {
        console.warn('⚠️ authToken não encontrado — utilizador não autenticado?');
        return;
      }

      const res = await fetch(`${API_URL}/user/pushtoken`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.warn('❌ Erro ao enviar push token:', result.message);
      } else {
        console.log('✅ Push token enviado com sucesso!');
      }
    } catch (err) {
      console.error('❌ Erro geral no registo de notificações:', err);
    }
  }
}
