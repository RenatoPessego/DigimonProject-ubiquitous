import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
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
  const [loadingCards, setLoadingCards] = useState(true);

  // Fetch user profile using stored auth token
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return navigation.replace('Welcome');

      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
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

  // Slice user cards for pagination
  const getPaginatedCards = () => {
    if (!user || !Array.isArray(user.cards)) return [];
    const start = (currentPage - 1) * cardsPerPage;
    return user.cards.slice(start, start + cardsPerPage);
  };

  // Fetch full card details from YGOProDeck API or cache
  const fetchCardDetails = async () => {
    const paginated = getPaginatedCards();
    setLoadingCards(true);

    const cardsToFetch = [];
    const finalCards = [];

    for (const card of paginated) {
      const cacheKey = `card_${card.id}`;
      const cached = await AsyncStorage.getItem(cacheKey);

      if (cached) {
        finalCards.push({
          ...JSON.parse(cached),
          quantity: card.quantity,
        });
      } else {
        cardsToFetch.push(card);
      }
    }

    const fetchedCards = await Promise.all(
      cardsToFetch.map(async (card) => {
        try {
          if (!card.id) return null;

          const cleanId = parseInt(card.id); // ensure numeric ID
          const res = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${encodeURIComponent(cleanId)}`);
          const data = await res.json();

          if (!data.data || data.data.length === 0) {
            return {
              id: card.id,
              name: 'Unknown Card',
              image_url: null,
              quantity: card.quantity,
            };
          }

          const cardData = data.data[0];

          const result = {
            id: card.id,
            name: cardData.name,
            image_url: cardData.card_images?.[0]?.image_url || null,
            quantity: card.quantity,
          };

          await AsyncStorage.setItem(`card_${card.id}`, JSON.stringify(result));
          return result;
        } catch (err) {
          console.warn(`❌ Error fetching card ${card.id}:`, err.message);
          return {
            id: card.id,
            name: 'Unknown Card',
            image_url: null,
            quantity: card.quantity,
          };
        }
      })
    );

    const allCards = [...finalCards, ...fetchedCards.filter(Boolean)];
    setCardsInfo(allCards);
    setLoadingCards(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) fetchCardDetails();
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

  const renderCard = ({ item }) => (
    <View style={profileStyles.cardBox}>
      {loadingCards ? (
        <ActivityIndicator size="small" color="#2894B0" />
      ) : (
        <>
          <Image
            source={
              item.image_url
                ? { uri: item.image_url }
                : require('../assets/not-found-card.png')
            }
            style={profileStyles.cardImage}
          />
          <Text style={profileStyles.cardName}>{item.name}</Text>
          <Text style={profileStyles.cardQty}>x{item.quantity}</Text>
        </>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <NavBar />
      <FlatList
        contentContainerStyle={profileStyles.container}
        ListHeaderComponent={
          <>
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
            <Text style={profileStyles.balance}>
              Balance: {user.balance.toFixed(2)} 🪙
            </Text>

            {cardsInfo.length > 0 && (
              <Text style={profileStyles.sectionTitle}>Your Cards</Text>
            )}
          </>
        }
        data={cardsInfo}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        numColumns={3}
        ListFooterComponent={
          cardsInfo.length > 0 ? (
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
          ) : null
        }
      />
    </View>
  );
}
