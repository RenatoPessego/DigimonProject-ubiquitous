// styles/welcomeStyles.js

import { StyleSheet } from 'react-native';

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#86E2F9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#003A49',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    backgroundColor: '#2894B0',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#003A49',
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
