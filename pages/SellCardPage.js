import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config';
import { getMarketStyles } from '../styles/marketStyles';
import NavBar from '../components/NavBar';

export default function SellCardPage() {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const styles = getMarketStyles(isPortrait);

  const [myCards, setMyCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceMap, setPriceMap] = useState({});
  const navigation = useNavigation();

  const fetchMyCards = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/market/mycards`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error fetching cards');

      const enriched = await Promise.all(data.cards.map(async (card) => {
        const cacheKey = `card_${card.id}`;
        const cached = await AsyncStorage.getItem(cacheKey);

        if (cached) {
          const parsed = JSON.parse(cached);
          return { ...parsed, quantity: card.quantity, rarity: card.rarity, pack: card.pack };
        }

        try {
          const res = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${card.id}`);
          const cardData = await res.json();
          if (cardData?.data?.length > 0) {
            const full = cardData.data[0];
            const enrichedCard = {
              ...card,
              name: full.name,
              desc: full.desc,
              price: full.card_prices?.[0]?.cardmarket_price || '',
              image_url: full.card_images?.[0]?.image_url,
              rarity: card.rarity,
              pack: card.pack
            };
            await AsyncStorage.setItem(cacheKey, JSON.stringify(enrichedCard));
            return enrichedCard;
          }
        } catch {
          return card;
        }

        return card;
      }));

      setMyCards(enriched);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async (card) => {
    const key = `${card.id}_${card.rarity}_${card.pack}`;
    const price = priceMap[key];

    if (!price || isNaN(price) || Number(price) <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/market/sell`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cardId: card.id,
          rarity: card.rarity,
          pack: card.pack,
          price: Number(price)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      Alert.alert('Success', 'Card listed for sale!');
      fetchMyCards(); // refresh
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  useEffect(() => {
    fetchMyCards();
  }, []);

  const renderItem = ({ item }) => {
    const key = `${item.id}_${item.rarity}_${item.pack}`;
    return (
      <View style={styles.cardContainer}>
        <Image
          source={{ uri: `https://images.ygoprodeck.com/images/cards/${item.id}.jpg` }}
          style={styles.cardImage}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardText}>Card ID: {item.id}</Text>
          <Text style={styles.cardText}>Rarity: {item.rarity}</Text>
          <Text style={styles.cardText}>Pack: {item.pack}</Text>
          <Text style={styles.cardText}>Quantity: {item.quantity}</Text>
          <Text style={styles.cardText}>Market Price: {item.price} 🪙</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="Set price"
            keyboardType="numeric"
            value={priceMap[key] || ''}
            onChangeText={(text) => setPriceMap({ ...priceMap, [key]: text })}
          />
          <TouchableOpacity style={styles.sellButton} onPress={() => handleSell(item)}>
            <Text style={styles.sellButtonText}>Sell</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <NavBar />
      <Text style={styles.title}>📤 Sell Cards</Text>
      <TouchableOpacity
        style={styles.viewListingsButton}
        onPress={() => navigation.navigate('MyListings')}
      >
        <Text style={styles.viewListingsText}>View My Listings</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#2894B0" style={{ marginTop: 40 }} />
      ) : myCards.length === 0 ? (
        <Text style={styles.noCardsText}>You have no cards to sell.</Text>
      ) : (
        <FlatList
          data={myCards}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          contentContainerStyle={styles.cardList}
        />
      )}
    </View>
  );
}
