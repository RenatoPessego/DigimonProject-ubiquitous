import { StyleSheet } from 'react-native';

// Accepts both orientation and theme mode
export const getNavBarStyles = (isPortrait, darkMode = false) =>
  StyleSheet.create({
    // Top navigation bar container
    navBar: {
      height: 60,
      backgroundColor: darkMode ? '#1E1E1E' : '#2894B0',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: isPortrait ? 12 : 24,
      paddingTop: 10,
      position: 'relative',
    },

    // "Market" text button on the left
    marketText: {
      color: '#fff',
      fontWeight: 'bold',
    },

    // App logo in the center
    logo: {
      height: isPortrait ? 35 : 45,
      resizeMode: 'contain',
      width: isPortrait ? 100 : 120,
    },

    // Container for profile/cart/theme icons on the right
    rightIcons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    leftIcons: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    // Profile avatar circle
    profile: {
      width: isPortrait ? 32 : 40,
      height: isPortrait ? 32 : 40,
      borderRadius: 20,
      marginRight: 12,
    },

    // Shopping cart icon
    cart: {
      width: 24,
      height: 24,
    },

    // Background overlay when market menu is open
    overlay: {
      flex: 1,
      backgroundColor: '#00000066',
      justifyContent: 'flex-start',
      paddingTop: 65,
      paddingLeft: 15,
    },

    // Dropdown panel for "Market" menu
    dropdown: {
      backgroundColor: darkMode ? '#2C2C2C' : '#fff',
      borderRadius: 6,
      padding: 10,
      elevation: 5,
    },

    // Individual dropdown items
    dropdownItem: {
      fontSize: 16,
      marginVertical: 6,
      fontWeight: '600',
      color: darkMode ? '#eee' : '#333',
    },

    // Overlay for profile dropdown
    profileOverlay: {
      flex: 1,
      alignItems: 'flex-end',
      paddingTop: 60,
      paddingRight: 15,
      backgroundColor: '#00000044',
    },

    // Panel for profile options
    profileMenu: {
      backgroundColor: darkMode ? '#2C2C2C' : 'white',
      borderRadius: 8,
      padding: 10,
      width: 150,
      elevation: 5,
    },

    // Individual profile menu items
    profileItem: {
      fontSize: 16,
      paddingVertical: 8,
      fontWeight: '600',
      color: darkMode ? '#eee' : '#333',
    },
  });
