import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const Settings = ({ navigation }) => {
  const handleChangePassword = () => {
    // Navigate to the Change Password screen
    navigation.navigate('ChangePassword');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => {
            // Add your delete account logic here
            Alert.alert('Account Deleted', 'Your account has been deleted.');
          } 
        },
      ]
    );
  };

  const handleAbout = () => {
    // Navigate to the About screen
    navigation.navigate('About');
  };

  const handleNotificationsPreferences = () => {
    // Navigate to Notification Preferences screen
    navigation.navigate('NotificationsPreferences');
  };

  const handlePrivacySettings = () => {
    // Navigate to Privacy Settings screen
    navigation.navigate('PrivacySettings');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Settings</Text>

      <TouchableOpacity style={styles.optionButton} onPress={handleAbout}>
        <Ionicons name="information-circle-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
        <Text style={styles.optionText}>About</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton} onPress={handleChangePassword}>
        <Ionicons name="key-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
        <Text style={styles.optionText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton} onPress={handleNotificationsPreferences}>
        <Ionicons name="notifications-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
        <Text style={styles.optionText}>Notification Preferences</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton} onPress={handlePrivacySettings}>
        <Ionicons name="shield-checkmark-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
        <Text style={styles.optionText}>Privacy Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton} onPress={handleDeleteAccount}>
        <Ionicons name="trash-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
        <Text style={styles.optionText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: height * 0.03,
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#ffffff',
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.02,
    marginVertical: height * 0.01,
    backgroundColor: '#23cbfb',
    borderRadius: 10,
    paddingHorizontal: width * 0.05,
  },
  optionIcon: {
    marginRight: width * 0.03,
  },
  optionText: {
    color: '#ffffff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default Settings;
