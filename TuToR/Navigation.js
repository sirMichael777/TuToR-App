import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Import the screens
import HomeScreen from './Screens/StudentHome';
import ChatScreen from './Screens/Chat';
import SessionScreen from './Screens/Session';
import FindTutorScreen from './Screens/FindTutor';
import NotificationsScreen from './Screens/Notifications';
import StudentNavigation from './Screens/Components/StudentNavigation';
import ProfileScreen from "./Screens/Profile"; // Your custom navigation component

const Tab = createBottomTabNavigator();

function Navigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false, // Hide the default header
                }}
                tabBar={(props) => <StudentNavigation {...props} />} // Use your custom navigation component
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="FindTutor" component={FindTutorScreen} />
                <Tab.Screen name="Sessions" component={SessionScreen} />
                <Tab.Screen name="Chat" component={ChatScreen} />
                <Tab.Screen name="Notifications" component={NotificationsScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;
