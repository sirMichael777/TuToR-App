// BottomNavigation.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';

const BottomNavigation = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navItem}>
        <Image source={require('../assets/Home.png')} style={styles.icon} />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('FindTutor')} style={styles.navItem}>
        <Image source={require('../assets/Search.png')} style={styles.icon} />
        <Text style={styles.label}>Find Tutor</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Sessions')} style={styles.navItem}>
        <Image source={require('../assets/TimeCircle.png')} style={styles.icon} />
        <Text style={styles.label}>Sessions</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Chat')} style={styles.navItem}>
        <Image source={require('../assets/Chat.png')} style={styles.icon} />
        <Text style={styles.label}>Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  navItem: {
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    fontSize: 10,
    color: '#000',
    marginTop: 4,
  },
});

export default BottomNavigation;
