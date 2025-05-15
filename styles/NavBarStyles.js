// styles/NavBarStyles.js
import { StyleSheet } from 'react-native';

export const getNavBarStyles = (isPortrait) =>
  StyleSheet.create({
    navBar: {
      height: 60,
      backgroundColor: '#2894B0',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: isPortrait ? 12 : 24,
      paddingTop: 10,
      position: 'relative',
    },
    marketText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: isPortrait ? 18 : 20,
    },
    logo: {
      height: isPortrait ? 35 : 45,
      resizeMode: 'contain',
      width: isPortrait ? 100 : 120,
    },
    rightIcons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profile: {
      width: isPortrait ? 32 : 40,
      height: isPortrait ? 32 : 40,
      borderRadius: 20,
      marginRight: 12,
    },
    cart: {
      width: 24,
      height: 24,
    },
    overlay: {
      flex: 1,
      backgroundColor: '#00000066',
      justifyContent: 'flex-start',
      paddingTop: 65,
      paddingLeft: 15,
    },
    dropdown: {
      backgroundColor: '#fff',
      borderRadius: 6,
      padding: 10,
      elevation: 5,
    },
    dropdownItem: {
      fontSize: 16,
      marginVertical: 6,
      fontWeight: '600',
      color: '#333',
    },
    profileOverlay: {
      flex: 1,
      alignItems: 'flex-end',
      paddingTop: 60,
      paddingRight: 15,
      backgroundColor: '#00000044',
    },
    profileMenu: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 10,
      width: 150,
      elevation: 5,
    },
    profileItem: {
      fontSize: 16,
      paddingVertical: 8,
      fontWeight: '600',
      color: '#333',
    },
  });
