import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavBarStyles } from '../styles/NavBarStyles';

export default function NavBar() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    setProfileMenuVisible(false);
    navigation.replace('Welcome');
  };

  return (
    <>
      <View style={NavBarStyles.navBar}>
        {/* Left - Market */}
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Text style={NavBarStyles.marketText}>Market</Text>
        </TouchableOpacity>

        {/* Center - Logo */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/logo.png')} style={NavBarStyles.logo} />
        </TouchableOpacity>

        {/* Right - Profile + Cart */}
        <View style={NavBarStyles.rightIcons}>
          <TouchableOpacity onPress={() => setProfileMenuVisible(!profileMenuVisible)}>
            <Image source={require('../assets/profile-placeholder.png')} style={NavBarStyles.profile} />
          </TouchableOpacity>
          <TouchableOpacity>
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
            <Text style={NavBarStyles.dropdownItem} onPress={() => console.log('Buy')}>Buy</Text>
            <Text style={NavBarStyles.dropdownItem} onPress={() => console.log('Sell')}>Sell</Text>
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

