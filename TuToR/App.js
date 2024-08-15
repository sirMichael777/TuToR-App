import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppLoading from 'expo-app-loading';
import { useFonts, Ubuntu_400Regular } from '@expo-google-fonts/ubuntu';

// Importing all the screens
import LoadingScreen from './LoadingScreen';
import WelcomeScreen from './WelcomeScreen';
import SignUpScreen from './SignUpScreen';
import SignInScreen from './SignInScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import EnterResetCodeScreen from './EnterResetCodeScreen';
import TutorDetails1 from './TutorDetails1';
import TutorDetails2 from './TutorDetails2';
import TutorDetails3 from './TutorDetails3';
import TutorDetails4 from './TutorDetails4';
import TutorDetails5 from './TutorDetails5';
import ApplicationStatus from './ApplicationStatus';

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
        {/* Welcome Screen */}
        <Stack.Screen 
          name="WelcomeScreen" 
          component={WelcomeScreen} 
          options={{ headerShown: false }}
        />

        {/* Sign Up Screen */}
        <Stack.Screen 
          name="SignUpScreen" 
          component={SignUpScreen} 
          options={{ headerShown: false }}
        />

        {/* Sign In Screen */}
        <Stack.Screen 
          name="SignInScreen" 
          component={SignInScreen} 
          options={{ headerShown: false }}
        />

        {/* Reset Password Screen */}
        <Stack.Screen 
          name="ResetPasswordScreen" 
          component={ResetPasswordScreen} 
          options={{ headerShown: false }}
        />

        {/* Enter Reset Code Screen */}
        <Stack.Screen 
          name="EnterResetCodeScreen" 
          component={EnterResetCodeScreen} 
          options={{ headerShown: false }}
        />

        {/* Tutor Details Screens */}
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
        <Stack.Screen 
          name="TutorDetails5" 
          component={TutorDetails5} 
          options={{ headerShown: false }}
        />

        {/* Application Status Screen */}
        <Stack.Screen
          name="ApplicationStatus"
          component={ApplicationStatus}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
