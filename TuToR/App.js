import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppLoading from 'expo-app-loading';
import { useFonts, Ubuntu_400Regular } from '@expo-google-fonts/ubuntu';
import LoadingScreen from './LoadingScreen';
import WelcomeScreen from './WelcomeScreen';
import SignUpScreen from './SignUpScreen';
import StudentDetails1 from './StudentDetails1';

const Stack = createStackNavigator();

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

  // Once loading is complete, show the main app screens
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen 
          name="WelcomeScreen" 
          component={WelcomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SignUpScreen" 
          component={SignUpScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="StudentDetails1" 
          component={StudentDetails1} 
          options={{ headerShown: false }}
        />
        {/* Add more screens as needed, such as the TutorDetails screen */}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
