import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const AuthTypeScreen = ({ route,navigation }) => {

    const { action } = route.params;

    return (
        <ImageBackground source={require('../assets/images/SignUpScreen.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.signInContainer}>
                    <Text style={styles.signInText}>{action === 'SignUp' ? 'Sign up as?' : 'Sign in as?'}</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate(action === 'SignUp' ? 'StudentDetails1' : 'SignInScreen', { role: 'Student' })}
                    >
                        <Text style={styles.buttonText}>Student</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate(action === 'SignUp' ? 'TutorDetails1' : 'SignInScreen', { role: 'Tutor' })}
                    >
                        <Text style={styles.buttonText}>Tutor</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signInContainer: {
        top: height * 0.06,
        width: width * 0.8,
        backgroundColor: '#001F3F',
        padding: width * 0.05,
        borderRadius: 10,
    },
    signInText: {
        fontSize: width * 0.06,
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: height *0.02,
    },
    button: {
        backgroundColor: '#ffffff',
        paddingVertical: height * 0.02,
        marginVertical: height * 0.01,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#001F3F',
        fontSize: width * 0.045,
        fontWeight: 'bold',
    },
});

export default AuthTypeScreen;
