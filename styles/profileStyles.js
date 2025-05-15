// styles/profileStyles.js
import { StyleSheet } from 'react-native';

export const getProfileStyles = (isPortrait) =>
  StyleSheet.create({
    container: {
      padding: isPortrait ? 10 : 20,
      paddingBottom: 100,
      alignItems: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
      width: isPortrait ? 100 : 120,
      height: isPortrait ? 100 : 120,
      borderRadius: 60,
      marginVertical: 10,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    username: {
      fontSize: 16,
      color: '#888',
    },
    email: {
      fontSize: 16,
      color: '#444',
      marginTop: 4,
    },
    birthDate: {
      fontSize: 16,
      color: '#444',
      marginTop: 4,
    },
    balance: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#2894B0',
      marginTop: 10,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 10,
      textAlign: 'center',
    },
    cardBox: {
      width: '30%',
      margin: '1.5%',
      alignItems: 'center',
      backgroundColor: '#f2f2f2',
      borderRadius: 8,
      padding: 5,
      elevation: 2,
    },
    cardImage: {
      width: 80,
      height: 110,
      resizeMode: 'contain',
    },
    cardName: {
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 4,
    },
    cardQty: {
      fontSize: 12,
      color: '#555',
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 15,
    },
    pageButton: {
      fontSize: 20,
      paddingHorizontal: 15,
      color: '#2894B0',
    },
    pageNumber: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '95%',
      maxHeight: '90%',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 15,
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 2,
    },
    modalImage: {
      width: '65%',
      aspectRatio: 0.7,
      resizeMode: 'contain',
      marginBottom: 8,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 12,
      textAlign: 'center',
    },
    modalText: {
  fontSize: 14,
  marginVertical: 4,
  textAlign: 'left',
  paddingHorizontal: 12,
},
    modalDesc: {
  fontSize: 13,
  color: '#333',
  paddingHorizontal: 12,
  marginTop: 10,
  textAlign: 'left',
},
    modalSubtitle: {
      color: '#2894B0',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    quickSellButton: {
      backgroundColor: '#2894B0',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 8,
      marginRight: 10,
    },
    quickSellButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    marketSellButton: {
      backgroundColor: '#ccc',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 8,
    },
    marketSellButtonText: {
      color: '#333',
      fontWeight: 'bold',
    },
    inputPrice: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      padding: 10,
      marginBottom: 15,
      width: '100%',
    },
    modalButtonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalButton: {
      padding: 10,
      borderRadius: 6,
    },
    modalButtonCancel: {
      backgroundColor: '#999',
    },
    modalButtonConfirm: {
      backgroundColor: '#2894B0',
    },
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
