import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config';
import { getProfileStyles } from '../styles/profileStyles';
import NavBar from '../components/NavBar';
import * as Animatable from 'react-native-animatable';

export default function ProfilePage() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const styles = getProfileStyles(isPortrait);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(9);
  const [cardsInfo, setCardsInfo] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sellMarketVisible, setSellMarketVisible] = useState(false);
  const [customPrice, setCustomPrice] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) fetchCardDetails();
  }, [user, currentPage]);

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

  const getPaginatedCards = () => {
    if (!user || !Array.isArray(user.cards)) return [];
    const start = (currentPage - 1) * cardsPerPage;
    return user.cards.slice(start, start + cardsPerPage);
  };

  const fetchCardDetails = async () => {
    const paginated = getPaginatedCards();
    setLoadingCards(true);
    const finalCards = [];

    for (const card of paginated) {
      const cacheKey = `card_${card.id}`;
      const cached = await AsyncStorage.getItem(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached);
        finalCards.push({ ...parsed, quantity: card.quantity });
      } else {
        try {
          const res = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${card.id}`);
          const data = await res.json();

          if (data?.data?.length > 0) {
            const full = data.data[0];
            const enriched = {
              id: card.id,
              name: full.name,
              desc: full.desc,
              type: full.type,
              race: full.race,
              atk: full.atk,
              def: full.def,
              level: full.level,
              rarity: full.rarity || 'Unknown',
              image_url: full.card_images?.[0]?.image_url || null,
              price: full.card_prices?.[0]?.cardmarket_price || '',
              quantity: card.quantity,
            };
            await AsyncStorage.setItem(cacheKey, JSON.stringify(enriched));
            finalCards.push(enriched);
          } else {
            finalCards.push({ id: card.id, name: 'Unknown Card', quantity: card.quantity, image_url: null });
          }
        } catch {
          finalCards.push({ id: card.id, name: 'Unknown Card', quantity: card.quantity, image_url: null });
        }
      }
    }

    const completeRow = finalCards.length % 3;
    if (completeRow !== 0) {
      const placeholders = 3 - completeRow;
      for (let i = 0; i < placeholders; i++) {
        finalCards.push({ id: `placeholder-${i}`, placeholder: true });
      }
    }

    setCardsInfo(finalCards);
    setLoadingCards(false);
  };

  const totalPages = user?.cards ? Math.ceil(user.cards.length / cardsPerPage) : 0;

  const handleCardPress = (card) => {
    setSelectedCard(card);
    setModalVisible(true);
  };

  const handleQuickSell = async () => {
    if (!selectedCard) return;
    const token = await AsyncStorage.getItem('authToken');

    try {
      const res = await fetch(`${API_URL}/cards/quick-sell`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cardId: selectedCard.id,
          price: selectedCard.price,
          rarity: selectedCard.rarity,
          pack: selectedCard.packSource,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setModalVisible(false);
        Alert.alert('Sold!', `You received ${parseFloat(selectedCard.price).toFixed(2)} 🪙`);
      } else {
        Alert.alert('Error', data.message || 'Could not sell card');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleSellOnMarket = () => {
    setCustomPrice(selectedCard?.price?.toString() || '');
    setSellMarketVisible(true);
  };

  const renderCard = ({ item }) => {
    if (item.placeholder) return <View style={{ width: '30%', margin: '1.5%' }} />;
    return (
      <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.cardBox}>
        {loadingCards ? (
          <ActivityIndicator size="small" color="#2894B0" />
        ) : (
          <>
            <Image
              source={item.image_url ? { uri: item.image_url } : require('../assets/not-found-card.png')}
              style={styles.cardImage}
            />
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardQty}>x{item.quantity}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2894B0" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text>Could not load profile data.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <NavBar />
      <FlatList
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <>
            <Image
              source={user.profileImage?.startsWith('data') ? { uri: user.profileImage } : require('../assets/profile-placeholder.png')}
              style={styles.avatar}
            />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>@{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.birthDate}>Birth: {new Date(user.birthDate).toLocaleDateString()}</Text>
            <Text style={styles.balance}>Balance: {user.balance.toFixed(2)} 🪙</Text>
            {cardsInfo.length > 0 && <Text style={styles.sectionTitle}>Your Cards</Text>}
          </>
        }
        data={cardsInfo}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        numColumns={3}
        ListFooterComponent={
          cardsInfo.length > 0 ? (
            <View style={styles.paginationContainer}>
              <TouchableOpacity disabled={currentPage === 1} onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                <Text style={styles.pageButton}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.pageNumber}>{currentPage} / {totalPages}</Text>
              <TouchableOpacity disabled={currentPage === totalPages} onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
                <Text style={styles.pageButton}>▶</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      {/* MODAL COM VISUALIZAÇÃO RESPONSIVA */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#ffffff',
          zIndex: 999,
          justifyContent: 'flex-start',
        }}>
          {selectedCard && (
            <>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  zIndex: 10,
                  padding: 5,
                }}
              >
                <Text style={{ fontSize: 28, color: '#444' }}>✖</Text>
              </TouchableOpacity>

              <View style={{
  flexDirection: isPortrait ? 'column' : 'row',
  alignItems: 'flex-start',
  paddingHorizontal: 20,
  paddingTop: 30,
  paddingBottom: 20,
  flex: 1,
}}>
  <View style={{ alignItems: 'center', flex: isPortrait ? undefined : 0 }}>
    <Text style={{
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
    }}>
      {selectedCard.name}
    </Text>

    <Animatable.Image
      animation="zoomIn"
      duration={600}
      easing="ease-out"
      source={selectedCard.image_url ? { uri: selectedCard.image_url } : require('../assets/not-found-card.png')}
      style={{
        width: isPortrait ? width * 0.6 : width * 0.4,
        height: isPortrait ? height * 0.45 : height * 0.55,
        resizeMode: 'contain',
        marginBottom: isPortrait ? 10 : 0,
        marginRight: isPortrait ? 0 : 20,
      }}
    />
  </View>

  <View style={{ flex: 1, justifyContent: 'flex-start' }}>
    <Text style={styles.modalText}><Text style={styles.modalSubtitle}>Type:</Text> {selectedCard.type}</Text>
    <Text style={styles.modalText}><Text style={styles.modalSubtitle}>Race:</Text> {selectedCard.race}</Text>
    <Text style={styles.modalText}><Text style={styles.modalSubtitle}>Level:</Text> {selectedCard.level}</Text>
    <Text style={styles.modalText}><Text style={styles.modalSubtitle}>ATK/DEF:</Text> {selectedCard.atk}/{selectedCard.def}</Text>
    <Text style={styles.modalText}><Text style={styles.modalSubtitle}>Rarity:</Text> {selectedCard.rarity}</Text>
    <Text style={styles.modalText}><Text style={styles.modalSubtitle}>Price:</Text> {selectedCard.price} 🪙</Text>
    <Text style={styles.modalDesc}>{selectedCard.desc}</Text>

    <View style={{
      flexDirection: 'row',
      marginTop: 20,
      justifyContent: 'center',
    }}>
      <TouchableOpacity style={[styles.quickSellButton, { marginRight: 10 }]} onPress={handleQuickSell}>
        <Text style={styles.quickSellButtonText}>Quick Sell</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.marketSellButton} onPress={handleSellOnMarket}>
        <Text style={styles.marketSellButtonText}>Sell on Market</Text>
      </TouchableOpacity>
    </View>
  </View>
</View>

            </>
          )}
        </View>
      </Modal>
    </View>
  );
}
