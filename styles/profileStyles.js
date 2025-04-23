import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  container: {
    padding: 10,
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
    width: 100,
    height: 100,
    borderRadius: 50,
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

  // MODAL styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
  modalImage: {
    width: 150,
    height: 210,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    marginVertical: 2,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
    color: '#333',
  },
  modalSubtitle: {
  color: '#2894B0',
  fontWeight: 'bold',
  textAlign: 'center',
},

});
