import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import { NavBarStyles } from '../styles/NavBarStyles';

export default function NavBar() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    setProfileMenuVisible(false);
    navigation.replace('Welcome');
  };

  // Fetch profile image from the server using the auth token
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;

        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
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
      <View style={NavBarStyles.navBar}>
        {/* Left - Market */}
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Text style={NavBarStyles.marketText}>Market</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('NearbyLocation')}>
          <Text style={NavBarStyles.marketText}>Check-In</Text>
        </TouchableOpacity>


        {/* Center - Logo */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/logo.png')} style={NavBarStyles.logo} />
        </TouchableOpacity>

        {/* Right - Profile + Cart */}
        <View style={NavBarStyles.rightIcons}>
          <TouchableOpacity onPress={() => setProfileMenuVisible(!profileMenuVisible)}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('../assets/profile-placeholder.png')
              }
              style={NavBarStyles.profile}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Market')}>
            <Image source={require('../assets/cart-icon.png')} style={NavBarStyles.cart} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Market */}
      <Modal transparent visible={menuVisible} animationType="fade">
        <TouchableOpacity
          style={NavBarStyles.overlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={NavBarStyles.dropdown}>
            <TouchableOpacity onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Market');
            }}>
              <Text style={NavBarStyles.dropdownItem}>Buy</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              setMenuVisible(false);
              navigation.navigate('SellCard');
            }}>
              <Text style={NavBarStyles.dropdownItem}>Sell</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Dropdown Profile */}
      <Modal transparent visible={profileMenuVisible} animationType="fade">
        <TouchableOpacity
          style={NavBarStyles.profileOverlay}
          onPress={() => setProfileMenuVisible(false)}
        >
          <View style={NavBarStyles.profileMenu}>
            <TouchableOpacity onPress={() => {
              setProfileMenuVisible(false);
              navigation.navigate('Profile');
            }}>
              <Text style={NavBarStyles.profileItem}>View Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout}>
              <Text style={NavBarStyles.profileItem}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
