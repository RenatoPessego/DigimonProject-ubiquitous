import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavBarStyles } from '../styles/NavBarStyles';

export default function NavBar() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <View style={NavBarStyles.navBar}>
        {/* Left - Market */}
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Text style={NavBarStyles.marketText}>Market</Text>
        </TouchableOpacity>

        {/* Center - Logo */}
        <View style={NavBarStyles.logoContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={require('../assets/logo.png')} style={NavBarStyles.logo} />
          </TouchableOpacity>
        </View>

        {/* Right - Profile + Cart */}
        <View style={NavBarStyles.rightIcons}>
          <TouchableOpacity>
            <Image source={require('../assets/profile-placeholder.png')} style={NavBarStyles.profile} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../assets/cart-icon.png')} style={NavBarStyles.cart} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown menu */}
      <Modal transparent={true} visible={menuVisible} animationType="fade">
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
    </>
  );
}
