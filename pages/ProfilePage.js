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
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sellMarketVisible, setSellMarketVisible] = useState(false);
  const [customPrice, setCustomPrice] = useState('');


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

  const ensureCardDetails = async (card) => {
    const hasFullInfo =
      card.desc && card.type && card.race && card.atk !== undefined && card.rarity && card.price;
    if (hasFullInfo) return card;

    try {
      const res = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${card.id}`);
      const data = await res.json();
      if (data?.data?.length > 0) {
        const full = data.data[0];

        const rarityFromSet = full.card_sets?.[0]?.set_rarity || '';
        const fallbackRarity = full.rarity || '';
        const combinedRarity =
          rarityFromSet && fallbackRarity
            ? `${rarityFromSet} (${fallbackRarity})`
            : rarityFromSet || fallbackRarity || 'Unknown';

        const enriched = {
          ...card,
          desc: full.desc,
          type: full.type,
          race: full.race,
          atk: full.atk,
          def: full.def,
          level: full.level,
          rarity: card.rarity || combinedRarity,
          price: full.card_prices?.[0]?.cardmarket_price || '',
          packSource: card.pack || card.packSource || null,
        };

        await AsyncStorage.setItem(`card_${card.id}`, JSON.stringify(enriched));
        return enriched;
      }
    } catch (err) {
      console.warn(`❌ Failed to fetch full data for card ${card.id}`, err.message);
    }
    return card;
  };

  const fetchCardDetails = async () => {
    const paginated = getPaginatedCards();
    setLoadingCards(true);

    const cardsToFetch = [];
    const finalCards = [];

    for (const card of paginated) {
      const cacheKey = `card_${card.id}`;
      const cached = await AsyncStorage.getItem(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached);
        const hasFullInfo =
          parsed.desc && parsed.type && parsed.race && parsed.atk !== undefined && parsed.rarity && parsed.price;
        if (hasFullInfo) {
          finalCards.push({ ...parsed, quantity: card.quantity });
        } else {
          cardsToFetch.push(card);
        }
      } else {
        cardsToFetch.push(card);
      }
    }

    const fetchedCards = await Promise.all(
      cardsToFetch.map(async (card) => {
        try {
          const cleanId = parseInt(card.id);
          const res = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${encodeURIComponent(cleanId)}`);
          const data = await res.json();

          if (!data.data || data.data.length === 0) return {
            id: card.id,
            name: 'Unknown Card',
            image_url: null,
            quantity: card.quantity,
          };

          const full = data.data[0];
          const rarityFromSet = full.card_sets?.[0]?.set_rarity || '';
          const fallbackRarity = full.rarity || '';
          const combinedRarity =
            rarityFromSet && fallbackRarity
              ? `${rarityFromSet} (${fallbackRarity})`
              : rarityFromSet || fallbackRarity || 'Unknown';

          const result = {
            id: card.id,
            name: full.name,
            image_url: full.card_images?.[0]?.image_url || null,
            quantity: card.quantity,
            desc: full.desc,
            type: full.type,
            race: full.race,
            atk: full.atk,
            def: full.def,
            level: full.level,
            rarity: card.rarity || combinedRarity,
            price: full.card_prices?.[0]?.cardmarket_price || '',
            packSource: card.pack || card.packSource || null,
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
    const completeRow = allCards.length % 3;
    if (completeRow !== 0) {
      const placeholdersToAdd = 3 - completeRow;
      for (let i = 0; i < placeholdersToAdd; i++) {
        allCards.push({ id: `placeholder-${i}`, placeholder: true });
      }
    }

    setCardsInfo(allCards);
    setLoadingCards(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) fetchCardDetails();
  }, [user, currentPage]);

  const totalPages = user && Array.isArray(user.cards)
    ? Math.ceil(user.cards.length / cardsPerPage)
    : 0;

  const handleCardPress = async (card) => {
    const fullCard = await ensureCardDetails(card);
    setSelectedCard(fullCard);
    setModalVisible(true);
  };

  const handleQuickSell = async () => {
    if (!selectedCard?.id || !selectedCard?.price || !selectedCard?.rarity || !selectedCard?.packSource) {
      Alert.alert('Error', 'Missing cardId, price, rarity or pack');
      return;
    }
  
    // 🔍 Log para confirmar o que está a ser enviado
    console.log('🟦 Selling card:', {
      cardId: selectedCard.id,
      price: selectedCard.price,
      rarity: selectedCard.rarity,
      pack: selectedCard.packSource,
    });
  
    Alert.alert(
      'Confirm Quick Sell',
      `Do you want to sell 1x "${selectedCard.name}" for ${selectedCard.price} 🪙?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sell',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');
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
              console.warn('❌ Quick sell error:', err.message);
              Alert.alert('Error', 'Something went wrong');
            }
          },
        },
      ]
    );
  };
  

  const handleSellOnMarket = () => {
    setCustomPrice(selectedCard?.price?.toString() || '');
    setSellMarketVisible(true);
  };
  

  const renderCard = ({ item }) => {
    if (item.placeholder) return <View style={{ width: '30%', margin: '1.5%' }} />;
    return (
      <TouchableOpacity onPress={() => handleCardPress(item)} style={profileStyles.cardBox}>
        {loadingCards ? (
          <ActivityIndicator size="small" color="#2894B0" />
        ) : (
          <>
            <Image
              source={item.image_url ? { uri: item.image_url } : require('../assets/not-found-card.png')}
              style={profileStyles.cardImage}
            />
            <Text style={profileStyles.cardName}>{item.name}</Text>
            <Text style={profileStyles.cardQty}>x{item.quantity}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

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
            {cardsInfo.length > 0 && <Text style={profileStyles.sectionTitle}>Your Cards</Text>}
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
              <Text style={profileStyles.pageNumber}>{currentPage} / {totalPages}</Text>
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

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={profileStyles.modalOverlay}>
          <View style={profileStyles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={profileStyles.closeButton}>
              <Text style={{ fontSize: 24 }}>❌</Text>
            </TouchableOpacity>

            {selectedCard && (
              <>
                <Image
                  source={selectedCard.image_url ? { uri: selectedCard.image_url } : require('../assets/not-found-card.png')}
                  style={profileStyles.modalImage}
                />
                <Text style={profileStyles.modalTitle}>{selectedCard.name}</Text>
                <Text style={profileStyles.modalText}>
                  <Text style={profileStyles.modalSubtitle}>Type: </Text>{selectedCard.type}
                </Text>
                <Text style={profileStyles.modalText}>
                  <Text style={profileStyles.modalSubtitle}>Race: </Text>{selectedCard.race}
                </Text>
                <Text style={profileStyles.modalText}>
                  <Text style={profileStyles.modalSubtitle}>Level: </Text>{selectedCard.level}
                </Text>
                <Text style={profileStyles.modalText}>
                  <Text style={profileStyles.modalSubtitle}>ATK/DEF: </Text>{selectedCard.atk}/{selectedCard.def}
                </Text>
                <Text style={profileStyles.modalText}>
                  <Text style={profileStyles.modalSubtitle}>Rarity: </Text>{selectedCard.rarity}
                </Text>
                <Text style={profileStyles.modalText}>
                  <Text style={profileStyles.modalSubtitle}>Price (Cardmarket): </Text>{selectedCard.price} 🪙
                </Text>
                <Text style={profileStyles.modalDesc}>{selectedCard.desc}</Text>
              </>
            )}

            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#2894B0',
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderRadius: 8,
                  marginRight: 10,
                }}
                onPress={handleQuickSell}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Quick Sell</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#ccc',
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderRadius: 8,
                }}
                onPress={handleSellOnMarket}
              >
                <Text style={{ color: '#333', fontWeight: 'bold' }}>Sell on Market</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={sellMarketVisible} transparent animationType="fade">
        <View style={profileStyles.modalOverlay}>
          <View style={[profileStyles.modalContent, { padding: 20 }]}>
            <Text style={profileStyles.modalTitle}>Sell on Market</Text>
            <Text style={{ marginBottom: 10 }}>
              Enter price to list 1x "{selectedCard?.name}" on the market:
            </Text>
            <TextInput
              value={customPrice}
              onChangeText={setCustomPrice}
              keyboardType="numeric"
              placeholder="Ex: 3.50"
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 6,
                padding: 10,
                marginBottom: 15
              }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => setSellMarketVisible(false)}
                style={{ backgroundColor: '#999', padding: 10, borderRadius: 6 }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  const price = parseFloat(customPrice);
                  if (isNaN(price) || price <= 0) {
                    Alert.alert('Invalid price', 'Please enter a valid number.');
                    return;
                  }

                  try {
                    const token = await AsyncStorage.getItem('authToken');
                    const res = await fetch(`${API_URL}/market/sell`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        cardId: selectedCard.id,
                        rarity: selectedCard.rarity,
                        pack: selectedCard.packSource || selectedCard.pack,
                        price
                      }),
                    });

                    const data = await res.json();
                    if (res.ok) {
                      setUser(data.user);
                      setSellMarketVisible(false);
                      setModalVisible(false);
                      Alert.alert('Listed!', `Card listed for ${price.toFixed(2)} 🪙`);
                    } else {
                      Alert.alert('Error', data.message || 'Could not list card');
                    }
                  } catch (err) {
                    console.warn('❌ Sell on market error:', err.message);
                    Alert.alert('Error', 'Something went wrong');
                  }
                }}
                style={{ backgroundColor: '#2894B0', padding: 10, borderRadius: 6 }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
