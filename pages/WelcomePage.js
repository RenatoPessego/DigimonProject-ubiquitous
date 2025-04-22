import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { welcomeStyles } from '../styles/welcomeStyles';

export default function WelcomePage({ navigation }) {
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
