import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firestoreDB } from "../Config/firebaseConfig";
import { collection, setDoc, doc } from 'firebase/firestore';
import { useSelector } from "react-redux"


const { width, height } = Dimensions.get('window');

const TutorDetailsScreen = ({ route, navigation }) => {
  const currentUser = useSelector((state) => state.user.user);
  const {
    tutor,
    studentName,
    startTime,
    endTime,
    tutoringDate,
    course,
    requestTime,
    customRequest,
    selectedMode,
  } = route.params;  // Get the tutor data from the navigation route

  const handleBooking = async (bookingDetails) => {
    try {
      // Generate a new document reference for 'Bookings' with an auto-generated ID
      const bookingRef = doc(collection(firestoreDB, 'Bookings'));

      // Store the booking details in Firestore
      await setDoc(bookingRef, {
        tutor: bookingDetails.tutorId,
        studentName: bookingDetails.studentName,
        course: bookingDetails.course,
        tutoringDate: bookingDetails.tutoringDate,
        startTime: bookingDetails.startTime,
        endTime: bookingDetails.endTime,
        requestTime: bookingDetails.requestTime,
        customRequest: bookingDetails.customRequest,
        selectedMode: bookingDetails.selectedMode,
        status: 'pending',  // Booking status starts as 'pending'
        bookingRef: bookingRef.id,  // Include the generated booking reference (from the doc id)
        student: currentUser,
      });

      // After storing, show confirmation
      alert('Booking request sent successfully!\nBooking Reference: ${bookingRef.id}');

      // Optionally navigate back or to a confirmation screen
      navigation.goBack();  // Or navigate to another screen, such as a Booking Confirmation screen
    } catch (error) {
      console.error('Error sending booking request:', error);
      alert('Failed to send booking request, please try again.');
    }
  };
  return (
    <SafeAreaView style={styles.containerwider}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={width * 0.07} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Tutor Details</Text>
        </View>

        {/* Tutor Profile Section */}
        <View style={styles.profileContainer}>
          <Image
            source={tutor.imageUrl ? { uri: tutor.imageUrl } : require('../assets/images/defaultImage.jpeg')}
            style={styles.tutorImage}
          />
          <Text style={styles.tutorName}>
            {tutor.firstName} {tutor.lastName}
          </Text>
          <Text style={styles.tutorRating}>⭐ {tutor.rating || 'No rating yet'}</Text>
        </View>

        {/* Additional Details */}
        <View style={styles.detailsContainer}>
          {/* Experience */}
          <Text style={styles.detailsHeader}>Experience</Text>
          <Text style={styles.detailsText}>
            {tutor.experience ? `${tutor.experience} years` : "No experience provided"}
          </Text>

          {/* Languages */}
          <Text style={styles.detailsHeader}>Languages</Text>
          <Text style={styles.detailsText}>{tutor.languages?.join(', ') || "Languages not provided"}</Text>

          {/* Courses Taught */}
          <Text style={styles.detailsHeader}>Courses Taught</Text>
          {tutor.courses?.map((course, index) => (
            <Text key={index} style={styles.detailsText}>{course}</Text>
          ))}

          {/* Reviews */}
          <Text style={styles.detailsHeader}>Reviews</Text>
          {tutor.reviews?.length > 0 ? (
            tutor.reviews.map((review, index) => (
              <View key={index} style={styles.reviewContainer}>
                <Text style={styles.reviewText}>{review}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.detailsText}>No reviews available</Text>
          )}
        </View>

        {/* Book a Session Button */}
        <TouchableOpacity style={styles.bookButton} onPress={() => {
          // You can replace this with the actual function to send booking details
          handleBooking({
            studentName,   // Passed from FindTutorScreen
            startTime,
            endTime,
            tutoringDate,
            course,
            requestTime,
            customRequest,
            selectedMode,
            tutor: tutor, // Assuming there's a tutor ID to associate with the booking
          });
        }}>
          <Text style={styles.bookButtonText}>Book a Session</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerwider: {
    flex: 1,
  },
  container: {
    padding: width * 0.05,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: width * 0.05,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  tutorImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    marginBottom: height * 0.02,
  },
  tutorName: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  tutorRating: {
    fontSize: width * 0.045,
    color: '#888',
    marginBottom: height * 0.02,
  },
  detailsContainer: {
    marginVertical: height * 0.02,
  },
  detailsHeader: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  detailsText: {
    fontSize: width * 0.04,
    color: '#555',
    marginBottom: height * 0.01,
  },
  reviewContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: width * 0.03,
    marginBottom: height * 0.01,
  },
  reviewText: {
    fontSize: width * 0.04,
    color: '#555',
  },
  bookButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    marginTop: height * 0.03,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default TutorDetailsScreen;
