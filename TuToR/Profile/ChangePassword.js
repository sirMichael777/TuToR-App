import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For the eye icon
import { firebaseAuth } from "../Config/firebaseConfig";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

const {  height } = Dimensions.get('window');

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // Toggle current password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle confirm password visibility

  const handleChangePassword = async () => {

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirmation do not match.');
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = firebaseAuth.currentUser;

      if (user) {
        // Reauthenticate the user first
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // Update the password
        await updatePassword(user, newPassword);

        Alert.alert('Success', 'Your password has been changed successfully.');
        setIsSubmitting(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        navigation.goBack(); // Go back to the previous screen
      }
    } catch (error) {
      console.error('Error changing password:', error);
      // Handle different error cases for reauthentication and updating the password
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Current password is incorrect.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Error', 'The new password is too weak.');
      } else {
        Alert.alert('Error', 'Failed to change password. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={28} color="#010202" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Change Password</Text>
        </View>

        <Text style={styles.label}>Current Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
              style={styles.input}
              secureTextEntry={!showCurrentPassword} // Control password visibility
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
          />
          <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            <Ionicons
                name={showCurrentPassword ? 'eye-off' : 'eye'}
                size={24}
                color="grey"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
              style={styles.input}
              secureTextEntry={!showNewPassword} // Control password visibility
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
          />
          <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Ionicons
                name={showNewPassword ? 'eye-off' : 'eye'}
                size={24}
                color="grey"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm New Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
              style={styles.input}
              secureTextEntry={!showConfirmPassword} // Control password visibility
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
          />
          <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={24}
                color="grey"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
            style={styles.changePasswordButton}
            onPress={handleChangePassword}
            disabled={isSubmitting}
        >
          <Text style={styles.changePasswordButtonText}>
            {isSubmitting ? 'Changing...' : 'Change Password'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    top: height * 0.03,
    padding: 20,
    backgroundColor: '#f5f5f5',
    minHeight: height,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  backIcon: {
    padding: 10, // Increased padding for better touchable area
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, // Center the text with flex
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    paddingRight: 10,
  },
  changePasswordButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
  },
  changePasswordButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ChangePassword;
