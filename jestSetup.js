// jestSetup.js

import '@testing-library/jest-native/extend-expect';
import fetchMock from 'jest-fetch-mock';
import { View } from 'react-native';

fetchMock.enableMocks();

