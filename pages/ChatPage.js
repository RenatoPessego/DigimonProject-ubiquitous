import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { API_URL } from '../config';
import { marketStyles as styles } from '../styles/marketStyles';

export default function ChatPage() {
  const route = useRoute();
  const { listingId, receiverId } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/messages/${listingId}/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessages(data.messages);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          listingId,
          receiverId,
          text: trimmed
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessages((prev) => [...prev, data.data]);
      setText('');
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const renderItem = ({ item }) => (
    <View
      style={{
        alignSelf: item.senderId === receiverId ? 'flex-start' : 'flex-end',
        backgroundColor: item.senderId === receiverId ? '#ccc' : '#2894B0',
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%'
      }}
    >
      <Text style={{ color: item.senderId === receiverId ? '#000' : '#fff' }}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F3F8FF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>💬 Chat</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15, marginBottom: 10 }}>
        <Text style={{ color: '#2894B0', fontWeight: 'bold' }}>← Back</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#2894B0" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, index) => item._id || index.toString()}
          contentContainerStyle={{ padding: 15 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          borderTopWidth: 1,
          borderColor: '#ddd',
          backgroundColor: '#fff'
        }}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 20,
            marginRight: 10
          }}
        />
        <TouchableOpacity onPress={sendMessage} style={{ justifyContent: 'center' }}>
          <Text style={{ fontWeight: 'bold', color: '#2894B0' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
