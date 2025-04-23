import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import { openPacksStyles as styles } from '../styles/openPacksStyles';
import NavBar from '../components/NavBar';

export default function OpenPacksPage() {
  const [rarity, setRarity] = useState('common');
  const [cardCount, setCardCount] = useState(1);
  const [setList, setSetList] = useState([]);
  const [packSource, setPackSource] = useState('');
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [opening, setOpening] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCards, setShowCards] = useState(false);

  const rarityOptions = ['common', 'rare', 'super_rare', 'legendary'];
  const cardCountOptions = [1, 3, 5, 7, 9];

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const res = await fetch('https://db.ygoprodeck.com/api/v7/cardsets.php');
        const data = await res.json();
        if (Array.isArray(data)) {
          setSetList(data.map(set => set.set_name));
          setPackSource(data[0].set_name); // default
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load pack sets');
      }
    };
    fetchSets();
  }, []);

  const generatePack = async () => {
    try {
      setLoading(true);
      setShowCards(false);

      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Token missing');

      const response = await fetch(`${API_URL}/packs/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rarityType: rarity, cardCount, packSource }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setPack(data.packs[0]); // Use only the first pack
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not generate pack');
    } finally {
      setLoading(false);
    }
  };

  const openPack = async () => {
    try {
      setOpening(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`${API_URL}/packs/open`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rarity: pack.rarity,
          cardCount: pack.cardCount,
          packSource: pack.packSource,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setCards(data.cards);
      setSelectedIndex(0);
      setShowCards(true);
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not open pack');
    } finally {
      setOpening(false);
    }
  };

  const renderCard = () => {
    const card = cards[selectedIndex];
    return (
      <View style={styles.cardReveal}>
        <TouchableOpacity onPress={() => setShowCards(false)} style={styles.closeButton}>
          <Text style={styles.closeText}>✖</Text>
        </TouchableOpacity>
        <Text style={styles.revealTitle}>✨ You got:</Text>
        <Image
          source={card.image_url ? { uri: card.image_url } : require('../assets/not-found-card.png')}
          style={styles.cardImage}
        />
        <Text style={styles.cardName}>{card.name}</Text>
        <Text style={styles.cardRarity}>Rarity: {card.rarity}</Text>
        <View style={styles.navigationButtons}>
          <TouchableOpacity disabled={selectedIndex === 0} onPress={() => setSelectedIndex(i => i - 1)}>
            <Text style={styles.arrow}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.indexText}>{selectedIndex + 1} / {cards.length}</Text>
          <TouchableOpacity disabled={selectedIndex === cards.length - 1} onPress={() => setSelectedIndex(i => i + 1)}>
            <Text style={styles.arrow}>▶</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <NavBar />
      <View style={styles.content}>
        <Text style={styles.title}>🧪 Select Pack Filters</Text>

        <Text style={styles.label}>Rarity</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={rarity} onValueChange={setRarity} style={styles.picker}>
            {rarityOptions.map(r => (
              <Picker.Item key={r} label={r.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} value={r} />

            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Cards</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={cardCount} onValueChange={setCardCount} style={styles.picker}>
            {cardCountOptions.map(n => (
              <Picker.Item key={n} label={`${n}`} value={n} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Pack</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={packSource} onValueChange={setPackSource} style={styles.picker}>
            {setList.map(name => (
              <Picker.Item key={name} label={name} value={name} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity onPress={generatePack} style={styles.generateButton}>
          <Text style={styles.generateButtonText}>Generate</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#2894B0" style={{ marginTop: 20 }} />
        ) : (
          pack && (
            <View style={styles.largePack}>
              <Image source={{ uri: pack.imageUrl }} style={styles.packImage} />
              <Text style={styles.packTitle}>{pack.name}</Text>
              <Text style={styles.packPrice}>{pack.price} 🪙</Text>
              <TouchableOpacity onPress={openPack} style={styles.openButton} disabled={opening}>
                <Text style={styles.openButtonText}>{opening ? 'Opening...' : 'Open'}</Text>
              </TouchableOpacity>
            </View>
          )
        )}

        {showCards && cards.length > 0 && renderCard()}
      </View>
    </View>
  );
}
