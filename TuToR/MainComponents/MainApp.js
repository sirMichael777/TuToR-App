import {Ionicons} from "@expo/vector-icons";
import StudentHome from "../Screens/StudentHome";
import FindTutorScreen from "../Screens/FindTutor";
import SessionScreen from "../Screens/Session";
import ChatScreen from "../Chat/Chat";
import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export default function MainApp() {
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