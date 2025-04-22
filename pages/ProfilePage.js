import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config';
import { profileStyles } from '../styles/profileStyles';
import NavBar from '../components/NavBar';

export default function ProfilePage() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(9);
  const [cardsInfo, setCardsInfo] = useState([]);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return navigation.replace('Welcome');

      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        console.log('✅ User data:', data.user);
        setUser(data.user);
      } else {
        Alert.alert('Error', data.message || 'Unauthorized');
        navigation.replace('Welcome');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchCardDetails = async (cardsToFetch) => {
    if (!Array.isArray(cardsToFetch) || cardsToFetch.length === 0) return;

    console.log('📦 Paginated card IDs:', cardsToFetch.map((c) => c.id));

    const promises = cardsToFetch.map(async (cardObj) => {
      try {
        const res = await fetch(`https://digimoncard.io/api-public/search.php?card=${cardObj.id}`);
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          console.warn(`⚠️ Card not found for ID: ${cardObj.id}`);
          return null;
        }

        return {
          ...data[0],
          quantity: cardObj.quantity,
        };
      } catch (err) {
        console.error(`❌ Error fetching card ${cardObj.id}`, err);
        return null;
      }
    });

    const results = await Promise.all(promises);
    const validCards = results.filter((card) => card !== null);
    console.log('🎴 Fetched card details:', validCards);
    setCardsInfo(validCards);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user && Array.isArray(user.cards)) {
      const start = (currentPage - 1) * cardsPerPage;
      const paginated = user.cards.slice(start, start + cardsPerPage);
      fetchCardDetails(paginated);
    }
  }, [user, currentPage]);

  if (loading) {
    return (
      <View style={profileStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#2894B0" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={profileStyles.errorContainer}>
        <Text>Could not load profile data.</Text>
      </View>
    );
  }

  const totalPages = Array.isArray(user.cards)
    ? Math.ceil(user.cards.length / cardsPerPage)
    : 0;

  return (
    <View style={{ flex: 1 }}>
      <NavBar />

      <ScrollView contentContainerStyle={profileStyles.container}>
        {/* Profile Info */}
        <Image
          source={
            user.profileImage?.startsWith('data')
              ? { uri: user.profileImage }
              : require('../assets/profile-placeholder.png')
          }
          style={profileStyles.avatar}
        />
        <Text style={profileStyles.name}>{user.name}</Text>
        <Text style={profileStyles.username}>@{user.username}</Text>
        <Text style={profileStyles.email}>{user.email}</Text>
        <Text style={profileStyles.birthDate}>
          Birth: {new Date(user.birthDate).toLocaleDateString()}
        </Text>
        <Text style={profileStyles.balance}>Balance: {user.balance.toFixed(2)} 🪙</Text>

        {/* Card section */}
        {cardsInfo.length > 0 && (
          <>
            <Text style={profileStyles.sectionTitle}>Your Cards</Text>

            <FlatList
              data={cardsInfo}
              numColumns={3}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={profileStyles.cardBox}>
                  <Image
                    source={{
                      uri: `https://images.digimoncard.io/images/cards/${item.id}.jpg`,
                    }}
                    style={profileStyles.cardImage}
                  />
                  <Text style={profileStyles.cardName}>{item.name}</Text>
                  <Text style={profileStyles.cardQty}>x{item.quantity}</Text>
                </View>
              )}
            />

            <View style={profileStyles.paginationContainer}>
              <TouchableOpacity
                disabled={currentPage === 1}
                onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <Text style={profileStyles.pageButton}>◀</Text>
              </TouchableOpacity>

              <Text style={profileStyles.pageNumber}>
                {currentPage} / {totalPages}
              </Text>

              <TouchableOpacity
                disabled={currentPage === totalPages}
                onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                <Text style={profileStyles.pageButton}>▶</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
