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
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestoreDB, firebaseStorage } from '../Config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get('window');

const PersonalInfo = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [cvFileUrl, setCvFileUrl] = useState('');
  const [transcriptFileUrl, setTranscriptFileUrl] = useState('');
  const [idFileUrl, setIdFileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = useSelector((state) => state.user.user);
  const userId = currentUser._id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingProfile(true);

        // Fetch user from 'users' collection
        const userDoc = await getDoc(doc(firestoreDB, 'users', userId));
        const userData = userDoc.data();

        if (userData) {
          setName(userData.name || '');
          setLastName(userData.lastName || '');
          setPhoneNumber(userData.phoneNumber || '');
          setGender(userData.gender || '');
          setAddress(userData.address || '');
          setProfilePictureUrl(userData.imageUrl || '');

          // Fetch data from 'Students' or 'Tutors' collection based on role
          if (currentUser.role === 'Tutor') {
            const tutorDoc = await getDoc(doc(firestoreDB, 'Tutors', userId));
            const tutorData = tutorDoc.data();
            setCvFileUrl(tutorData?.cvFileUrl || '');
            setTranscriptFileUrl(tutorData?.transcriptFileUrl || '');
            setIdFileUrl(tutorData?.idFileUrl || '');
          } else if (currentUser.role === 'Student') {
            const studentDoc = await getDoc(doc(firestoreDB, 'Students', userId));
            const studentData = studentDoc.data();
            // Populate any specific fields for students, if necessary
          }
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

      // Update 'users' collection
      const userDocRef = doc(firestoreDB, 'users', userId);
      await updateDoc(userDocRef, {
        name,
        lastName,
        phoneNumber,
        gender,
        address,
        imageUrl: profilePictureUrl,
        ...(currentUser.role === 'Tutor' && {
          cvFileUrl,
          transcriptFileUrl,
          idFileUrl,
        }),
      });

      // Update 'Tutors' or 'Students' collection based on role
      if (currentUser.role === 'Tutor') {
        const tutorDocRef = doc(firestoreDB, 'Tutors', userId);
        await updateDoc(tutorDocRef, {
          name,
          lastName,
          phoneNumber,
          gender,
          address,
          imageUrl: profilePictureUrl,
          cvFileUrl,
          transcriptFileUrl,
          idFileUrl,
        });
      } else if (currentUser.role === 'Student') {
        const studentDocRef = doc(firestoreDB, 'Students', userId);
        await updateDoc(studentDocRef, {
          name,
          lastName,
          phoneNumber,
          gender,
          address,
          imageUrl: profilePictureUrl,
        });
      }

      Alert.alert('Success', 'Your information has been updated.');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user information: ', error);
      Alert.alert('Error', 'Failed to update information.');
    } finally {
      setLoading(false);
    }
  };


  const handlePickImage = async (fileType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUploadingImage(true);
      const url = await uploadFileToStorage(result.assets[0].uri, fileType);
      setProfilePictureUrl(url);
      setUploadingImage(false);
    }
    console.log(result);
  };

  const uploadFileToStorage = async (uri, file) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network Error"));
      };
      xhr.responseType = 'blob';
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    try {
      const storageRef = ref(firebaseStorage, `Tutors/${userId}/${file}`);
      await uploadBytes(storageRef, blob);
      blob.close();
      return await getDownloadURL(storageRef);
    } catch (err) {
      console.error(err.message);
      Alert.alert('Error', 'Failed to upload document.');
    }
  };

  const pickDocument = async (fileType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      const url = await uploadFileToStorage(result.assets[0].uri, fileType);
      if (fileType === 'CV') setCvFileUrl(url);
      else if (fileType === 'Transcript') setTranscriptFileUrl(url);
      else if (fileType === 'ID') setIdFileUrl(url);
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
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Text style={styles.headerText}>Update Personal Information</Text>

            {/* Profile Picture Section */}
            <TouchableOpacity onPress={isEditing ? () => handlePickImage('profile') : null} style={styles.profilePictureContainer}>
              {profilePictureUrl ? (
                  <Image source={{ uri: profilePictureUrl }} style={styles.profilePicture} />
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
                <ActivityIndicator size="small" color="#00243a" style={styles.uploadingIndicator} />
            )}

            {/* User Fields */}
            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} editable={isEditing} />

            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} editable={isEditing} />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} editable={isEditing} />

            <Text style={styles.label}>Gender</Text>
            <TextInput style={styles.input} value={gender} onChangeText={setGender} editable={isEditing} />

            <Text style={styles.label}>Address</Text>
            <TextInput style={styles.input} value={address} onChangeText={setAddress} editable={isEditing} />

            {/* Tutor-Specific Fields */}
            {currentUser.role === 'Tutor' && (
                <View>
                  {/* CV Upload Button */}
                  <TouchableOpacity onPress={isEditing ? () => pickDocument('cv') : null} style={styles.uploadButton}>
                    <Ionicons name="document-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>
                      {cvFileUrl ? 'CV Uploaded' : cvFileUrl ? cvFileUrl : 'Upload CV'}
                    </Text>
                  </TouchableOpacity>

                  {/* Transcript Upload Button */}
                  <TouchableOpacity onPress={isEditing ? () => pickDocument('transcript') : null} style={styles.uploadButton}>
                    <Ionicons name="document-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>
                      {transcriptFileUrl ? 'Transcript Uploaded' : transcriptFileUrl ? transcriptFileUrl : 'Upload Transcript'}
                    </Text>
                  </TouchableOpacity>

                  {/* ID Upload Button */}
                  <TouchableOpacity onPress={isEditing ? () => pickDocument('id'): null} style={styles.uploadButton}>
                    <Ionicons name="document-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>
                      {idFileUrl ? 'ID Uploaded' : idFileUrl ? idFileUrl: 'Upload ID'}
                    </Text>
                  </TouchableOpacity>
                </View>
            )}

            {isEditing && (
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges} disabled={loading}>
                  {loading ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
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
  editButton: {
    backgroundColor: '#cccccc',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    width: '40%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  editIcon: {
    marginRight: 8,
  },
  editButtonText: {
    fontSize: width * 0.04,
    color: '#000000',
  },
  label: {
    fontSize: width * 0.04,
    color: '#333333',
    marginVertical: 5,
    left: 15,
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
  docPickerText: {
    color: '#007BFF',
    marginVertical: 10,
    textAlign: 'center',
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
  uploadButton: {
    flexDirection: 'row', // Display icon and text side by side
    alignItems: 'center',
    backgroundColor: '#464d53', // Blue background for buttons
    padding: 12,
    borderRadius: 15,
    marginVertical: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff', // White text for buttons
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10, // Space between the icon and text
  },
});

export default PersonalInfo;
