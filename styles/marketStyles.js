// styles/marketStyles.js
import { StyleSheet } from 'react-native';

export const getMarketStyles = (isPortrait) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F3F8FF',
    },
    title: {
      fontSize: isPortrait ? 24 : 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 20,
      color: '#333',
    },
    cardList: {
      paddingHorizontal: isPortrait ? 16 : 32,
      paddingBottom: 20,
    },
    cardContainer: {
      flexDirection: 'row',
      backgroundColor: '#FFF',
      borderRadius: 12,
      marginBottom: 12,
      padding: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    cardImage: {
      width: 90,
      height: 130,
      borderRadius: 8,
      marginRight: 10,
    },
    cardInfo: {
      flex: 1,
      justifyContent: 'space-between',
    },
    cardText: {
      fontSize: 14,
      marginBottom: 4,
      color: '#444',
    },
    cardPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2894B0',
      marginBottom: 8,
    },
    buyButton: {
      backgroundColor: '#2894B0',
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
    },
    buyButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 14,
    },
    sellButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 6,
    },
    sellButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 14,
    },
    priceInput: {
      borderColor: '#CCC',
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 6,
      marginTop: 6,
      fontSize: 14,
      backgroundColor: '#FFF',
    },
    noCardsText: {
      textAlign: 'center',
      marginTop: 40,
      fontSize: 16,
      color: '#888',
    },
    activityIndicator: {
      marginTop: 40,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 8,
      width: '80%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    modalButton: {
      padding: 10,
      borderRadius: 6,
      alignItems: 'center',
      flex: 1,
      marginHorizontal: 5,
    },
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    editActionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
      backButton: {
    margin: 10,
  },
  backButtonText: {
    color: '#2894B0',
    fontWeight: 'bold',
    fontSize: 16,
  },
viewListingsButton: {
  backgroundColor: '#2894B0',
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 8,
  alignSelf: 'center',
  marginBottom: 15,
  marginTop: 5,
},
viewListingsText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 14,
},

  });
