import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import { getNavBarStyles } from '../styles/NavBarStyles';

export default function NavBar() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const styles = getNavBarStyles(isPortrait);

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
        {/* Left - Market */}
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Text style={styles.marketText}>Market</Text>
        </TouchableOpacity>

        {/* Center - Logo */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
        </TouchableOpacity>

        {/* Right - Icons */}
        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => setProfileMenuVisible(!profileMenuVisible)}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('../assets/profile-placeholder.png')
              }
              style={styles.profile}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Market')}>
            <Image source={require('../assets/cart-icon.png')} style={styles.cart} />
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
