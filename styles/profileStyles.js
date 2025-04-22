import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
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

  container: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#2894B0',
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#003A49',
  },

  username: {
    fontSize: 18,
    color: '#555',
    marginBottom: 8,
  },

  email: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },

  birthDate: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },

  balance: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    color: '#2894B0',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#003A49',
  },

  cardBox: {
    width: 100,
    margin: 10,
    alignItems: 'center',
  },

  cardImage: {
    width: 90,
    height: 125,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  cardName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: 'bold',
    color: '#333',
  },

  cardQty: {
    fontSize: 12,
    color: '#555',
  },

  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 20,
  },

  pageButton: {
    fontSize: 20,
    color: '#2894B0',
    paddingHorizontal: 10,
  },

  pageNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003A49',
  },
});
