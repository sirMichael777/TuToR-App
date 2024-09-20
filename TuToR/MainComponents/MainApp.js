import {Ionicons} from "@expo/vector-icons";
import StudentHome from "../Screens/StudentHome";
import FindTutorScreen from "../FindTutor/FindTutor";
import SessionScreen from "../Sessions/Session";
import ChatScreen from "../Chat/Chat";
import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import useUserDataListener from "./UpdateData";

const Tab = createBottomTabNavigator();

export default function MainApp() {
    useUserDataListener();
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
                unmountOnBlur: true,
            })}
        >
            <Tab.Screen name="Home" component={StudentHome} />
            <Tab.Screen name="FindTutor" component={FindTutorScreen} />
            <Tab.Screen name="Sessions" component={SessionScreen} />
            <Tab.Screen name="Chat" component={ChatScreen} />
        </Tab.Navigator>
    );
}