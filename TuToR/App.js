import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppLoading from 'expo-app-loading';
import { useFonts, Ubuntu_400Regular } from '@expo-google-fonts/ubuntu';
import {FontAwesome5, Ionicons} from '@expo/vector-icons';
import {Provider} from "react-redux";


import LoadingScreen from './Authentication/LoadingScreen';
import WelcomeScreen from './Authentication/WelcomeScreen';
import SignUpScreen from './Authentication/SignUpScreen';
import SignInScreen from './Authentication/SignInScreen';
import ResetPasswordScreen from './Authentication/ResetPasswordScreen';
import EnterResetCodeScreen from './Screens/EnterResetCodeScreen';
import TutorDetails1 from './Authentication/TutorDetails1';
import TutorDetails2 from './Authentication/TutorDetails2';
import TutorDetails3 from './Authentication/TutorDetails3';
import TutorDetails4 from './Authentication/TutorDetails4';
import TutorDetails5 from './Authentication/TutorDetails5';
import StudentDetails1 from './Authentication/StudentDetails1';
import StudentDetails2 from './Authentication/StudentDetails2';
import TermsAndConditions from './Authentication/TermsAndConditions';
import StudentHome from './Screens/StudentHome';
import ChatScreen from './Screens/Chat';
import SessionScreen from './Screens/Session';
import FindTutorScreen from './Screens/FindTutor';
import ApplicationStatus from './Screens/ApplicationStatus';
import NotificationScreen from './Screens/Notifications';
import ProfileScreen from './Screens/Profile';
import EarningsScreen from './Screens/Earning';
import TutorHomeScreen from './Screens/TutorHomeScreen';
import TutorSessionScreen from './Screens/TutorSession';
import AuthTypeScreen from "./Authentication/AuthTypeScreen";
import Store from "./Context/store";


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

  function TutorMainApp() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                  return <Ionicons name={iconName} size={size} color={color} />;
                } else if (route.name === 'Earnings') {
                  return <FontAwesome5 name="hand-holding-usd" size={size} color={color} />;
                } else if (route.name === 'Sessions') {
                  iconName = focused ? 'time' : 'time-outline';
                  return <Ionicons name={iconName} size={size} color={color} />;
                } else if (route.name === 'Chat') {
                  iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                  return <Ionicons name={iconName} size={size} color={color} />;
                }
              },
              tabBarActiveTintColor: 'blue',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
        >
          <Tab.Screen name="Home" component={TutorHomeScreen} />
          <Tab.Screen name="Earnings" component={EarningsScreen} />
          <Tab.Screen name="Sessions" component={TutorSessionScreen} />
          <Tab.Screen name="Chat" component={ChatScreen} />
        </Tab.Navigator>
    );
  }

  // Once loading is complete, show the main app screens
  return (
    <NavigationContainer>
      <Provider store={Store}>
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* Loading Screen*/ }
        <Stack.Screen
            name="SplashScreen"
            component={LoadingScreen}
            options={{headerShown: false}}
            />

        {/* Welcome Screen */}
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
            name="AuthTypeScreen"
            component={AuthTypeScreen}
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

        <Stack.Screen
          name="TutorMainApp"
          component={TutorMainApp}
          options={{ headerShown: false }}
          />
      </Stack.Navigator>
      <StatusBar style="auto" />
      </Provider>
    </NavigationContainer>
  );
}
