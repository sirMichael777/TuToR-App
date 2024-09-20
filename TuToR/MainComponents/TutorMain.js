import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import TutorHomeScreen from "../Screens/TutorHomeScreen";
import EarningsScreen from "../Screens/Earning";
import ChatScreen from "../Chat/Chat";
import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import useUserDataListener from "./UpdateData";
import SessionScreen from "../Sessions/Session";


const Tab = createBottomTabNavigator();

export default function TutorMainApp() {

    useUserDataListener();

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
                unmountOnBlur: true,
            })}
        >
            <Tab.Screen name="Home" component={TutorHomeScreen} />
            <Tab.Screen name="Earnings" component={EarningsScreen} />
            <Tab.Screen name="Sessions" component={SessionScreen} />
            <Tab.Screen name="Chat" component={ChatScreen} />
        </Tab.Navigator>
    );
}