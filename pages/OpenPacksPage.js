import React, { useEffect, useState } from 'react';
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

export default function OpenPacksPage() {
  const [packs, setPacks] = useState([]);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [openingPackId, setOpeningPackId] = useState(null);
  const [rewardedCards, setRewardedCards] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const navigation = useNavigation();

  const fetchPacks = async () => {
    try {
      const res = await fetch(`${API_URL}/packs`);
      const data = await res.json();
      setPacks(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load packs');
    } finally {
      setLoadingPacks(false);
    }
  };

  const openPack = async (packId) => {
    setOpeningPackId(packId);
    setRewardedCards([]);
    setShowResult(false);

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`${API_URL}/packs/${packId}/open`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to open pack');

      setRewardedCards(data.cards);
      setSelectedIndex(0);
      setShowResult(true);
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not open pack');
    } finally {
      setOpeningPackId(null);
    }
  };

  const confirmOpen = (pack) => {
    Alert.alert(
      'Open Pack',
      `Do you want to open "${pack.name}" for ${pack.price} 🪙?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open',
          onPress: () => openPack(pack.id),
        },
      ]
    );
  };

  const renderPack = ({ item }) => (
    <TouchableOpacity
      style={styles.packBox}
      onPress={() => confirmOpen(item)}
      disabled={openingPackId !== null}
    >
      <Image
        source={{ uri: `${API_URL}/assets/${item.imageUrl}` }}
        style={styles.packImage}
      />
      <Text style={styles.packTitle}>{item.name}</Text>
      <Text style={styles.packPrice}>{item.price} 🪙</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    fetchPacks();
  }, []);

  return (
    <View style={styles.container}>
      <NavBar />
      <View style={styles.content}>
        <Text style={styles.title}>🎁 Available Packs</Text>

        {loadingPacks ? (
          <ActivityIndicator size="large" color="#2894B0" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={packs}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.packGrid}
            renderItem={renderPack}
          />
        )}

        {openingPackId && (
          <ActivityIndicator size="large" color="#2894B0" style={{ marginTop: 20 }} />
        )}

        {showResult && rewardedCards.length > 0 && (
          <View style={styles.cardReveal}>
            <TouchableOpacity
              onPress={() => setShowResult(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>✖</Text>
            </TouchableOpacity>

            <Text style={styles.revealTitle}>✨ You got:</Text>
            <Image
              source={{
                uri: rewardedCards[selectedIndex].image_url,
              }}
              style={styles.cardImage}
            />
            <Text style={styles.cardName}>{rewardedCards[selectedIndex].name}</Text>
            <Text style={styles.cardRarity}>
              Rarity: {rewardedCards[selectedIndex].rarity?.toUpperCase() || 'N/A'}
            </Text>

            <View style={styles.navigationButtons}>
              <TouchableOpacity
                disabled={selectedIndex === 0}
                onPress={() => setSelectedIndex((i) => i - 1)}
              >
                <Text style={styles.arrow}>◀</Text>
              </TouchableOpacity>

              <Text style={styles.indexText}>
                {selectedIndex + 1} / {rewardedCards.length}
              </Text>

              <TouchableOpacity
                disabled={selectedIndex === rewardedCards.length - 1}
                onPress={() => setSelectedIndex((i) => i + 1)}
              >
                <Text style={styles.arrow}>▶</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
