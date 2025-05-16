import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import HomePage from '../pages/HomePage';
import { ThemeProvider } from '../components/ThemeContext';
import fetchMock from 'jest-fetch-mock';
import { Alert } from 'react-native';

// 🛑 Mock Alert.alert para evitar erros
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// 📦 Mock usePushNotifications
jest.mock('../components/usePushNotifications', () => () => {});

// 🔁 Mock navegação
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// 🔐 Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key) => {
    if (key === 'authToken') return Promise.resolve('mock-token');
    return null;
  }),
}));

// Configuração do fetch
beforeAll(() => {
  fetchMock.enableMocks();
});

beforeEach(() => {
  fetchMock.resetMocks();
});

const renderWithTheme = () =>
  render(
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  );

describe('HomePage', () => {
  it('shows loading initially', async () => {
    fetchMock.mockResponseOnce(() => new Promise(() => {})); // bloqueia fetch para simular loading
    const { getByTestId } = renderWithTheme();
    expect(getByTestId('ActivityIndicator')).toBeTruthy();
  });

  it('shows "not logged in" if no token found', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValueOnce(null); // sem token

    const { findByText } = renderWithTheme();
    expect(await findByText('You are not logged in.')).toBeTruthy();
  });

  it('shows error if fetch fails', async () => {
    fetchMock.mockRejectOnce(new Error('server failed'));

    const { findByText } = renderWithTheme();
    expect(await findByText('You are not logged in.')).toBeTruthy();
  });

  it('shows user email when logged in', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        user: {
          email: 'zoro@wano.com',
        },
      })
    );

    const { findByText } = renderWithTheme();

    expect(await findByText('Welcome, zoro@wano.com!')).toBeTruthy();
    expect(await findByText('🎁 Open Packs')).toBeTruthy();
  });
});
