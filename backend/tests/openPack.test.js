import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import OpenPacksPage from '../path/to/OpenPacksPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../components/ThemeContext', () => ({
  useTheme: () => ({
    darkMode: false,
  }),
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => <>{children}</>,
}));
jest.mock('react-native-animatable', () => ({
  View: ({ children }) => <>{children}</>,
  Image: ({ source }) => <>{source}</>,
}));

// Mock API responses
const mockSetList = ['Set 1', 'Set 2', 'Set 3'];
const mockPack = {
  name: 'Test Pack',
  price: 100,
  rarity: 'common',
  cardCount: 3,
  packSource: 'Set 1'
};
const mockCards = [
  { id: 1, name: 'Card 1', rarity: 'common', image_url: 'http://test.com/card1.jpg' },
  { id: 2, name: 'Card 2', rarity: 'rare', image_url: 'http://test.com/card2.jpg' }
];

describe('OpenPacksPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockSetList.map(set => ({ set_name: set }))),
        ok: true,
      })
    );
    AsyncStorage.getItem.mockResolvedValue('test-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    const { getByText } = render(<OpenPacksPage />);
    
    await waitFor(() => {
      expect(getByText('🧪 Select Pack Filters')).toBeTruthy();
      expect(getByText('Common')).toBeTruthy();
      expect(getByText('1')).toBeTruthy();
    });
  });

  it('generates and opens a pack successfully', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ packs: [mockPack] }),
        ok: true,
      })
    ).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ cards: mockCards }),
        ok: true,
      })
    );

    const { getByText } = render(<OpenPacksPage />);
    
    // Generate pack
    await act(async () => {
      fireEvent.press(getByText('Generate'));
    });

    await waitFor(() => {
      expect(getByText('Test Pack')).toBeTruthy();
    });

    // Open pack
    await act(async () => {
      fireEvent.press(getByText('Open'));
    });

    await waitFor(() => {
      expect(getByText('✨ You got:')).toBeTruthy();
      expect(getByText('Card 1')).toBeTruthy();
    });
  });

  it('handles pack generation error', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    const { getByText } = render(<OpenPacksPage />);
    
    await act(async () => {
      fireEvent.press(getByText('Generate'));
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it('changes pack filters', async () => {
    const { getByText } = render(<OpenPacksPage />);
    
    // Change rarity
    await act(async () => {
      fireEvent.press(getByText('Common'));
      fireEvent.press(getByText('Rare'));
    });

    // Change card count
    await act(async () => {
      fireEvent.press(getByText('1'));
      fireEvent.press(getByText('3'));
    });

    await waitFor(() => {
      expect(getByText('Rare')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
    });
  });
});