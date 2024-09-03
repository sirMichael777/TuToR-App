import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import TutorHomeScreen from "../Screens/TutorHomeScreen";
import EarningsScreen from "../Screens/Earning";
import TutorSessionScreen from "../Screens/TutorSession";
import ChatScreen from "../Chat/Chat";
import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";


const Tab = createBottomTabNavigator();

export default function TutorMainApp() {
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