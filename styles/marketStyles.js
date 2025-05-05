import { StyleSheet } from 'react-native';

export const marketStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F8FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  cardList: {
    paddingHorizontal: 16,
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
  }
});
