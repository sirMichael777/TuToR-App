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
import StudentDetails2 from './StudentDetails2';
import TutorDetails1 from './TutorDetails1';
import TutorDetails2 from './TutorDetails2';
import TutorDetails3 from './TutorDetails3';
import TutorDetails4 from './TutorDetails4';

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
        <Stack.Screen
        name="StudentDetails2"
        component={StudentDetails2}
        options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TutorDetails1" 
          component={TutorDetails1} 
          options={{ headerShown: false }}
        />
        <Stack.Screen
        name="TutorDetails2"
        component={TutorDetails2}
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name="TutorDetails3"
        component={TutorDetails3}
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name="TutorDetails4"
        component={TutorDetails4}
        options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
