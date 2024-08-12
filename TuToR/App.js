import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import { useFonts, Ubuntu_400Regular } from '@expo-google-fonts/ubuntu';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from './LoadingScreen'; // Import your LoadingScreen component
import WelcomeScreen from './WelcomeScreen'; // Import your WelcomeScreen component
import SignUpScreen from './SignUpScreen'; // Import your SignUpScreen component

const Stack = createNativeStackNavigator();

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Load fonts
  let [fontsLoaded] = useFonts({
    Ubuntu_400Regular,
  });

  // If the fonts are not yet loaded, show the AppLoading screen
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // Show the loading screen first
  if (!loadingComplete) {
    return <LoadingScreen onFinish={() => setLoadingComplete(true)} />;
  }

  // Once loading is complete, show the WelcomeScreen with navigation setup
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ headerShown: false }} // Hide the header on the Welcome screen
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{ headerShown: false }} // Hide the header on the SignUp screen
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
