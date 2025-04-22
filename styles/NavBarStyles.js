import { StyleSheet } from 'react-native';

export const NavBarStyles = StyleSheet.create({
  navBar: {
    height: 60,
    backgroundColor: '#2894B0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 10,
    position: 'relative',
  },
  marketText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  logoContainer: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -50 }],
  },
  logo: {
    height: 35,
    resizeMode: 'contain',
    width: 100,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  cart: {
    width: 24,
    height: 24,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'flex-start',
    paddingTop: 65,
    paddingLeft: 15,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    elevation: 5,
  },
  dropdownItem: {
    fontSize: 16,
    marginVertical: 6,
    fontWeight: '600',
    color: '#333',
  },
});
