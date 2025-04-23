import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth / 2.5;

export const openPacksStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },

  content: {
    paddingTop: 16,
    paddingBottom: 80,
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
  },

  packGrid: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },

  packBox: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },

  packImage: {
    width: '100%',
    height: cardWidth * 1.2,
    resizeMode: 'contain',
    borderRadius: 8,
  },

  packTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  packPrice: {
    marginTop: 4,
    fontSize: 14,
    color: '#2894B0',
    fontWeight: 'bold',
  },

  // Card Reveal Styles
  cardReveal: {
    position: 'absolute',
    top: '15%',
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  closeText: {
    fontSize: 22,
    color: '#555',
  },

  revealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },

  cardImage: {
    width: 180,
    height: 260,
    resizeMode: 'contain',
    borderRadius: 12,
    marginBottom: 12,
  },

  cardName: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#222',
  },

  cardRarity: {
    fontSize: 14,
    marginTop: 6,
    color: '#888',
  },

  navigationButtons: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },

  arrow: {
    fontSize: 24,
    color: '#2894B0',
  },

  indexText: {
    fontSize: 16,
    color: '#555',
  },
});
