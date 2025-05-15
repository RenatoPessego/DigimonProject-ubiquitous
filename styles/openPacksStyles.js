import { StyleSheet, Dimensions } from 'react-native';

export const getOpenPacksStyles = (isPortrait) => {
  const { width, height } = Dimensions.get('window');
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E0F7FA',
    },
    content: {
      flexGrow: 1,
      padding: isPortrait ? 16 : 32,
      justifyContent: 'flex-start',
    },
    title: {
      fontSize: isPortrait ? 22 : 22,
      fontWeight: 'bold',
      marginBottom: 0,
      textAlign: 'center',
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 4,
      marginTop: 8,
      color: '#333',
    },
    pickerContainer: {
      backgroundColor: '#fff',
      borderRadius: 10,
      elevation: 2,
      marginBottom: 8,
      overflow: 'hidden',
    },
    picker: {
      height: 60,
      width: '100%',
      color: '#333',
      fontSize: 16,
      paddingVertical: 12,
      justifyContent: 'center',
    },
    generateButton: {
      backgroundColor: '#2894B0',
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignSelf: 'center',
      borderRadius: 10,
      marginTop: 16,
    },
    generateButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
    },
    largePack: {
      marginTop: 30,
      alignItems: 'center',
    },
    packImage: {
      width: isPortrait ? 140 : 160,
      height: isPortrait ? 200 : 230,
      marginBottom: 10,
      resizeMode: 'contain',
    },
    packTitle: {
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 4,
    },
    packPrice: {
      fontSize: 16,
      color: '#555',
      marginBottom: 4,
    },
    openButton: {
      backgroundColor: '#28A745',
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    openButtonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 16,
    },

    // 📦 Card Reveal Overlay
    cardReveal: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.97)',
      padding: 20,
      zIndex: 100,
    },
    closeButton: {
      position: 'absolute',
      top: 30,
      right: 20,
      padding: 5,
      zIndex: 101,
    },
    closeText: {
      fontSize: 28,
      color: '#333',
    },
    revealTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
    },
    cardImage: {
      width: width * 0.5,
      height: height * 0.4,
      resizeMode: 'contain',
      marginBottom: 10,
    },
    cardName: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 4,
      textAlign: 'center',
    },
    cardRarity: {
      fontSize: 16,
      color: '#555',
      marginBottom: 10,
      textAlign: 'center', // ✅ fix
    },
    navigationButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
    },
    arrow: {
      fontSize: 24,
      color: '#444',
      paddingHorizontal: 20,
    },
    indexText: {
      fontSize: 16,
      fontWeight: '500',
    },
    loadingIndicator: {
      marginTop: 20,
    },
    preloadImage: {
      width: 0,
      height: 0,
      position: 'absolute',
    },
  });
};
