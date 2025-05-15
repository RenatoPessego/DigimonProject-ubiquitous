import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { API_URL } from '../config';
import { getNavBarStyles } from '../styles/NavBarStyles';
import { useTheme } from '../components/ThemeContext';

export default function NavBar() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const { darkMode, toggleTheme } = useTheme();
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const styles = getNavBarStyles(isPortrait, darkMode);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    setProfileMenuVisible(false);
    navigation.replace('Welcome');
  };

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;

        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok && data.user?.profileImage) {
          setProfileImage(data.user.profileImage);
        }
      } catch (err) {
        console.warn('⚠️ Failed to load profile image:', err.message);
      }
    };

    loadProfileImage();
  }, []);

  return (
    <>
      <View style={styles.navBar}>
        {/* Left - Market + Theme */}
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
            <Text style={styles.marketText}>Market</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}>
            <Feather name={darkMode ? 'moon' : 'sun'} size={18} color={darkMode ? '#fff' : '#333'} style={{ marginRight: 5 }} />
            <Switch value={darkMode} onValueChange={toggleTheme} />
          </View>
        </View>

        {/* Center - Logo (clickable only on image) */}
        <View style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </TouchableOpacity>
        </View>

        {/* Right - Profile + Cart */}
        <View style={styles.leftIcons}>
          <TouchableOpacity onPress={() => setProfileMenuVisible(!profileMenuVisible)}>
            <Image
              source={
                profileImage ? { uri: profileImage } : require('../assets/profile-placeholder.png')
              }
              style={styles.profile}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Market')}>
            <Image
              source={require('../assets/cart-icon.png')}
              style={[styles.cart, { tintColor: darkMode ? '#fff' : '#000' }]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Market Menu */}
      <Modal transparent visible={menuVisible} animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Market');
            }}>
              <Text style={styles.dropdownItem}>Buy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setMenuVisible(false);
              navigation.navigate('SellCard');
            }}>
              <Text style={styles.dropdownItem}>Sell</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Profile Menu */}
      <Modal transparent visible={profileMenuVisible} animationType="fade">
        <TouchableOpacity
          style={styles.profileOverlay}
          onPress={() => setProfileMenuVisible(false)}
        >
          <View style={styles.profileMenu}>
            <TouchableOpacity onPress={() => {
              setProfileMenuVisible(false);
              navigation.navigate('Profile');
            }}>
              <Text style={styles.profileItem}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.profileItem}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
