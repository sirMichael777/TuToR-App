import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppLoading from 'expo-app-loading';
import { useFonts, Ubuntu_400Regular } from '@expo-google-fonts/ubuntu';
import { Ionicons } from '@expo/vector-icons';

// Importing all the screens
import LoadingScreen from './Screens/LoadingScreen';
import WelcomeScreen from './Screens/WelcomeScreen';
import SignUpScreen from './Screens/SignUpScreen';
import SignInScreen from './Screens/SignInScreen';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import EnterResetCodeScreen from './Screens/EnterResetCodeScreen';
import TutorDetails1 from './Screens/TutorDetails1';
import TutorDetails2 from './Screens/TutorDetails2';
import TutorDetails3 from './Screens/TutorDetails3';
import TutorDetails4 from './Screens/TutorDetails4';
import TutorDetails5 from './Screens/TutorDetails5';
import StudentDetails1 from './Screens/StudentDetails1';
import StudentDetails2 from './Screens/StudentDetails2';
import TermsAndConditions from './Screens/TermsAndConditions';
import StudentHome from './Screens/StudentHome';
import ChatScreen from './Screens/Chat';
import SessionScreen from './Screens/Session';
import FindTutorScreen from './Screens/FindTutor';
import ApplicationStatus from './Screens/ApplicationStatus';
import NotificationScreen from './Screens/Notifications';
import ProfileScreen from './Screens/Profile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

  // Bottom Tab Navigator
  function MainApp() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
  
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'FindTutor') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Sessions') {
              iconName = focused ? 'time' : 'time-outline';
            } else if (route.name === 'Chat') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            }
  
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={StudentHome} />
        <Tab.Screen name="FindTutor" component={FindTutorScreen} />
        <Tab.Screen name="Sessions" component={SessionScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
      </Tab.Navigator>
    );
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
          name="TermsAndConditions"
          component={TermsAndConditions}
          options={{ headerShown: false }}
        />
        <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name='ProfileScreen'
        component={ProfileScreen}
        options={{ headerShown: false }}
        />

      
        {/* Main Application - Bottom Tab Navigation */}
        <Stack.Screen
          name="MainApp"
          component={MainApp}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
