
import {Provider} from "react-redux";
import Store from './context/store'
import {NavigationContainer} from "@react-navigation/native";
import LoadingScreen from "./Authentication/LoadingScreen";
import WelcomeScreen from "./Authentication/WelcomeScreen";
import AuthTypeScreen from "./Authentication/AuthTypeScreen";
import SignUpScreen from "./Authentication/SignUpScreen";
import SignInScreen from "./Authentication/SignInScreen";
import ResetPasswordScreen from "./Authentication/ResetPasswordScreen";
import EnterResetCodeScreen from "./Authentication/EnterResetCodeScreen";
import TutorDetails1 from "./Authentication/TutorDetails1";
import TutorDetails2 from "./Authentication/TutorDetails2";
import TutorDetails3 from "./Authentication/TutorDetails3";
import TutorDetails4 from "./Authentication/TutorDetails4";
import TutorDetails5 from "./Authentication/TutorDetails5";
import ApplicationStatus from "./Authentication/ApplicationStatus";
import StudentDetails1 from "./Authentication/StudentDetails1";
import StudentDetails2 from "./Authentication/StudentDetails2";
import TermsAndConditions from "./Authentication/TermsAndConditions";
import NotificationScreen from "./Screens/Notifications";
import ProfileScreen from "./Screens/Profile";
import MainApp from './MainComponents/MainApp'
import TutorMainApp from './MainComponents/TutorMain'
import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {StatusBar} from "react-native";
import TutorSearchScreen from "./Chat/TutorSearchScreen";

const Stack = createStackNavigator();

export default () => {
  return (

        <NavigationContainer>
          <Provider store={Store}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="AuthTypeScreen" component={AuthTypeScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
            <Stack.Screen name="EnterResetCodeScreen" component={EnterResetCodeScreen} />
              <Stack.Screen name="TutorSearchScreen" component={TutorSearchScreen} />
            <Stack.Screen name="TutorDetails1" component={TutorDetails1} />
            <Stack.Screen name="TutorDetails2" component={TutorDetails2} />
            <Stack.Screen name="TutorDetails3" component={TutorDetails3} />
            <Stack.Screen name="TutorDetails4" component={TutorDetails4} />
            <Stack.Screen name="TutorDetails5" component={TutorDetails5} />
            <Stack.Screen name="ApplicationStatus" component={ApplicationStatus} />
            <Stack.Screen name="StudentDetails1" component={StudentDetails1} />
            <Stack.Screen name="StudentDetails2" component={StudentDetails2} />
            <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
            <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="MainApp" component={MainApp} />
            <Stack.Screen name="TutorMainApp" component={TutorMainApp} />
          </Stack.Navigator>
          <StatusBar style="auto" />
          </Provider>
        </NavigationContainer>


  );
};