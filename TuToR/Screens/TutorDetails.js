import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Dimensions, Alert, Modal, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function TutorDetails({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [experience, setExperience] = useState('');
  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState('');
  const [rate, setRate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const windowDimensions = Dimensions.get('window');
  const height = windowDimensions.height;
  const width = windowDimensions.width;

  const languageOptions = [
    { id: 'en', name: 'English' }, 
    { id: 'xh', name: 'Xhosa' },
    { id: 'zu', name: 'Zulu' },
    { id: 'ss', name: 'Swati' },
    { id: 'nr', name: 'Ndebele' },
    { id: 'nso', name: 'Northern Sotho' },
    { id: 'st', name: 'Sotho' },
    { id: 'ts', name: 'Tsonga' },
    { id: 'tn', name: 'Tswana' },
    { id: 've', name: 'Venda' },
    { id: 'af', name: 'Afrikaans' }, 
  ];

  const handleLanguageSelection = (language) => {
    if (languages.includes(language)) {
      setLanguages(languages.filter((lang) => lang !== language));
    } else {
      setLanguages([...languages, language]);
    }
  };

  const handleNext = () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName || !phoneNumber || !gender || !address || !dateOfBirth || !experience || !languages.length || !courses || !rate) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    // Navigate to the next screen or handle the action
    navigation.navigate('NextScreen'); // Replace 'NextScreen' with the actual screen name
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/images/LoadingPage.png')} 
        style={styles.background}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.fixedContainer}>
          {/* Logo */}
          <Text style={[styles.title, { fontSize: width * 0.08 }]}>TuToR</Text>
          
          {/* Scrollable Form Fields */}
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Email Input */}
            <TextInput 
              placeholder="Email" 
              style={styles.input} 
              placeholderTextColor="#a9a9a9" 
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Password Input */}
            <TextInput 
              placeholder="Password" 
              secureTextEntry 
              style={styles.input} 
              placeholderTextColor="#a9a9a9" 
              value={password}
              onChangeText={setPassword}
            />

            {/* Confirm Password Input */}
            <TextInput 
              placeholder="Confirm Password" 
              secureTextEntry 
              style={styles.input} 
              placeholderTextColor="#a9a9a9" 
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {/* First Name Input */}
            <TextInput 
              placeholder="First Name" 
              style={styles.input} 
              placeholderTextColor="#a9a9a9" 
              value={firstName}
              onChangeText={setFirstName}
            />

            {/* Last Name Input */}
            <TextInput 
              placeholder="Last Name" 
              style={styles.input} 
              placeholderTextColor="#a9a9a9" 
              value={lastName}
              onChangeText={setLastName}
            />

            {/* Phone Number Input */}
            <TextInput 
              placeholder="Phone Number" 
              style={styles.input} 
              placeholderTextColor="#a9a9a9" 
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            {/* Gender Picker */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={gender}
                style={styles.picker}
                onValueChange={(itemValue) => setGender(itemValue)}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            {/* Address Input */}
            <TextInput 
              placeholder="Address" 
              style={styles.input} 
              placeholderTextColor="#a9a9a9" 
              value={address}
              onChangeText={setAddress}
            />

            {/* Date of Birth Picker */}
            <Text style={[styles.label, { fontSize: width * 0.04 }]}>Date of Birth</Text>
            <TouchableOpacity
              style={[styles.input, styles.dateInput]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.buttonText}>{dateOfBirth.toDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || dateOfBirth;
                  setShowDatePicker(false);
                  setDateOfBirth(currentDate);
                }}
              />
            )}

            {/* Experience Picker */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={experience}
                style={styles.picker}
                onValueChange={(itemValue) => setExperience(itemValue)}
              >
                <Picker.Item label="Tutoring experience" value="" />
                <Picker.Item label="0-1 years" value="0-1" />
                <Picker.Item label="1-2 years" value="1-2" />
                <Picker.Item label="2-3 years" value="2-3" />
                <Picker.Item label="3-4 years" value="3-4" />
                <Picker.Item label="4-5 years" value="4-5" />
                <Picker.Item label="5+ years" value="5+" />
              </Picker>
            </View>

            {/* Languages Modal */}
            <TouchableOpacity
              style={[styles.input, styles.languageInput]}
              onPress={() => setShowLanguageModal(true)}
            >
              <Text style={styles.languageText}>
                {languages.length > 0 ? languages.join(', ') : 'Languages'}
              </Text>
            </TouchableOpacity>

            {/* Courses Input */}
            <TextInput 
              placeholder="Courses" 
              style={styles.input} 
              placeholderTextColor="#a9a9a9" 
              value={courses}
              onChangeText={setCourses}
            />

            {/* Rate Input */}
            <TextInput 
              placeholder="Rate per hour (ZAR)" 
              style={styles.input} 
              placeholderTextColor="#a9a9a9" 
              value={rate}
              onChangeText={setRate}
              keyboardType="numeric"
            />

            {/* Next Button */}
            <TouchableOpacity 
              style={styles.button}
              onPress={handleNext}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ImageBackground>

      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLanguageModal}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Languages</Text>
            <Text style={styles.modalSubtitle}>You can select multiple languages</Text>
            <ScrollView>
              {languageOptions.map((language) => (
                <TouchableOpacity
                  key={language.id}
                  onPress={() => handleLanguageSelection(language.name)}
                  style={styles.modalOption}
                >
                  <Text style={styles.languageText}>{language.name}</Text>
                  {languages.includes(language.name) && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  fixedContainer: {
    backgroundColor: 'rgba(0, 36, 58, 0.9)',
    borderRadius: 20,
    width: '90%',
    top: 90,
    height: '70%', // Set height to ensure it's fixed
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    marginVertical: 10,
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#00243a',
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '100%',
    height: 50,
  },
  dateInput: {
    justifyContent: 'center',
  },
  languageInput: {
    justifyContent: 'center',
    height: 50,
  },
  button: {
    backgroundColor: '#00243a',
    borderRadius: 25,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Ubuntu_400Regular',
    color: '#00243a',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Ubuntu_400Regular',
    color: '#777',
    marginBottom: 10,
    textAlign: 'left',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginVertical: 5,
  },
  languageText: {
    fontSize: 16,
    fontFamily: 'Ubuntu_400Regular',
    color: '#00243a',
  },
  checkMark: {
    fontSize: 16,
    fontFamily: 'Ubuntu_400Regular',
    color: '#00243a',
  },
  closeButton: {
    backgroundColor: '#00243a',
    borderRadius: 15,
    marginTop: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
  },
});
