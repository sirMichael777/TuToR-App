import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ActivityIndicator, TextInput, Image } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { firestoreDB } from '../Config/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import defaultPic from '../assets/images/defaultImage.jpeg'; // Adjust the path based on your project structure
import {useSelector} from 'react-redux';

const { width, height } = Dimensions.get('window');

const FindTutorScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [customRequest, setCustomRequest] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [noTutorsFound, setNoTutorsFound] = useState(false);
  const [selectedMode, setSelectedMode] = useState('In Person');
  const currentUser = useSelector((state) => state.user.user);
  const scrollViewRef = useRef();

  const handleConfirmBooking = (tutor) => {
      if (!selectedCourse || !date || !startTime || !endTime) {
        alert('Please complete all the fields.');
        return;
      }

      setCurrentStep(0);
      // Navigate to TutorDetailsScreen and pass the booking details in raw form
      navigation.navigate('TutorDetailsScreen', {
        tutor,
        studentName: currentUser.name, // Pass the student name dynamically
        startTime: startTime,     // Pass the raw Date object for start time
        endTime: endTime,         // Pass the raw Date object for end time
        tutoringDate: date,       // Pass the raw Date object for tutoring date
        course: selectedCourse,   // Pass the selected course
        requestTime: new Date(),  // Pass the current Date object for the request time
        customRequest: customRequest || 'No special requests', // Pass any special requests or default
        selectedMode: selectedMode, // Pass the selected mode (e.g., Online or In-Person)
      });
    };


  const options = [
    'Exam Preparation',
    'Homework Assistance',
    'Concept Clarification',
    'Project Guidance',
    'General Tutoring',
    'Other/Custom Request',
  ];

  useEffect(() => {
    if (selectedCourse) {
      fetchTutorsForCourse(selectedCourse).catch(error => {
        console.error("Error fetching tutors:", error);
        setError('Unable to fetch tutors, please try again later.');
      });
    }
  }, [selectedCourse]);

  const fetchTutorsForCourse = async (course) => {
    try {
      setLoading(true);
      console.log("Fetching tutors for course:", course);
      const tutorsRef = collection(firestoreDB, 'Tutors');
      const q = query(tutorsRef, where('courses', 'array-contains', course));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const fetchedTutors = querySnapshot.docs.map((doc) => doc.data());
        setTutors(fetchedTutors);
        setNoTutorsFound(false);
      } else {
        console.log("No tutors found for course:", course);
        setTutors([]);
        setNoTutorsFound(true);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setError('Error fetching tutors, please try again later.');
      setLoading(false);
    }
  };

  const handleOptionPress = (option) => {
    setSelectedOption(option);
    if (option === 'Other/Custom Request') {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true }); // Automatically scroll to the bottom when 'Other/Custom Request' is selected
      }, 300);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.questionText}>Which course do you need assistance with?</Text>
            <RNPickerSelect
              onValueChange={(course) => setSelectedCourse(course)}
              placeholder={{ label: "Select a course", value: null }}
              items={[
                { label: 'ACC1006F/S', value: 'ACC1006F/S' },
                { label: 'AGE1002S', value: 'AGE1002S' },
                { label: 'AST1000S', value: 'AST1000S' },
                { label: 'BIO1000F', value: 'BIO1000F' },
                { label: 'BIO1004S', value: 'BIO1004S' },
                { label: 'CEM1000W', value: 'CEM1000W' },
                { label: 'CSC1015F/S', value: 'CSC1015F/S' },
                { label: 'CSC1016S', value: 'CSC1016S' },
                { label: 'EGS1003S', value: 'EGS1003S' },
                { label: 'FTX1005F/S', value: 'FTX1005F/S' },
                { label: 'GEO1009F', value: 'GEO1009F' },
                { label: 'MAM1000W', value: 'MAM1000W' },
                { label: 'MAM1019H', value: 'MAM1019H' },
                { label: 'MAM1031F', value: 'MAM1031F' },
                { label: 'MAM1032S', value: 'MAM1032S' },
                { label: 'MAM1043H', value: 'MAM1043H' },
                { label: 'MAM1044H', value: 'MAM1044H' },
                { label: 'PHY1004W', value: 'PHY1004W' },
                { label: 'PHY1031F', value: 'PHY1031F' },
                { label: 'STA1000F/S', value: 'STA1000F/S' },
                { label: 'STA1006S', value: 'STA1006S' },
                { label: 'STA1007S', value: 'STA1007S' },
              ]}
              style={styles.pickerSelectStyles}
            />
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContainer}>

            <Text style={styles.labelText}>Select Date</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.buttonText}>
                {date ? date.toLocaleDateString() : "Select Date"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate && selectedDate.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
                    setDate(selectedDate);
                  } else {
                    alert("Please select a future date");
                  }
                }}
              />
            )}


            <Text style={styles.labelText}>Select Start Time</Text>
            <TouchableOpacity style={styles.timeButton} onPress={() => setShowStartTimePicker(true)}>
              <Text style={styles.buttonText}>
                {startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Select Start Time"}
              </Text>
            </TouchableOpacity>
            {showStartTimePicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowStartTimePicker(false);
                  setStartTime(selectedTime);
                }}
              />
            )}


            <Text style={styles.labelText}>Select End Time</Text>
            <TouchableOpacity style={styles.timeButton} onPress={() => setShowEndTimePicker(true)}>
              <Text style={styles.buttonText}>
                {endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Select End Time"}
              </Text>
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowEndTimePicker(false);
                  if (selectedTime) {
                    const oneHourInMillis = 60 * 60 * 1000;
                    // Combine date and time for accurate comparison
                    const startDateTime = new Date(date);
                    startDateTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

                    const endDateTime = new Date(date);
                    endDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
                    setEndTime(selectedTime);
                    // Check if the selected end time is at least 1 hour after the start time
                    // if (endDateTime - startDateTime < oneHourInMillis) {
                    //   alert("End time must be at least 1 hour after the start time.");
                    // } else {
                    //   setEndTime(selectedTime);
                    // }
                  }
                }}
              />
            )}

          </View>
        );


      case 2:
        return (
          <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.instructionText}>
              Tell us what you need help with so we can match you with the right tutor.
            </Text>
            <View style={styles.optionsContainer}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleOptionPress(option)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedOption === option && styles.selectedOptionText,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
              {selectedOption === 'Other/Custom Request' && (
                <TextInput
                  style={styles.customRequestInput}
                  placeholder="Please specify any specific topics, chapters, or questions you'd like to focus on."
                  placeholderTextColor="#ccc"
                  multiline={true}
                  value={customRequest}
                  onChangeText={setCustomRequest}
                />
              )}
            </View>
          </ScrollView>
        );
      case 3:

        return (
          <View style={styles.stepContainer}>
            <View style={styles.modeContainer}>
              <TouchableOpacity onPress={() => setSelectedMode('Online')}>
                <Text style={[
                  styles.modeText,
                  selectedMode === 'Online' && styles.activeModeText,
                ]}>
                  Online
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedMode('In Person')}>
                <Text style={[
                  styles.modeText,
                  selectedMode === 'In Person' && styles.activeModeText,
                ]}>
                  In Person
                </Text>
              </TouchableOpacity>
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <ScrollView contentContainerStyle={{ paddingBottom: height * 0.08 }} style={styles.tutorList}>
                {tutors.length > 0 ? (
                  tutors.map((tutor) => (
                    <View key={tutor._id} style={styles.tutorCard}>
                      <Image
                        source={
                          tutor.imageUrl
                            ? { uri: tutor.imageUrl }
                            : defaultPic
                        }
                        style={styles.tutorImage}
                      />
                      <View style={styles.tutorInfo}>
                        <Text style={styles.tutorName}>
                          {tutor.name} {tutor.lastName}
                        </Text>
                        <Text style={styles.tutorRating}>
                          ⭐ {tutor.rating || 'No rating yet'}
                        </Text>
                        <Text style={styles.tutorPrice}>
                          R{tutor.rate || 'N/A'}/hr
                        </Text>
                      </View>
                      <TouchableOpacity style={styles.selectButton} onPress={() => handleConfirmBooking(tutor)}>
                        <Text style={styles.selectButtonText}>Select</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <View style={styles.noTutorsContainer}>
                    <Text style={styles.noTutorsText}>
                      Sorry, no tutors are available for the selected course right now.
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  const handleBackPress = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} disabled={currentStep === 0}>
          <Ionicons name="arrow-back-outline" size={width * 0.07} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Find Tutor</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
              {currentUser?.imageUrl ? (
                  <Image
                      source={{ uri: currentUser.imageUrl }}
                      style={styles.profileImage} // Add the style for the profile image
                  />
              ) : (
                  <Ionicons name="person-outline" size={30} color="black" style={styles.profileIcon} />
              )}
          </TouchableOpacity>
      </View>
      <View style={styles.progressContainer}>
        <View style={[styles.progressStep, currentStep >= 0 && styles.progressStepActive]} />
        <View style={[styles.progressStep, currentStep >= 1 && styles.progressStepActive]} />
        <View style={[styles.progressStep, currentStep >= 2 && styles.progressStepActive]} />
        <View style={[styles.progressStep, currentStep >= 3 && styles.progressStepActive]} />
      </View>
      {renderStepContent()}
      {currentStep < 3 && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            if (currentStep === 0 && !selectedCourse) {
              alert('Please select a course.');
            } else if (currentStep === 1) {
              if (!date || !startTime || !endTime) {
                alert('Please select a date and time.');
              } else if (startTime >= endTime) {
                alert('Start time must be before the end time.');
              } else {
                setCurrentStep(currentStep + 1);
              }
            } else if (currentStep === 2) {
              if (!selectedOption || (selectedOption === 'Other/Custom Request' && !customRequest)) {
                alert('Please select an option or enter a custom request.');
              } else {
                setCurrentStep(currentStep + 1);
              }
            } else {
              setCurrentStep(currentStep + 1);
            }
          }}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

      )}
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: width * 0.05,
    paddingBottom: height * 0.08,
  },
  header: {
    top: height * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
      textAlign:'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  profileIcon: {
    marginLeft: 15,
  },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 15,
    },
  progressContainer: {
    top: height * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 2,
  },
  progressStepActive: {
    backgroundColor: '#000',
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: width * 0.05,
    marginVertical: height * 0.03,
    textAlign: 'center',
  },
  searchButton: {
    backgroundColor: '#23cbfb',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateButton: {
    backgroundColor: '#23cbfb',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  timeButton: {
    backgroundColor: '#23cbfb',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  durationText: {
    marginTop: height * 0.02,
    fontSize: width * 0.045,
    color: '#000',
    textAlign: 'center',
  },
  instructionText: {
    fontSize: width * 0.05,
    marginVertical: height * 0.03,
    textAlign: 'center',
  },
  optionsContainer: {
    backgroundColor: '#23cbfb',
    borderRadius: width * 0.05,
    padding: width * 0.05,
  },
  optionButton: {
    paddingVertical: height * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    color: '#ffffff',
    fontSize: width * 0.045,
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#000',
  },
 customRequestInput: {
     marginTop: height * 0.03, // Add margin to the text input
     backgroundColor: '#ffffff',
     borderRadius: 10,
     padding: width * 0.03,
     fontSize: width * 0.04,
     color: '#000',
     height: height * 0.1,
   },

   nextButton: {
     backgroundColor: '#007BFF',
     borderRadius: width * 0.05,
     paddingVertical: height * 0.02,
     paddingHorizontal: width * 0.2,
     marginTop: height * 0.03,  // Create space between the options and the button
     alignItems: 'center',
     alignSelf: 'center',
     marginBottom: height * 0.05,  // Add margin at the bottom for spacing
   },
  nextButtonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  tutorList: {
    flex: 1,
  },
  tutorCard: {
    flexDirection: 'row', // Align the image and text horizontally
    backgroundColor: '#23cbfb',
    borderRadius: width * 0.05,
    padding: width * 0.05,
    marginBottom: height * 0.02,
    alignItems: 'center', // Align tutor info and image in the center
  },
  tutorImage: {
    width: width * 0.2, // Size of the tutor image
    height: width * 0.2,
    borderRadius: (width * 0.2) / 2, // Make the image circular
    marginRight: width * 0.05, // Space between image and text
  },
  tutorInfo: {
    flex: 1,
    justifyContent: 'center', // Ensure that text is vertically centered
  },
  tutorName: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#fff',
  },
  tutorRating: {
    fontSize: width * 0.04,
    color: '#fff',
  },
  tutorPrice: {
    fontSize: width * 0.045,
    color: '#fff',
    marginTop: height * 0.01,
  },
  selectButton: {
    backgroundColor: '#000',
    borderRadius: width * 0.05,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: height * 0.02,
  },
  modeText: {
    fontSize: width * 0.045,
    marginHorizontal: width * 0.03,
    color: '#aaa',
  },
  activeModeText: {
    fontWeight: 'bold',
    color: '#000',
    textDecorationLine: 'underline',
  },
  noTutorsContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTutorsText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  pickerSelectStyles: {
    inputIOS: {
      backgroundColor: '#f0f0f0',
      borderRadius: 25,
      paddingHorizontal: 20,
      marginVertical: 10,
      height: 50,
      fontSize: 16,
      color: '#000',
    },
    inputAndroid: {
      backgroundColor: '#f0f0f0',
      borderRadius: 25,
      paddingHorizontal: 20,
      marginVertical: 10,
      height: 50,
      fontSize: 16,
      color: '#000',
    },
    labelText: {
      fontSize: width * 0.04,
      fontWeight: 'bold',
      marginBottom: height * 0.01,
      color: '#000',
    },
  },
});
export default FindTutorScreen;
