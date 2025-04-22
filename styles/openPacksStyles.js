import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const openPacksStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  packGrid: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  packBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 8,
    alignItems: 'center',
    width: width / 3 - 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  packImage: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  packTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    color: '#444',
  },
  packPrice: {
    marginTop: 4,
    fontSize: 12,
    color: '#2894B0',
  },

  // Reveal section
  cardReveal: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    alignSelf: 'center',
    elevation: 6,
  },
  revealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  cardImage: {
    width: 180,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardRarity: {
    fontSize: 14,
    marginBottom: 12,
    color: '#555',
  },

  // Carousel controls
  carouselControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  arrowButton: {
    padding: 10,
  },
  arrowText: {
    fontSize: 24,
    color: '#2894B0',
  },
  cardIndex: {
    fontSize: 16,
    marginHorizontal: 12,
    color: '#666',
  },

  // Close button
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 10,
    padding: 4,
    zIndex: 1,
  },
  closeText: {
    fontSize: 18,
    color: '#999',
  },
});
