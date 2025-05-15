// styles/homeStyles.js
import { StyleSheet } from 'react-native';

export const getHomeStyles = (isPortrait) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E0F7FA',
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: isPortrait ? 16 : 32,
    },
    welcomeText: {
      fontSize: isPortrait ? 24 : 30,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#000',
      textAlign: 'center',
    },
    subText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E0F7FA',
    },
    notAuth: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E0F7FA',
    },
    openPackButton: {
      marginTop: 30,
      backgroundColor: '#2894B0',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignSelf: 'center',
    },
    openPackButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 16,
    },
  });
