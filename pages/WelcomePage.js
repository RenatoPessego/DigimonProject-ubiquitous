import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { getWelcomeStyles } from '../styles/welcomeStyles';

export default function WelcomePage({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const welcomeStyles = getWelcomeStyles(isPortrait);

  return (
    <View style={welcomeStyles.container}>
      <Text style={welcomeStyles.title}>Digimon</Text>

      <View style={welcomeStyles.buttonContainer}>
        <TouchableOpacity
          style={welcomeStyles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={welcomeStyles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={welcomeStyles.button}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={welcomeStyles.buttonText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
