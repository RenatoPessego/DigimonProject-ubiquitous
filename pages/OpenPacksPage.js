import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import { openPacksStyles as styles } from '../styles/openPacksStyles';
import NavBar from '../components/NavBar';

const PACKS = [
  {
    id: 'free_pack',
    title: 'Free Pack',
    price: 0,
    description: '1 random card - mostly common',
    image: require('../assets/free-pack.png'),
    quantity: 1,
  },
  {
    id: 'starter_pack',
    title: 'Starter Pack',
    price: 50,
    description: '3 cards - chance of rare',
    image: require('../assets/free-pack.png'),
    quantity: 3,
  },
];

export default function OpenPacksPage() {
  const [loadingPackId, setLoadingPackId] = useState(null);
  const [resultCards, setResultCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  const openPack = async (pack) => {
    setLoadingPackId(pack.id);
    setResultCards([]);
    setCurrentIndex(0);

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');

      const cards = [];

      for (let i = 0; i < pack.quantity; i++) {
        const rarityRoll = Math.random();
        const rarity = rarityRoll < 0.95 ? 'c' : 'sr';

        const res = await fetch(`https://digimoncard.io/api-public/search.php?rarity=${rarity}`);
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No cards found from API');
        }

        const randomCard = data[Math.floor(Math.random() * data.length)];

        const backendRes = await fetch(`${API_URL}/cards/add`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cardId: randomCard.id }),
        });

        if (!backendRes.ok) {
          const err = await backendRes.json();
          throw new Error(err.message || 'Failed to add card');
        }

        cards.push(randomCard);
      }

      setResultCards(cards);
      setCurrentIndex(0);
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong opening the pack');
    } finally {
      setLoadingPackId(null);
    }
  };

  const confirmOpen = (pack) => {
    Alert.alert(
      'Open Pack',
      `Do you want to open "${pack.title}" for ${pack.price} 🪙?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open',
          onPress: () => openPack(pack),
        },
      ]
    );
  };

  const renderPack = ({ item }) => (
    <TouchableOpacity
      style={styles.packBox}
      onPress={() => confirmOpen(item)}
      disabled={loadingPackId !== null}
    >
      <Image source={item.image} style={styles.packImage} />
      <Text style={styles.packTitle}>{item.title}</Text>
      <Text style={styles.packPrice}>{item.price} 🪙</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <NavBar />
      <View style={styles.content}>
        <Text style={styles.title}>🎁 Available Packs</Text>

        <FlatList
          data={PACKS}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={renderPack}
          contentContainerStyle={styles.packGrid}
        />

        {loadingPackId && (
          <ActivityIndicator size="large" color="#2894B0" style={{ marginTop: 20 }} />
        )}

        {resultCards.length > 0 && (
          <View style={styles.cardReveal}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setResultCards([])}
            >
              <Text style={styles.closeText}>✖</Text>
            </TouchableOpacity>

            <Text style={styles.revealTitle}>✨ You got:</Text>
            <Image
              source={{
                uri: `https://images.digimoncard.io/images/cards/${resultCards[currentIndex].id}.jpg`,
              }}
              style={styles.cardImage}
            />
            <Text style={styles.cardName}>{resultCards[currentIndex].name}</Text>
            <Text style={styles.cardRarity}>
              Rarity: {resultCards[currentIndex].rarity.toUpperCase()}
            </Text>

            <View style={styles.carouselControls}>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentIndex === 0}
              >
                <Text style={styles.arrowText}>◀</Text>
              </TouchableOpacity>

              <Text style={styles.cardIndex}>
                {currentIndex + 1} / {resultCards.length}
              </Text>

              <TouchableOpacity
                style={styles.arrowButton}
                onPress={() =>
                  setCurrentIndex((prev) =>
                    Math.min(prev + 1, resultCards.length - 1)
                  )
                }
                disabled={currentIndex === resultCards.length - 1}
              >
                <Text style={styles.arrowText}>▶</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
