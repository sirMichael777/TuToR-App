import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  Image,
    SafeAreaView,
  Platform, KeyboardAvoidingView, ScrollView
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestoreDB, firebaseStorage } from '../Config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import {useSelector} from "react-redux";
import {Ionicons} from "@expo/vector-icons";

const { width, height } = Dimensions.get('window');

const PersonalInfo = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = useSelector((state) => state.user.user);
  const userId = currentUser._id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingProfile(true);
        const userDoc = await getDoc(doc(firestoreDB, 'users', userId));
        const userData = userDoc.data();
        if (userData) {
          setName(userData.name || '');
          setLastName(userData.lastName || '');
          setPhoneNumber(userData.phoneNumber || '');
          setGender(userData.gender || '');
          setAddress(userData.address || '');
          setProfilePictureUrl(userData.imageUrl || '');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSaveChanges = async () => {
    if (!name || !lastName || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      const userDocRef = doc(firestoreDB, 'users', userId);

      // Update user document in 'users' collection
      await updateDoc(userDocRef, {
        name: name,
        lastName: lastName,
        phoneNumber: phoneNumber,
        gender: gender,
        address: address,
        imageUrl: profilePictureUrl,
      });

      // Conditionally update additional collections (students or tutors)
      if (currentUser.role === 'student') {
        const studentDocRef = doc(firestoreDB, 'Students', userId);
        await updateDoc(studentDocRef, {
          name: name,
          lastName: lastName,
          phoneNumber: phoneNumber,
          gender: gender,
          address: address,
          imageUrl: profilePictureUrl,
        });
      }

      if (currentUser.role === 'tutor') {
        const tutorDocRef = doc(firestoreDB, 'Tutors', userId);
        await updateDoc(tutorDocRef, {
          name: name,
          lastName: lastName,
          phoneNumber: phoneNumber,
          gender: gender,
          address: address,
          imageUrl: profilePictureUrl,
        });
      }

      setIsEditing(false);
      Alert.alert('Success', 'Your information has been updated.');

    } catch (error) {
      console.error('Error updating user information: ', error);
      Alert.alert('Error', 'Failed to update information.');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.assets[0].uri);
      setUploadingImage(true);

      try {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        const storageRef = ref(firebaseStorage, `profile_pictures/${userId}`);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        setProfilePictureUrl(url);
        console.log('Image uploaded successfully! URL:', url);
      } catch (error) {
        console.error('Error uploading image:', error.message || error);
        Alert.alert('Error', 'Failed to upload profile picture. Please try again.');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  if (loadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00243a" />
        <Text>Loading your profile...</Text>
      </View>
    );
  }

  return (
      <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

        <Text style={styles.headerText}>Update Personal Information</Text>


        <TouchableOpacity onPress={isEditing ? handlePickImage : null}  style={styles.profilePictureContainer}>
          {profilePictureUrl ? (
              <Image source={{uri: currentUser.imageUrl}} style={styles.profilePicture}/>
          ) : profilePicture ? (
              <Image source={{uri: currentUser.imageUrl}} style={styles.profilePicture}/>
          ) : (
              <Text style={styles.profilePictureText}>Add Profile Picture</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
        >
          <Ionicons
              name={isEditing ? 'close' : 'create'} // Show "create" icon for edit and "close" icon for cancel
              size={20}
              color="#000"
              style={styles.editIcon}
          />
          <Text style={styles.editButtonText}>{isEditing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>


        {uploadingImage && (
            <ActivityIndicator size="small" color="#00243a" style={styles.uploadingIndicator}/>
        )}

        <Text style={styles.label}>First Name</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            value={name}
            onChangeText={setName}
            editable={isEditing}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
            editable={isEditing}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={phoneNumber}
            keyboardType="phone-pad"
            onChangeText={setPhoneNumber}
            editable={isEditing}
        />

        <Text style={styles.label}>Gender</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter your gender"
            value={gender}
            onChangeText={setGender}
            editable={isEditing}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
            editable={isEditing}
        />

        {isEditing && ( // Only show save button when editing
            <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveChanges}
                disabled={loading}
            >
              {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
        )}
        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
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
  editButton: {
    backgroundColor: '#cccccc',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    width: '40%',
    alignSelf: 'center',
    flexDirection: 'row', // Add this to display icon and text side by side
    justifyContent: 'center', // Center the icon and text
  },
  editIcon: {
    marginRight: 8, // Add some space between the icon and text
  },
  editButtonText: {
    fontSize: width * 0.04,
    color: '#000000',
  },
  label: {
    fontSize: width * 0.04,
    color: '#333333',
    marginVertical: 5,
    left:15,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: height * 0.02,
    marginVertical: 10,
    fontSize: width * 0.04,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#00243a',
    borderRadius: 25,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  profilePicture: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    borderColor: '#cccccc',
    borderWidth: 1,
  },
  profilePictureText: {
    fontSize: width * 0.05,
    color: '#cccccc',
  },
  uploadingIndicator: {
    marginTop: 10,
  },
});

export default PersonalInfo;
