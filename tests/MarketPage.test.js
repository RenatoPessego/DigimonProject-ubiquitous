import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MarketPage from '../pages/MarketPage';
import { ThemeProvider } from '../components/ThemeContext';
import fetchMock from 'jest-fetch-mock';
import { useNavigation } from '@react-navigation/native';

//  Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

//  Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('dummy-token')),
}));

//  Mock NavBar to avoid external fetches
jest.mock('../components/NavBar', () => () => <></>);

// 🔄 Enable fetch mocking
beforeAll(() => {
  global.fetch = fetchMock;
});

afterEach(() => {
  fetchMock.resetMocks();
});

//  Dados simulados para o teste
const mockListings = [
  {
    _id: '1',
    name: 'abc',
    rarity: 'Ultra Rare',
    pack: 'Starter Pack',
    price: 100,
    sellerId: {
      _id: 'abc123',
      username: 'CardSeller',
    },
  },
];

const renderWithTheme = () => {
  return render(
    <ThemeProvider>
      <MarketPage />
    </ThemeProvider>
  );
};

describe('MarketPage', () => {
  it('renders listings and handles buy/chat actions', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ listings: mockListings }));

    const { findByText, getByText } = renderWithTheme();

    // Verifica se os dados renderizaram corretamente
    expect(await findByText('Card: abc')).toBeTruthy();
    expect(getByText('Seller: CardSeller')).toBeTruthy();

    // Mock da chamada POST para "Buy"
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    fireEvent.press(getByText('Buy'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/market/buy/1'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });
});
