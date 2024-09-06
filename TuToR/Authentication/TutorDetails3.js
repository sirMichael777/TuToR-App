import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  KeyboardAvoidingView, ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';


export default function TutorDetails3({ route, navigation }) {
  const { role, email, password, firstName, lastName, phoneNumber } = route.params;
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const windowDimensions = Dimensions.get('window');
  const height = windowDimensions.height;
  const width = windowDimensions.width;

  const handleNext = async () => {
    if (!gender || !address || !dateOfBirth) {
      setError('Please fill in all fields.');
      setShowError(true);
      setInterval(() => {
        setShowError(false);
      }, 2000);
      return;


    }

    navigation.navigate('TutorDetails4', { role, email, password, firstName, lastName, phoneNumber, gender, address, dateOfBirth });


  };

  return (
      <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground 
        source={require('../assets/images/LoadingPage.png')} 
        style={styles.background} 
        imageStyle={styles.imageStyle}
      >
        <View style={[styles.contentContainer, { padding: width * 0.05, marginTop: height * 0.15 }]}>
          <Text style={[styles.title, { fontSize: width * 0.05 }]}>Apply to become a tutor</Text>
          {showError && (<Text style={styles.error}>{error}</Text>)}
          {/* Custom Picker with RNPickerSelect */}
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              onValueChange={(value) => setGender(value)}
              items={[

                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
                { label: 'Other', value: 'Other' },
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: 'Select Gender', value: '' }}
              useNativeAndroidPickerStyle={false}
            />
          </View>
          
          <TextInput 
            placeholder="Address" 
            style={[styles.input, { paddingVertical: height * 0.02 }]} 
            placeholderTextColor="#a9a9a9" 
            value={address}
            onChangeText={setAddress}
          />

          <Text style={[styles.label, { fontSize: width * 0.04 }]}>Date of Birth</Text>
          
          <TouchableOpacity
            style={[styles.input, styles.dateInput, { paddingVertical: height * 0.02 }]}
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

          <TouchableOpacity 
            style={[styles.button, { paddingVertical: height * 0.02 }]}
            onPress={handleNext}
          >
            <Text style={[styles.NextButton, { fontSize: width * 0.04 }]}>Next</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  contentContainer: {
    backgroundColor: 'rgba(0, 36, 58, 0.9)',
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  pickerWrapper: {
    width: '100%',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    marginVertical: 10,
    //paddingLeft: Platform.OS === 'ios' ? 1 : 0, // Padding to align content on iOS
  },
 
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '100%',
  },
  dateInput: {
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: '#00243a',
    borderRadius: 25,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#010202',
    fontFamily: 'Ubuntu_400Regular',
  },
  NextButton:{
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
  }

});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    
    fontSize: 16,
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 25,
    color: '#00243a',
    paddingRight: 30, // to ensure the text is not clipped
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 25,
    color: '#00243a',
    paddingRight: 30, // to ensure the text is not clipped
  },
});
